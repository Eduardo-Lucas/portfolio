---
title: "Load Balancers: The Traffic Cop of Every System That Doesn't Fall Over"
excerpt: "A load balancer is what turns a pile of individual servers into something that behaves like one reliable system — how it decides where traffic goes, and why health checks matter as much as the routing algorithm."
date: "2026-09-20"
readTime: "4 min read"
tags: ["System Design", "Novice", "Scalability"]
---

Every system design conversation eventually arrives at the same box in the diagram: a rectangle labeled "load balancer," sitting between the internet and a row of identical-looking servers. It's easy to nod along and move on. But this is the final piece of the puzzle for this series, and it's worth understanding properly — because a load balancer isn't just "the thing that spreads out traffic." It's the component that turns a pile of individual machines into something that behaves like one reliable system.

This closes out the System Design Fundamentals series. Fittingly, it's the piece that ties almost everything else together: DNS pointed you at an IP, a CDN cached what it could at the edge, and now the request that's left has to land on an actual server — one of possibly hundreds, any of which might be slow, unhealthy, or already at capacity.

## The problem it solves

A single server can only take so much load before it runs out of CPU, memory, or connections. The obvious fix is horizontal scaling: run the same application on multiple machines. But that immediately creates a new problem — something has to decide which machine handles which request, and do it in a way that's invisible to the client and fair to the servers.

That "something" is the load balancer. It sits in front of a pool of servers, accepts incoming traffic, and distributes it according to some strategy, while continuously checking which servers are actually healthy enough to receive work.

## Where it sits, and at what layer

Load balancers operate at different layers of the network stack, and the layer determines what they can see and decide on.

**Layer 4 (transport layer)** load balancers work at the TCP/UDP level. They route based on IP address and port, without inspecting the actual content of the request. This makes them extremely fast and low-overhead — but also less flexible, since they can't make decisions based on what's actually being asked for.

**Layer 7 (application layer)** load balancers understand HTTP itself. They can read headers, cookies, and URL paths, which means they can route `/api/*` to one pool of servers and `/static/*` to another, or send traffic from logged-in users to a different backend than anonymous traffic. This flexibility comes at the cost of more processing per request.

Most modern web infrastructure leans on Layer 7 balancing for anything user-facing, reserving Layer 4 for cases where raw throughput matters more than routing intelligence.

## How it decides where traffic goes

There isn't one "correct" balancing algorithm — the right one depends on what your servers and requests actually look like.

- **Round robin** cycles through servers in order. Simple, and works well when every server is identical and every request is roughly the same cost.
- **Least connections** sends new traffic to whichever server currently has the fewest active connections. Better than round robin when request duration varies a lot.
- **Weighted variants** of either strategy account for servers that aren't identical — a bigger box gets a bigger share.
- **IP hash** routes a given client consistently to the same server, based on a hash of their IP. Useful when you need session affinity without a shared session store.

## Health checks: the part that makes it resilient

Distributing traffic evenly is only half the job. The other half is not sending traffic to a server that's already broken. Load balancers periodically ping each backend — hitting a lightweight health endpoint — and quietly stop routing to any server that fails to respond correctly. When that server recovers, it's added back into rotation automatically.

This is what actually delivers on the promise from the availability post earlier in this series: redundancy only helps if something is watching for failure and routing around it. The load balancer is that something.

## Where load balancing shows up beyond "the load balancer"

The single box in the architecture diagram is the obvious case, but the same idea recurs at nearly every layer of a real system:

- **DNS-based load balancing** spreads traffic across regions before a single TCP connection is even opened.
- **Client-side load balancing**, common in service-to-service communication, has the caller pick which instance to hit, skipping a centralized hop entirely.
- **Database load balancing** routes reads across replicas, a pattern this series already covered when discussing scalability.

## The tradeoff underneath it all

A load balancer is itself a piece of infrastructure, which means it introduces its own single point of failure if you're not careful — the exact problem redundancy is supposed to solve. Production setups typically run load balancers in pairs or clusters with their own failover mechanism, sometimes via DNS, sometimes via protocols like VRRP, so the traffic cop doesn't become the thing that takes the whole system down.

That's load balancing: not a single clever trick, but the accumulation of everything else in this series — protocols, DNS, scalability, availability, caching — applied at the point where a request finally has to land on a real machine.

---

*This wraps up the System Design Fundamentals series. Ten weeks, ten concepts, one coherent picture of how modern distributed systems actually hold together — from a single packet leaving your machine to a request landing safely on a healthy server.*
