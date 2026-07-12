---
title: "Caching: The Highest-Leverage Trick in System Design"
excerpt: "Storing data is easy. Knowing when to throw it away is not — a look at where caching layers live, the dominant invalidation patterns, and why cache invalidation earned its reputation."
date: "2026-09-06"
readTime: "5 min read"
tags: ["System Design", "Novice", "Performance"]
---

## The problem caching solves

Most systems spend the bulk of their time doing the same expensive work over and over: re-running a query that returned the same result five seconds ago, re-rendering a page that hasn't changed, re-fetching a file that a thousand other users just fetched. Caching is the practice of storing the result of that expensive work somewhere fast, so the next request can skip straight to the answer.

It's the same idea whether you're talking about your CPU's L1 cache, a CDN edge node, or a Redis instance in front of a database — keep a copy of the answer close to where it's needed, so you don't have to redo the work (or the trip) to get it.

## Where caching layers actually live

In a real system, caching isn't one layer — it's several, stacked on top of each other, each catching what the one before it missed:

- **Browser cache** — static assets (JS, CSS, images) stored on the user's machine, controlled by HTTP cache headers.
- **CDN / edge cache** — covered in week 5 of this series. Catches requests before they ever reach your origin.
- **Application-level cache** — an in-memory store (Redis, Memcached) sitting between your app servers and your database, holding hot data like session info, computed results, or frequently-read rows.
- **Database query cache** — the database itself caching query plans or result sets internally.

A request typically walks through this stack from closest-to-the-user to furthest, and only touches the database if every layer above it misses.

## The one hard problem: invalidation

Storing data is easy. Knowing when to throw it away is not. If a cached value goes stale and you keep serving it, users see wrong data. If you invalidate too aggressively, you lose most of the benefit of caching in the first place. This tension — between staleness and hit rate — is why cache invalidation has a reputation as one of the genuinely hard problems in computing.

There's no universal answer, but there are established patterns for managing it:

- **TTL (time-to-live)** — the simplest approach. Every cached entry expires automatically after a fixed window. Simple, but you're explicitly trading some staleness for simplicity.
- **Explicit invalidation** — when the underlying data changes, the write path actively deletes or updates the cached entry. More accurate, but couples your write logic to your cache logic, and it's easy to miss a code path that writes to the database without also touching the cache.
- **Versioned or tagged keys** — instead of deleting entries, you change the cache key when the underlying data changes (e.g., embedding a version number or last-updated timestamp in the key), so old entries just age out naturally without ever being explicitly cleared.

## Cache-aside vs. write-through

The invalidation strategy you pick is closely tied to *when* data gets written into the cache, and there are two dominant patterns:

**Cache-aside (lazy loading):** The application checks the cache first. On a miss, it reads from the database, then writes the result into the cache for next time. This is the most common pattern because it's simple and only caches data that's actually being requested — nothing gets cached until someone asks for it. The tradeoff: the first request after an invalidation always pays the full cost of a miss, and there's a brief window where the cache and database can disagree.

**Write-through:** The application writes to the cache and the database at the same time, as part of the same operation. This keeps the cache consistent with the database by construction, since nothing is ever written to one without the other. The tradeoff: every write becomes slightly slower (it has to touch two systems), and you end up caching data that might never actually be read again.

A related variant, **write-behind**, writes to the cache immediately but defers the database write to happen asynchronously later — faster writes, at the cost of a window where a crash could lose data that was never persisted.

## Eviction: what happens when the cache fills up

Caches are finite. Once one is full, adding a new entry means evicting an old one, and the eviction policy determines what gets kicked out:

- **LRU (Least Recently Used)** — evict whatever hasn't been accessed in the longest time. The default choice for most general-purpose caches, because it tends to match real access patterns reasonably well.
- **LFU (Least Frequently Used)** — evict whatever has been accessed the fewest times overall, which handles cases where something is accessed rarely but in intense bursts.
- **TTL-based expiry** — entries are evicted purely on age, regardless of how often they're used.

## When to actually reach for it

Caching is often the single highest-leverage change available in a system under load — cheaper and faster to implement than sharding a database or adding read replicas, and it directly reduces load on every layer behind it. But it's not free: it adds a new place for bugs to hide (a stale cache is a bug that only shows up sometimes, for some users, which makes it miserable to debug), and it adds an entire new question to every write path — "does this also need to update the cache?"

The practical rule of thumb: cache read-heavy data that's expensive to compute or fetch and doesn't change on every request, start with TTL-based expiry because it's the simplest failure mode to reason about, and only reach for more precise invalidation once you've actually measured that staleness is causing real problems.
