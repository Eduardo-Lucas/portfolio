---
title: "API Gateway: The Front Door to Your Backend"
excerpt: "An API Gateway centralizes routing, auth, and rate limiting that would otherwise be duplicated across every service and client — at the cost of becoming a critical path you now have to run with real rigor."
date: "2027-01-10"
readTime: "4 min read"
tags: ["System Design", "Expert", "APIs", "Microservices"]
---

You've split your monolith into microservices. Now you have an Orders service, a Payments service, a Users service, an Inventory service — a dozen small, focused pieces instead of one big one. This is supposed to make life easier.

Then a client team asks the obvious question: "Which URL do we hit?"

## The Problem Nobody Plans For

Without a unifying layer, every client — your mobile app, your web frontend, a partner's integration — needs to know the address of every single service. Auth has to be implemented separately in each service, or duplicated across all of them. Rate limiting is either missing or reinvented per-service. If you rename a service or split it into two, every consumer breaks.

This is the hidden cost of microservices that nobody puts on the architecture diagram: you've traded one big coordination problem for N small ones, scattered across every client that talks to you.

An API Gateway exists to absorb that cost in one place instead of many.

## What It Actually Does

An API Gateway sits between clients and your backend services as a single entry point. Conceptually, it's a reverse proxy with opinions. On every request it can handle:

- **Routing** — mapping `/orders/*` to the Orders service, `/users/*` to the Users service, without the client knowing or caring where those services actually live
- **Authentication & authorization** — validating tokens once, at the edge, instead of in every downstream service
- **Rate limiting & throttling** — protecting backend services from being overwhelmed, per client or per API key
- **Request/response transformation** — reshaping payloads, aggregating multiple service calls into one response for the client
- **Observability** — a single place to log, trace, and monitor every request that enters your system

None of these capabilities are new. What's new is centralizing them instead of re-implementing them in every service.

## Gateway vs. Load Balancer vs. Proxy

It's easy to conflate these, so it's worth being precise:

- A **load balancer** distributes traffic across multiple instances of the *same* service. It doesn't know or care about routes, auth, or payloads — it just spreads load.
- A **reverse proxy** forwards requests to a backend on behalf of a client, often used for TLS termination, caching, or basic routing.
- An **API Gateway** is a specialized reverse proxy purpose-built for APIs — it understands routes, applies policies like auth and rate limiting, and often talks to a load balancer for each service behind it.

In a real system, these layers stack: client → API Gateway → load balancer → service instances.

## The Tradeoff: A New Single Point of Failure

Centralizing cross-cutting concerns is powerful, but it comes with a cost. The gateway becomes a critical path for every request in your system — if it goes down, everything behind it becomes unreachable, even if every individual service is healthy.

This means the gateway itself needs to be treated with the same rigor as your most critical service: run multiple instances behind a load balancer, keep it stateless so any instance can handle any request, and keep its own logic minimal so it doesn't become an accidental monolith. A gateway trying to do too much business logic re-centralizes the coupling you split microservices to avoid.

## When You Actually Need One

If you're running a single service, or a handful of services all consumed by one internal client, you probably don't need a gateway yet — it's unnecessary indirection. The signal to introduce one is when you have multiple services and multiple types of clients (mobile, web, third-party partners), and you notice the same auth, rate-limiting, or routing logic being copy-pasted across services or client codebases.

At that point, an API Gateway isn't extra complexity — it's where complexity that already exists finally gets a proper home.

## The Mental Model to Keep

An API Gateway is the negotiated boundary between "however messy our internal services are" and "however clean we want the outside world's experience to be." Clients get one address, one auth scheme, one contract. Behind that boundary, you're free to split, merge, rename, and scale services however you need — as long as the gateway's contract with the outside world stays stable.

Design that boundary deliberately, before you have five clients all coupled to five different services' quirks, and you'll save yourself a painful migration later.
