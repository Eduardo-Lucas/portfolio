---
title: "Django + DRF and Your Frontend: How the Pieces Actually Connect"
excerpt: "Moving from server-rendered Django templates to a decoupled React, Vue, or Angular frontend feels like a mental shift — until you see the pattern. Here's the actual contract between DRF and any frontend framework, and the two things that trip everyone up."
date: "2026-07-14"
readTime: "3 min read"
tags: ["Django", "DRF", "Frontend", "React", "API"]
---

If you've built Django apps with server-rendered templates before, moving to a decoupled architecture with React, Vue, or Angular can feel like a mental shift. The good news: once you understand the pattern, it's the same regardless of which frontend framework you choose. Here's how it works.

## Two Separate Applications, One Contract

The first thing to internalize is that Django/DRF and your frontend are **not one application anymore** — they're two independent applications that communicate over HTTP using JSON. There's no shared memory, no shared templates, no magic. Your frontend is just an HTTP client, the same way Postman or a mobile app would be.

```
Frontend (React/Vue/Angular)  ──HTTP/JSON──►  Django + DRF
                               ◄──────────────
```

This decoupling is what lets you swap frontends without touching your backend, or serve the same API to a web app and a mobile app simultaneously.

## What DRF Handles

On the backend, four pieces do all the work:

- **Models** define your database tables.
- **Serializers** convert model instances into JSON and back — this is DRF's core superpower.
- **Views/ViewSets** handle the HTTP verbs (GET, POST, PATCH, DELETE) and call the serializer.
- **Routers** auto-generate your URL patterns from ViewSets.

A minimal example:

```python
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
```

Register it with a router, and you instantly have a full REST API at `/api/products/` — list, create, retrieve, update, delete, all returning JSON.

## What the Frontend Handles

Regardless of framework, the frontend does the same three things:

1. Makes an HTTP call to a DRF endpoint (`fetch`, `axios`, Angular's `HttpClient`).
2. Parses the JSON response.
3. Stores it in local state and renders it.

React, Vue, and Angular differ in *how* they manage reactivity and state around that call — not in how they talk to Django. Learn the pattern once, and switching frontend frameworks becomes a syntax problem, not an architecture problem.

## The Two Things That Actually Trip People Up

**Authentication.** Since the two apps are decoupled, relying on Django's session cookies gets awkward, especially across different domains. The common approach is JWT (`djangorestframework-simplejwt`): the frontend authenticates once, stores an access token, and sends it as `Authorization: Bearer <token>` on every subsequent request. DRF's `IsAuthenticated` permission then validates that token and resolves `request.user` on the backend.

**CORS.** Your frontend (`app.example.com`) and backend (`api.example.com`) are different origins from the browser's perspective, so requests get blocked by default. `django-cors-headers` fixes this with an explicit allowlist:

```python
CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
]
```

Miss this step and you'll spend an hour debugging a "network error" that's actually a silent CORS rejection in the browser console.

## Putting It Together

A typical flow looks like this:

1. User logs in → frontend POSTs to `/api/auth/login/` → Django validates and returns a JWT.
2. Frontend stores the token.
3. Every future request attaches that token in the `Authorization` header.
4. DRF validates it, resolves the user, and returns data scoped appropriately (this is where multi-tenant filtering at the queryset level becomes critical if you're building SaaS).
5. The frontend renders the JSON.

## Why This Matters

Once you separate concerns this way, your backend becomes framework-agnostic. I've built the same DRF API and served it to React dashboards, Vue admin panels, and even React Native mobile apps — no backend changes required. That reusability is the real payoff of decoupling: you're not just picking a "modern stack," you're buying architectural flexibility that pays off every time a client wants a different frontend or you want to add a mobile app later.

If you're a backend developer just getting comfortable with this pattern: the concepts you already know (serialization, authentication, permissions) don't change. You're just learning to speak to a client that lives in a browser instead of rendering the response yourself.
