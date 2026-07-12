---
title: "Rate Limiting: How Systems Protect Themselves From Their Own Popularity"
excerpt: "Rate limiting is a policy enforced through an algorithm — token bucket, sliding window, leaky bucket — and the one you pick determines which kind of unfairness your system tolerates under load."
date: "2027-01-17"
readTime: "4 min read"
tags: ["System Design", "Expert", "Reliability"]
---

Every system you build will eventually be too popular for its own good. A client retries too aggressively. A script loops without a delay. A partner integration decides to sync every second instead of every hour. None of this is malicious — it's just what happens when you expose an endpoint to the world without telling it how much is too much.

Rate limiting is how you decide, ahead of time, how much traffic any single client is allowed to send you, and what happens when they cross that line. It's the kind of control you'll only think hard about *after* something falls over — unless you build it in from the start.

## What Rate Limiting Actually Protects

Rate limiting isn't one thing — it's a control point that serves several purposes at once:

- **Resource protection**: your database, cache, or downstream service has a ceiling. Rate limiting keeps traffic under it.
- **Fair usage**: one noisy client shouldn't be able to starve everyone else on a shared system.
- **Cost control**: every request that hits a third-party API or triggers compute has a price tag attached.
- **Abuse and security**: brute-force login attempts, scraping, and credential stuffing all look like "too many requests, too fast."

The key idea is that rate limiting is a policy, not a single implementation. The algorithm you choose determines how forgiving or strict that policy feels in practice.

## The Core Algorithms

**Fixed Window Counter** is the simplest: count requests in a time window (say, 100 per minute), reset the counter when the window rolls over. Cheap to implement, but it has a burst problem — a client can send 100 requests in the last second of one window and another 100 in the first second of the next, doubling the effective rate at the boundary.

**Sliding Window Log** fixes the boundary problem by tracking a timestamp for every request and counting how many fall within the trailing window. It's accurate, but storing a timestamp per request gets expensive at scale.

**Sliding Window Counter** is the practical middle ground: it weights the previous window's count proportionally based on how much of it overlaps with the current window. Close to sliding-log accuracy, at fixed-window cost.

**Token Bucket** is the one you'll see most often in production. Each client has a bucket that refills with tokens at a fixed rate, up to a cap. Every request consumes a token; if the bucket's empty, the request is rejected or queued. This naturally allows short bursts (up to the bucket size) while enforcing a steady average rate — which matches how real traffic actually behaves.

**Leaky Bucket** flips the model: requests enter a queue and leak out at a constant rate, smoothing bursts into a steady stream. It trades burst tolerance for predictability, which is useful when the downstream system genuinely can't handle spikes at all.

## Where You Enforce It

Rate limiting can live at several layers, and production systems often stack more than one:

- **Client-side**: cooperative throttling, useful but not enforceable — a client can just ignore it.
- **API Gateway / Load Balancer**: the most common place. Tools like Nginx's `limit_req`, Kong, or AWS API Gateway apply limits before traffic even reaches your application.
- **Application layer**: fine-grained limits per user, per API key, or per endpoint — useful when different routes have wildly different costs.
- **Distributed layer**: when you have multiple application instances, you need a shared store (usually Redis) so limits are enforced globally, not per-instance. Otherwise a client can bypass a "100 requests per minute" limit just by hitting a different server behind the load balancer.

## Communicating the Limit

A rate-limited API should never leave the client guessing. The standard response is HTTP `429 Too Many Requests`, paired with a `Retry-After` header telling the client exactly when to try again. Well-designed APIs also expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers so clients can self-regulate before they ever get rejected.

## The Mental Model

Rate limiting is the same conceptual tool whether it's protecting a login endpoint from brute force or protecting a payments API from a runaway retry loop: it's a gate that trades a small amount of friction for a guarantee that the system underneath stays standing. The algorithm you pick is really a decision about which kind of unfairness you're willing to tolerate — bursty-but-simple, smooth-but-costlier, or precise-but-expensive.

Build the gate before you need it. The alternative is finding out exactly how much traffic your system can't handle, in production, in real time.
