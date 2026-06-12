---
title: "Stop Using Django REST Framework for Internal APIs"
excerpt: "DRF is battle-tested and irreplaceable for public APIs. But for internal endpoints consumed by your own frontend, it's ceremony masquerading as structure. There's a better tool."
date: "2026-06-12"
readTime: "7 min read"
tags: ["Django", "DRF", "Django Ninja", "Python", "Backend"]
---

A few months ago I was reviewing a Django service that exposed a handful of endpoints consumed exclusively by a React frontend sitting in the same monorepo. The whole thing was wrapped in Django REST Framework — serializers, viewsets, routers, the full ceremony. The API had six endpoints. Six. The `serializers.py` file alone was longer than the entire frontend data layer.

That's the moment I started paying closer attention to what DRF is actually solving, and for whom.

---

## The Case For DRF (And It's a Real Case)

Django REST Framework is a remarkable piece of software. It's been around since 2011, it's battle-tested on APIs that serve millions of requests per day, and its documentation is some of the best in the Python ecosystem. If you're building a public API — one that third-party developers will consume, one that needs versioning, one that ships an OpenAPI schema as a contract with the outside world — DRF is still the right answer.

Here's why.

**Maturity and ecosystem.** DRF has a decade-plus of production hardening behind it. Libraries like `drf-spectacular`, `drf-yasg`, `djangorestframework-simplejwt`, and `django-filter` slot in cleanly. When you hit an edge case, there's a Stack Overflow thread from 2017 that already answered it.

**Serializers as a validation layer.** DRF's `Serializer` class does a lot of heavy lifting: it validates incoming data, coerces types, handles nested relationships, and gives you fine-grained control over representation. For a public API where you cannot trust the shape of incoming data and where the serialized output is a published contract, this explicitness is a feature.

**Class-based views and permissions.** The `APIView` / `ViewSet` / `Router` hierarchy gives you a predictable structure for large teams. Junior developers can follow the pattern. Code reviews are easier because everyone knows where to look.

**Browsable API.** This sounds trivial until you're onboarding a frontend developer who's never touched Postman. The browsable API has saved more cross-team meetings than I can count.

---

## The Case Against DRF for Internal APIs

Now let's talk about the tax you pay for all of that.

**Boilerplate compounds fast.** For every resource you add, you write a model, a serializer, a view or viewset, and wire it to a router. Each of those layers can diverge. A `UserSerializer` that doesn't match the `User` model because someone updated one and forgot the other is a bug that lives silently until a frontend developer reports it at 4pm on a Friday.

**Runtime type validation only.** DRF validates at runtime. Your editor doesn't know what shape `serializer.validated_data` is. You're flying on faith until the tests run.

**No native async support (until recently, partially).** DRF's views are synchronous by design. Async support exists as a third-party experiment, but it's not first-class. If your internal service needs async endpoints — for database concurrency, for calling other services — you're working against the grain.

**The cognitive overhead is real.** For an internal API consumed by one team, the `Serializer` → `ViewSet` → `Router` model is ceremony, not structure. It takes longer to write and longer to read.

---

## Enter Django Ninja

Django Ninja is a FastAPI-inspired framework that sits on top of Django. It uses Python type hints for request and response validation via Pydantic, generates an OpenAPI schema automatically, and has first-class async support.

Here's a DRF endpoint for creating an article:

```python
# serializers.py
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "body", "published_at"]

# views.py
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

# urls.py
router = DefaultRouter()
router.register(r"articles", ArticleViewSet)
urlpatterns = router.urls
```

Here's the same endpoint in Django Ninja:

```python
# schemas.py
class ArticleIn(Schema):
    title: str
    body: str

class ArticleOut(Schema):
    id: int
    title: str
    body: str
    published_at: datetime

# api.py
@api.post("/articles", response=ArticleOut, auth=django_auth)
def create_article(request, payload: ArticleIn):
    article = Article.objects.create(**payload.dict())
    return article
```

The output contract is explicit in the function signature. Your editor knows what `payload` is. The OpenAPI docs are generated for free. No router, no viewset inheritance, no separate serializer file.

---

## Why Ninja Wins for Internal APIs

**Type safety all the way down.** Because Ninja uses Pydantic under the hood, request bodies and response schemas are real Python types. Mypy and Pyright understand them. Your IDE autocompletes them. Validation errors surface at the schema definition, not at runtime in production.

**Less surface area.** An internal API between your Django backend and your own frontend doesn't need three files to define one endpoint. Ninja collapses serializer, view, and routing into a single, readable function. When a new team member opens `api.py`, they understand the contract immediately.

**Async-native.** Ninja supports async views out of the box. If your internal endpoints hit async ORM queries or make outbound HTTP calls to other services, you can write:

```python
@api.get("/articles/{article_id}", response=ArticleOut)
async def get_article(request, article_id: int):
    article = await Article.objects.aget(pk=article_id)
    return article
```

DRF makes you reach for third-party packages or restructure your view layer to get there.

**Automatic schema, zero effort.** The OpenAPI schema is generated from your type hints. Not from a separate annotation layer, not from docstrings, not from a separate `drf-spectacular` configuration. From the types you already wrote.

**Django compatibility.** This is the underrated part. Ninja runs inside Django. You keep your ORM, your auth, your middleware, your signals, your admin. You're not migrating to FastAPI — you're adding a modern API layer to your existing Django project. The migration cost is low and reversible.

---

## Why You Should NOT Use Django Ninja for Public APIs

Here's the nuance that gets lost in "DRF vs Ninja" takes: the boundary matters.

A public API is a contract with developers you don't know, using clients you didn't write, in languages you might not support. That changes everything.

**Versioning is immature.** DRF has established patterns for API versioning — URL-based, header-based, namespace-based. Ninja's versioning story is thinner. For a public API where you need to maintain `/v1/` indefinitely while shipping `/v2/`, DRF gives you a well-paved road. With Ninja, you're paving it yourself.

**Authentication extensions.** The DRF authentication ecosystem is rich: `simplejwt`, OAuth2 flows via `django-oauth-toolkit`, API key management libraries. Ninja's auth layer is extensible but younger. The ecosystem hasn't had time to develop the same density.

**Throttling and rate limiting.** DRF ships with throttle classes that handle per-user and per-anon rate limiting out of the box. For a public API, that's table stakes. Ninja defers this to Django middleware or third-party tools, which works, but requires more assembly.

**Serializer expressiveness for complex nested writes.** Ninja's Pydantic schemas handle input/output shapes extremely well. Where they show seams is in complex nested write operations — creating a parent object with nested children in a single request, or handling `ManyToMany` relationships with intermediate data. DRF's `WritableNestedSerializer` and third-party extensions like `drf-writable-nested` cover those cases with battle-tested patterns.

**Community and library expectation.** Third-party developers integrating with your public API will expect SDK generators, DRF-compatible tooling, and documentation patterns they recognize. The tooling ecosystem around DRF's OpenAPI output is more mature for these downstream use cases.

The summary: Ninja's constraints are fine when you control both ends of the API. When you don't, those constraints start costing you.

---

## A Practical Migration Path

You don't have to choose one or the other across your whole codebase. Django Ninja and DRF can coexist. A useful approach:

1. Leave your existing public API on DRF. Don't touch it.
2. Mount a Ninja router at a new prefix (`/internal/` or `/v2/`) for new internal surfaces.
3. Write new internal endpoints exclusively in Ninja.
4. Over time, as internal DRF endpoints need changes, migrate them to Ninja during the natural edit cycle.

```python
# urls.py
from ninja import NinjaAPI
from rest_framework.routers import DefaultRouter

# DRF — public API, unchanged
drf_router = DefaultRouter()
drf_router.register(r"articles", ArticleViewSet)

# Ninja — internal API, new
internal_api = NinjaAPI(urls_namespace="internal")

urlpatterns = [
    path("api/v1/", include(drf_router.urls)),          # public
    path("internal/", internal_api.urls),               # internal
]
```

No big bang migration. No rewrite risk. Gradual, reversible.

---

## The Decision Framework

Ask two questions before you reach for either framework:

**Who is consuming this API?**
- Your own frontend or internal services → Django Ninja
- Third-party developers or external clients → Django REST Framework

**What's the risk profile of the contract?**
- Can you change the API and update all consumers simultaneously? → Django Ninja
- Do you need to version and maintain backward compatibility indefinitely? → Django REST Framework

---

## Closing Thought

DRF is not legacy software. It's a mature, stable tool that solves a specific problem extremely well. The mistake isn't choosing DRF — it's choosing DRF by default, for everything, because it's what you already know.

Django Ninja exists in a different part of the problem space. It's what you reach for when the overhead of DRF is higher than the value it provides — which, for most internal APIs, is most of the time.

Stop writing serializers for endpoints that your own React app is calling. Write a schema, write a function, ship it. Keep the ceremony for the APIs that actually need it.
