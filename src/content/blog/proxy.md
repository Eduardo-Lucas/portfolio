---
title: "Proxies: The Server in the Middle"
excerpt: "Forward proxy, reverse proxy, transparent proxy — same mechanism pointed in different directions. The distinction that actually matters is simple: ask who the proxy is hiding."
date: "2026-09-13"
readTime: "3 min read"
tags: ["System Design", "Novice", "Networking"]
---

"Just put it behind a proxy" is one of those instructions that sounds simple until you realize there are at least four different things it could mean, each solving a completely different problem. Forward proxy, reverse proxy, transparent proxy, open proxy — same word, different jobs. This post covers what a proxy actually is, the forward/reverse distinction that matters most in practice, and the real reasons production systems put one in the request path.

## What a proxy actually is

A proxy is an intermediary server that sits between a client and a destination server, forwarding requests and responses on someone's behalf. Neither side necessarily talks to the other directly — they talk to the proxy, and the proxy talks onward.

That's the whole definition. Everything else is about *whose* behalf the proxy is acting on, and that's where the forward/reverse distinction comes in.

## Forward proxy: standing in for the client

A forward proxy sits in front of clients and makes requests to the internet on their behalf. The destination server sees the proxy's IP, not the client's. From the server's point of view, the proxy *is* the client.

This is the shape you'll recognize from:

- **Corporate networks** — a company routes all outbound traffic through a proxy to enforce access policies, log activity, or block certain destinations.
- **VPNs and anonymity tools** — the proxy hides the client's real IP and location from the destination.
- **Content filtering** — schools and organizations block categories of sites by intercepting requests before they leave the network.

The defining trait: the client knows about the proxy and is configured to use it. The server usually doesn't know or care that a proxy is involved at all.

## Reverse proxy: standing in for the server

A reverse proxy does the mirror-image job. It sits in front of one or more backend servers and receives requests on their behalf. The client thinks it's talking directly to "the server" — it has no idea there's a whole fleet of machines, or that its request got routed to instance #7 out of twelve.

This is the shape you'll recognize from nearly every production web architecture:

- **Load balancing** — distributing incoming requests across multiple backend instances so no single server gets overwhelmed.
- **TLS termination** — handling HTTPS encryption/decryption at the edge so backend servers only deal with plain HTTP internally.
- **Caching** — serving repeated requests for the same resource without hitting the backend at all.
- **Security and rate limiting** — hiding backend server details, absorbing malicious traffic, and throttling abusive clients before they ever reach application code.

Nginx, HAProxy, Envoy, and most managed load balancers (ALB, Cloud Load Balancing) are reverse proxies, even when nobody calls them that in conversation.

## The distinction that actually matters

The easiest way to keep forward and reverse straight: ask *who the proxy is hiding*.

- **Forward proxy** hides the client from the server.
- **Reverse proxy** hides the server from the client.

Same mechanism — intercept, forward, relay the response — pointed in opposite directions, solving opposite problems.

## Why this shows up in system design interviews

Proxies rarely get asked about directly, but they're the quiet mechanism behind three things that come up constantly:

- **"How would you add HTTPS without touching every service?"** → TLS termination at a reverse proxy.
- **"How do you protect internal services from being hit directly?"** → reverse proxy as the only public-facing entry point, with backends unreachable from outside the network.
- **"How does the load balancer decide where a request goes?"** → the load balancer usually *is* a reverse proxy, and its routing algorithm (round-robin, least-connections, etc.) is next week's topic.

Once you see a proxy as "an intermediary acting on someone's behalf," the rest is just details about which someone, and what it does while it's in the middle.
