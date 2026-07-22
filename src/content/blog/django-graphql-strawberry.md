---
title: "Django + GraphQL: What Actually Happens When You Wire Them Together"
excerpt: "Bolting GraphQL onto a Django API today means choosing strawberry-django over the older graphene-django — and most tutorials are already out of date. A working example, where GraphQL actually earns its complexity, and four things that broke when I ran the code instead of just writing it."
date: "2026-07-22"
readTime: "4 min read"
tags: ["Django", "GraphQL", "Python", "API", "Backend"]
---

Every few months a client asks some version of the same question: "our frontend team wants GraphQL, can we bolt that onto our Django API?" The short answer is yes. The longer answer is that the ecosystem has shifted enough in the last couple of years that most of the tutorials you'll find are quietly out of date — and I found that out the hard way while building the example for this post.

## The two real options

If you're adding GraphQL to Django today, you're choosing between:

**graphene-django** — the established choice. Built on Graphene, integrates with your models through `DjangoObjectType`. It works, it's battle-tested, and there are years of Stack Overflow answers for it. The tradeoff is that it feels dated: resolvers are hand-written classes, mutations are verbose, and the project's momentum has slowed noticeably.

**strawberry-django** — built on Strawberry, which leans on Python type hints and dataclasses instead of a custom class hierarchy. If you're comfortable with Pydantic-style typed Python, this feels like the natural evolution. It has solid async support and is where most new Django+GraphQL projects seem to be starting.

I built the example below with strawberry-django, and I'd recommend it as the default starting point for a new project.

## Where GraphQL actually earns its complexity

GraphQL isn't a universal upgrade over REST — it solves specific problems:

- **Multiple clients with different data needs** (web dashboard, mobile app) that would otherwise need separate REST endpoints or heavy over-fetching
- **Deeply nested, client-composed queries** — a frontend that wants to shape its own response instead of waiting on backend changes
- **Reducing round trips** for related data (author + their books + book reviews, in one request)

Where it adds friction without much payoff: simple CRUD APIs, anything cache-friendly at the URL level (GraphQL loses you free HTTP caching), and N+1 query problems that need deliberate `select_related`/`prefetch_related` discipline or a `DataLoader` pattern to avoid quietly murdering your database.

Practically: I keep REST (via DRF or Django Ninja) for structured, predictable endpoints, and reach for GraphQL specifically where a frontend needs to compose nested queries on its own.

## Building it: models, types, schema

Here's the shape of a small library API — an `Author` with related `Book`s — wired up with strawberry-django.

**The models are plain Django, nothing GraphQL-specific:**

```python
class Author(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, related_name="books", on_delete=models.CASCADE)
    published_year = models.PositiveIntegerField()
    in_stock = models.BooleanField(default=True)
```

**Types are generated straight from the models:**

```python
@strawberry_django.type(models.Author, fields="__all__")
class Author:
    books: List["Book"]


@strawberry_django.type(models.Book, fields="__all__", filters=BookFilter, order=BookOrder)
class Book:
    author: Author
```

That `filters=` / `order=` pair is doing more than it looks like — it gives you a fully filterable, sortable query for free:

```graphql
query {
  books(filters: { inStock: { exact: true } }, order: { publishedYear: DESC }) {
    id
    title
    author { name }
  }
}
```

No custom resolver code. The filter and order input types are themselves declared with a couple of decorators:

```python
@strawberry_django.filter_type(models.Book, lookups=True)
class BookFilter:
    id: strawberry.auto
    title: strawberry.auto
    published_year: strawberry.auto
    in_stock: strawberry.auto


@strawberry_django.order(models.Book)
class BookOrder:
    title: strawberry.auto
    published_year: strawberry.auto
```

**Mutations follow the same pattern** — generated from an input type rather than hand-rolled:

```python
@strawberry.type
class Mutation:
    create_book: Book = strawberry_django.mutations.create(BookInput)
    update_book: Book = strawberry_django.mutations.update(BookInputPartial)
    delete_book: Book = strawberry_django.mutations.delete()
```

And the whole schema mounts as one ordinary Django view:

```python
path("graphql/", csrf_exempt(GraphQLView.as_view(schema=schema)))
```

## What actually broke (and why this matters)

I didn't just write this code from memory — I ran it: migrations, a live dev server, real queries and mutations against seeded data. That's the only way I caught these, and every one of them would've cost you a confused half hour if you copied an older tutorial:

1. **`strawberry_django.auto` doesn't exist anymore.** It moved to `strawberry.auto`. Older blog posts and even some current docs still show the old import.
2. **`GraphQLView(graphiql=True)` is gone.** The playground toggle is now `graphql_ide`, and it defaults to on — so in most cases you can just... not pass it.
3. **Filters aren't built with `strawberry_django.filters(...)`.** That name is a *module*, not a decorator. The actual decorator is `strawberry_django.filter_type(...)`.
4. **The GraphQL endpoint needs `csrf_exempt`.** Django's CSRF middleware protects any POST view by default, and a JSON API endpoint authenticated by token/JWT (rather than session cookies) will 403 immediately without it.

None of these are exotic — they're just the normal cost of a fast-moving library. Worth remembering next time an AI assistant, a blog post (including this one, eventually), or your own memory hands you a "here's how GraphQL works with Django" snippet: run it before you trust it.

## Should you actually do this?

If your frontend genuinely needs to compose flexible, nested queries — yes, and strawberry-django gets you there with very little boilerplate. If you're building a fairly standard CRUD API, I'd hold off: you'll trade simple, cacheable REST endpoints for a query language that solves a problem you may not have yet. As with most architecture decisions, the right call depends on what your client is actually going to do with the data, not on what's currently trending.
