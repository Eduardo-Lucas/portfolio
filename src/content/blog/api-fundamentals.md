---
title: "APIs Explained: How Software Talks to Software"
excerpt: "An API is a contract, not a technology — this walks through the client-server model, REST's core verbs and nouns, and the request/response anatomy underlying almost every integration you'll build."
date: "2026-12-13"
readTime: "4 min read"
tags: ["System Design", "Expert", "APIs"]
---

If you've written more than a few lines of code, you've used an API — even if you never called it that. Every time your app fetches weather data, processes a payment, or logs a user in with Google, there's an API quietly doing the handshake behind the scenes.

Let's break down what's actually happening.

## What Is an API, Really?

API stands for **Application Programming Interface**. Strip away the acronym and it's just a contract: a defined way for one piece of software to ask another piece of software for something, without needing to know how that something is built internally.

Think of it like a restaurant menu. You don't need to know how the kitchen works — you just need to know what you can order and what you'll get back. The menu is the interface. The kitchen is the implementation. APIs let you swap out the kitchen entirely without the customer (your code) ever noticing, as long as the menu stays the same.

## The Client-Server Model

Most APIs you'll work with as a developer follow a **client-server** model:

- The **client** is the one making the request — your frontend app, a mobile client, another backend service.
- The **server** is the one holding the data or logic and responding to that request.

This separation is what lets a single backend serve a web app, a mobile app, and a third-party integration simultaneously, all through the same set of rules.

## REST: The Most Common API Style

**REST** (Representational State Transfer) isn't a protocol or a library — it's an architectural style. A REST API organizes everything around **resources** (users, orders, products) and lets you act on those resources using standard HTTP methods.

### The HTTP Methods You'll Actually Use

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Retrieve a resource | `GET /users/42` |
| `POST` | Create a new resource | `POST /users` |
| `PUT` | Replace a resource entirely | `PUT /users/42` |
| `PATCH` | Update part of a resource | `PATCH /users/42` |
| `DELETE` | Remove a resource | `DELETE /users/42` |

Notice the pattern: the URL identifies *what* you're acting on (the resource), and the HTTP method defines *what action* you're taking. This is the core idea behind REST — verbs and nouns split cleanly instead of being crammed into a single endpoint name like `/getUserById` or `/deleteUserAccount`.

## Anatomy of a Request

A typical API request has three parts working together:

1. **Endpoint** — the URL you're hitting, e.g. `https://api.example.com/v1/users/42`
2. **Headers** — metadata about the request, like `Authorization` tokens or `Content-Type: application/json`
3. **Body** — the actual data you're sending, usually as JSON, used with `POST`, `PUT`, and `PATCH`

Query parameters (`?limit=10&page=2`) often ride along in the URL itself, typically used for filtering, pagination, or sorting on `GET` requests.

## Anatomy of a Response

The server replies with a **status code** and, usually, a body. Status codes are grouped by their first digit:

- **2xx** — Success (`200 OK`, `201 Created`, `204 No Content`)
- **3xx** — Redirection (`301 Moved Permanently`, `304 Not Modified`)
- **4xx** — Client error (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`)
- **5xx** — Server error (`500 Internal Server Error`, `503 Service Unavailable`)

Reading status codes correctly is one of the fastest ways to debug an integration — a `401` and a `500` point you in completely different directions.

## Statelessness: The Rule That Makes REST Scale

REST APIs are **stateless** — every request must contain everything the server needs to process it. The server doesn't remember your previous request. This is why authentication tokens get sent on *every* call instead of once at the start of a "session."

Statelessness sounds like a limitation, but it's actually what lets REST APIs scale horizontally so easily. Since no server needs to remember who you are between requests, any server in a cluster can handle any request, and load balancers can distribute traffic freely without worrying about "sticky sessions."

## Putting It Together

Here's what a full request-response cycle looks like for fetching a user:

```
GET /v1/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Accept: application/json
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

Client sends a request to a specific resource, server checks the credentials, server responds with a status code and a JSON payload. That's the entire loop — everything else in API design is refinement on top of this foundation.

## What's Next

This covers the fundamentals: resources, methods, requests, responses, and statelessness. There's a whole layer beyond this — authentication schemes, rate limiting, versioning strategies, pagination patterns — that turn a functional API into a production-grade one. That's a good next topic if you want to go deeper.
