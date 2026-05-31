---
title: "Async Tasks in Django with Celery + Redis"
excerpt: "Stop blocking your HTTP response cycle. A hands-on walkthrough of task queues — from installation to a real-world order processing example with retries, parallel dispatch, and periodic tasks."
date: "2026-05-31"
readTime: "8 min read"
tags: ["Django", "Celery", "Redis", "Backend", "Python"]
---

Every web application eventually hits the same wall: an action that takes too long to complete within a single HTTP request. Sending emails, generating reports, calling third-party APIs, resizing images — these operations don't belong inside your view. They belong in a task queue.

This article walks through a complete, practical example of integrating **Celery** and **Redis** into a Django project, from zero to a working asynchronous pipeline. No hand-waving. Real code.

The companion GitHub repo is available at [github.com/Eduardo-Lucas/django-celery-redis](https://github.com/Eduardo-Lucas/django-celery-redis).

## The Problem We're Solving

Imagine an e-commerce endpoint that processes an order. It needs to: charge the customer, send a confirmation email, notify the warehouse, and update an external ERP. Doing all of that synchronously blocks the response for several seconds — a terrible user experience and a waste of a precious Gunicorn worker.

The solution is to do the *minimum necessary work synchronously* (persist the order, return a response) and dispatch everything else as background tasks.

## Setup & Installation

We'll use Redis as both the message broker and the result backend. It's fast, battle-tested with Celery, and dead simple to spin up locally with Docker.

### Dependencies

```bash
pip install celery[redis] django-celery-results dj-database-url
```

Then start Redis. If you already have Redis running locally (check with `redis-cli ping` — you should get `PONG`), skip this step:

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

**Port already in use?** If Docker returns `address already in use` on port 6379, Redis is already running on your machine. Skip the `docker run` step entirely.

### Django Settings

```python
INSTALLED_APPS = [
    # ... your apps
    "django_celery_results",
]

# Database — SQLite locally, PostgreSQL via DATABASE_URL in production
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
# Uncomment for PostgreSQL:
# import dj_database_url
# DATABASES["default"] = dj_database_url.parse(config("DATABASE_URL"))

# Celery configuration
CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "django-db"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "America/Bahia"
CELERY_TASK_TRACK_STARTED = True
CELERY_RESULT_EXPIRES = 60 * 60 * 24 * 7  # 7 days
```

**DATABASE_URL gotcha:** If `DATABASE_URL` is set in your environment but the database doesn't exist yet, Django will fail on startup with `OperationalError`. For local development, leave it unset and rely on SQLite.

## Creating the Celery App

```python
# myproject/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")

app = Celery("myproject")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

Then expose it in `__init__.py` so it loads when Django starts:

```python
# myproject/__init__.py
from .celery import app as celery_app

__all__ = ("celery_app",)
```

## Writing Real Tasks

Each Django app that needs async work gets a `tasks.py` file. Celery's autodiscovery finds it automatically.

```python
# orders/tasks.py
import logging
from celery import shared_task
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_order_confirmation(self, order_id: int) -> dict:
    from .models import Order
    try:
        order = Order.objects.select_related("customer").get(pk=order_id)
        send_mail(
            subject=f"Order #{order.id} confirmed",
            message=f"Hi {order.customer.name}, your order is confirmed.",
            from_email="hi@eduardo-lucas-dev.com",
            recipient_list=[order.customer.email],
        )
        return {"status": "ok", "order_id": order_id}
    except Order.DoesNotExist as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=5, default_retry_delay=30)
def notify_warehouse(self, order_id: int) -> dict:
    import httpx
    from .models import Order
    order = Order.objects.prefetch_related("items").get(pk=order_id)
    payload = {
        "order_id": order.id,
        "items": list(order.items.values("sku", "quantity")),
    }
    try:
        resp = httpx.post("https://warehouse.internal/api/fulfill", json=payload, timeout=10)
        resp.raise_for_status()
        return {"status": "dispatched", "order_id": order_id}
    except httpx.HTTPError as exc:
        raise self.retry(exc=exc)


@shared_task
def sync_to_erp(order_id: int) -> None:
    from .models import Order
    order = Order.objects.get(pk=order_id)
    logger.info("Order %s synced to ERP", order_id)
```

Use `@shared_task` instead of `@app.task` — it keeps your app modules decoupled from the Celery instance, which is critical for reusability and testability.

## Dispatching from the View

```python
# orders/views.py
from celery import group
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .tasks import send_order_confirmation, notify_warehouse, sync_to_erp


@csrf_exempt
@require_POST
def place_order(request):
    # 1. Persist the order synchronously
    order = Order.objects.create(customer_id=request.POST["customer_id"])

    # 2. Email + warehouse run in parallel via group()
    group(
        send_order_confirmation.s(order.id),
        notify_warehouse.s(order.id),
    ).delay()

    # 3. Fire-and-forget for ERP
    sync_to_erp.delay(order.id)

    # 4. Return immediately
    return JsonResponse({"order_id": order.id, "status": "accepted"}, status=201)
```

## Running Everything

First run only — generate and apply migrations:

```bash
python manage.py makemigrations orders
python manage.py migrate
```

Then open four terminal tabs:

```bash
# Tab 1 — Django
python manage.py runserver

# Tab 2 — Celery worker
celery -A myproject worker --loglevel=info --concurrency=4

# Tab 3 — Celery Beat (periodic tasks)
celery -A myproject beat --loglevel=info

# Tab 4 — Flower dashboard at http://localhost:5555
celery -A myproject flower --port=5555
```

## Scheduled Tasks with Celery Beat

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    "daily-erp-reconciliation": {
        "task": "orders.tasks.reconcile_erp_orders",
        "schedule": crontab(hour=3, minute=0),
    },
    "hourly-pending-cleanup": {
        "task": "orders.tasks.cancel_stale_pending_orders",
        "schedule": crontab(minute=0),
    },
}
```

**Production warning:** Never run multiple Beat instances. Run Beat as a single dedicated process, separate from the workers.

## Testing Without a Broker

```python
@pytest.mark.django_db
def test_confirmation_email_sent(order):
    with patch("orders.tasks.send_mail") as mock_mail:
        result = send_order_confirmation.apply(args=[order.id])
    assert result.successful()
    mock_mail.assert_called_once()
```

Use `.apply()` to run tasks synchronously in tests — no broker, no Redis required.

## Production Checklist

- Set `CELERY_TASK_SERIALIZER = "json"` — never use pickle in production
- Configure `max_retries` and `default_retry_delay` on every task
- Run workers and Beat as separate systemd services or containers
- Set `CELERY_RESULT_EXPIRES` to avoid unbounded DB growth
- Monitor with Flower or Prometheus + celery-exporter
- Never pass full ORM objects as task arguments — pass IDs only

That last point deserves emphasis: **always pass primitive IDs, not model instances**. Model instances carry stale data by the time the task runs. Fetch fresh data inside the task.

## Wrapping Up

Celery and Redis are a mature, proven combination for Django background work. The pattern is always the same: keep views thin, delegate slow work to tasks, handle retries at the task level, and keep task arguments serializable.

The full source for this example is available on GitHub — structured to drop straight into any Django project.
