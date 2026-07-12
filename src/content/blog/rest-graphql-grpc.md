---
title: "REST, GraphQL, and gRPC: Three Ways to Ask for Data"
excerpt: "REST, GraphQL, and gRPC solve different problems rather than compete for the same one — knowing how each actually works under the hood is what lets you pick the right one instead of the familiar one."
date: "2026-12-20"
readTime: "4 min read"
tags: ["System Design", "Expert", "APIs"]
---

Every API you've ever called had to answer the same question: what's the contract between client and server? REST, GraphQL, and gRPC are three different answers to that question — and understanding how each actually works, under the hood, is what lets you pick the right one instead of just the familiar one.

## REST: Resources, Verbs, and the Web's Native Tongue

REST (Representational State Transfer) isn't a protocol — it's a set of architectural constraints built on top of HTTP. The core idea: everything is a **resource**, identified by a URL, and you act on it using HTTP methods.

```
GET    /users/42        → fetch user 42
POST   /users           → create a new user
PUT    /users/42        → replace user 42
PATCH  /users/42        → partially update user 42
DELETE /users/42        → remove user 42
```

Each request is **stateless** — the server holds no memory of previous requests, so every call carries everything needed to process it (auth tokens, params, body). This is what makes REST so easy to cache: a `GET` to `/users/42` looks the same every time, so browsers, CDNs, and proxies can all cache the response without any special logic.

The tradeoff is shape. The server decides what a `/users/42` response contains. If you only need a user's name but the endpoint returns twenty fields, that's over-fetching. If you need data from three related resources, you're making three round trips — under-fetching, solved by chaining requests.

## GraphQL: Let the Client Ask for Exactly What It Needs

GraphQL flips REST's model. Instead of many fixed endpoints, there's **one endpoint** and a query language that lets the client describe the exact shape of the response it wants:

```graphql
query {
  user(id: 42) {
    name
    posts(limit: 3) {
      title
    }
  }
}
```

That single request returns exactly the name and three post titles — nothing more. No over-fetching, no under-fetching, no chained calls to stitch together related data. A **schema** on the server defines every type and field that can be queried, and a resolver function fetches the actual data for each field, often pulling from multiple underlying services or databases in one pass.

The cost is at the infrastructure layer. Because every request goes to the same endpoint with a different query body, standard HTTP caching (which keys off URLs) mostly stops working — GraphQL servers typically need their own caching layer. Poorly designed queries can also trigger expensive nested resolver calls, so most production setups add query complexity limits.

## gRPC: Binary Speed for Service-to-Service Calls

gRPC takes a different angle entirely. Instead of optimizing for human-readable APIs at the edge, it optimizes for fast, strongly-typed communication **between services** inside a system.

Two things make this possible:

1. **Protocol Buffers (protobuf)** — a binary serialization format. Instead of sending verbose JSON, you define a message schema once...

```protobuf
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}
message UserRequest {
  int32 id = 1;
}
```

...and both client and server generate strongly-typed code from it. Payloads are compact binary, not text, so they're smaller and faster to parse.

2. **HTTP/2** — gRPC runs on HTTP/2 by default, which supports multiplexing (many requests over one connection) and true bidirectional streaming. That means a gRPC service can support not just request-response, but client streaming, server streaming, and full duplex streams — useful for things like live telemetry or chat backends.

The tradeoff: it's not human-readable in a browser, it's harder to debug with curl, and the tooling assumes you're generating client/server stubs from `.proto` files rather than hand-writing HTTP calls.

## Picking the Right One

None of these replace the others — they solve different problems:

- **REST** is the default for public-facing APIs where cacheability, simplicity, and broad tooling support matter more than perfectly-shaped responses.
- **GraphQL** shines when clients (especially mobile apps with limited bandwidth) need flexible, aggregated data from multiple sources without over-fetching.
- **gRPC** is built for internal, service-to-service traffic where speed, strict typing, and streaming matter more than human readability.

It's common to see all three in the same system: gRPC between internal microservices, GraphQL as the aggregation layer for the frontend, and a REST endpoint or two for simple, cacheable public data. The protocol isn't a religion — it's a tool selected for the shape of the problem in front of you.
