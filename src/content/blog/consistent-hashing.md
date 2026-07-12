---
title: "Consistent Hashing"
excerpt: "Plain modulo hashing remaps almost every key when a node joins or leaves a cluster; consistent hashing turns that into a local event by remapping only the share of keys that actually needs to move."
date: "2027-02-14"
readTime: "4 min read"
tags: ["System Design", "Expert", "Distributed Systems"]
---

Every distributed cache and database has to answer the same question millions of times a second: given this key, which node holds it? The obvious answer — hash the key, mod by the number of nodes — works fine right up until you add or remove a node. Then it falls apart in a very specific, very expensive way.

## The Naive Approach, and Where It Breaks

`hash(key) % N` is the instinctive solution. Hash the key to a number, take the remainder when divided by the number of servers, route the request there. It's fast, it's simple, and every key maps to exactly one server.

The problem shows up the moment `N` changes. Modulo is sensitive to its divisor: `key % 4` and `key % 5` agree on almost nothing. Add a fifth server to a four-server cluster and roughly 80% of your keys now hash to a different machine than before. Scale that cluster to 100 nodes and adding just one more remaps around 99% of your data.

For a cache, that's a mass eviction — every client suddenly misses and re-fetches from the origin, sometimes hard enough to take the origin down (the classic "thundering herd"). For a database doing key-based sharding, it means a full data migration just to add capacity. Neither is acceptable at any real scale, which is exactly the problem consistent hashing was invented to solve.

## Put Everything on a Ring

Consistent hashing changes the model. Instead of hashing into a fixed-size bucket range and taking a remainder, it hashes both servers and keys into the same large output space — typically 0 to 2³²−1 — and treats that space as a circle rather than a line. Position 2³²−1 wraps back around to 0.

Each server gets hashed to a position on this ring, usually by hashing something stable like its IP address or node ID. A key's owner is found with one rule: hash the key, then walk clockwise around the ring until you hit the first server. That server owns it. No modulo, no need to know the total node count up front.

## Why This Fixes the Remapping Problem

The payoff shows up when the cluster changes. Add a new server, and it claims a single new position on the ring. Only the keys that fall between the new server and the previous node in clockwise order are affected — everything else on the ring still resolves to exactly the server it did before. Remove a server, and only its keys move, shifting to the next node clockwise.

Instead of remapping a large fraction of all keys, you remap roughly `1/N` of them — the share that reasonably belongs to whichever node just joined or left. That's the entire value proposition: cluster changes become local events instead of global ones.

## The Uneven-Distribution Problem, and Virtual Nodes

A ring with only a handful of real nodes can land unevenly just by chance — hash outputs aren't guaranteed to space themselves out. One server might end up owning 60% of the ring's arc while another owns 5%, purely from where their hashes happened to fall.

The standard fix is virtual nodes. Instead of hashing each physical server to one point, hash it to 100–200 points scattered around the ring, each acting as a stand-in for that server. More points per node means the law of large numbers does its job — the arcs even out, and each physical server ends up owning a roughly proportional, well-distributed share of the ring regardless of how the raw hashes fall.

Virtual nodes also make capacity changes smoother. A new server absorbing keys from 150 scattered virtual positions pulls a little bit of load from many existing nodes, rather than taking a single large contiguous chunk from just one neighbor.

## Where You'll Run Into This

Consistent hashing isn't a theoretical construct — it's running underneath infrastructure most backend systems touch daily:

- **Distributed caches** like Memcached use it (often via the ketama algorithm) so that adding or removing a cache node doesn't blow away the whole cache.
- **Distributed databases** like Cassandra and DynamoDB use consistent hashing (or close variants) for partition placement across nodes, letting clusters scale horizontally without full data reshuffles.
- **Load balancers**, including Google's Maglev, use consistent hashing to pick backends so that connection-to-backend mappings stay stable even as the backend pool changes size.
- **CDNs** use similar ring-based schemes to decide which edge node or origin shard serves a given piece of content.

## Where It Doesn't Fit

Consistent hashing solves rebalancing on membership change — it doesn't solve everything about distributing load. It assumes you're comfortable with eventual, approximate balance rather than perfect balance at every instant, and it adds a layer of indirection (the ring, and often the virtual node table) that a system with a genuinely fixed, rarely-changing node count doesn't need. If your cluster size is stable and known in advance, plain modulo hashing is simpler and has no real downside.

The broader pattern is the one worth keeping: build systems that expect membership to change, rather than treating every scale-up as a special migration event.
