---
title: "Availability: The Metric Everyone Quotes and Almost Nobody Calculates Right"
excerpt: "'Five nines' gets quoted constantly and understood rarely. Here's what availability actually measures, why redundancy is the only real lever to improve it, and why the number that matters is the whole request path's, not any one service's."
date: "2026-08-23"
readTime: "4 min read"
tags: ["System Design", "Novice", "Reliability"]
---

"We aim for five nines." It's one of the most repeated lines in system design interviews and postmortems alike — and one of the least understood. Most engineers can recite 99.999% but couldn't tell you how many minutes of downtime that actually buys you a year, or why a system with "five nines" on paper can still feel broken to its users.

Availability is deceptively simple to define and genuinely hard to engineer for. This post covers what it actually measures, why redundancy is the only real lever you have to improve it, and where the "nines" framing quietly breaks down.

## What availability actually measures

Availability is the percentage of time a system is capable of servicing requests, over some measurement window:

```
Availability = Uptime / (Uptime + Downtime)
```

That's it — no mention of correctness, latency, or data integrity. A system that responds instantly with the wrong answer is "available." A system that's technically up but times out on every request, arguably, is not — which is why real-world availability targets are usually paired with latency and error-rate SLOs, not shipped alone.

The "nines" are just a compressed way of expressing that percentage:

| Availability | Downtime / year | Downtime / month |
|---|---|---|
| 99% (two nines) | ~3.65 days | ~7.3 hours |
| 99.9% (three nines) | ~8.76 hours | ~43.8 minutes |
| 99.99% (four nines) | ~52.6 minutes | ~4.4 minutes |
| 99.999% (five nines) | ~5.26 minutes | ~26 seconds |

Each additional nine is roughly a 10x reduction in acceptable downtime — and, in practice, a much larger jump in engineering and operational cost. Going from three nines to four nines usually means eliminating entire categories of single points of failure, not just tuning what you already have.

## Redundancy is the only lever

There is exactly one structural way to increase availability: remove single points of failure by duplicating the thing that can fail, and give the system a way to route around a failed copy.

That shows up at every layer of a system:

- **Compute** — multiple instances behind a load balancer, so one crashing doesn't take the service down.
- **Data** — replicated databases (primary/replica, multi-region) so a lost node doesn't mean lost data or a lost read path.
- **Network** — multiple availability zones or regions, so a datacenter-level failure doesn't equal an outage.
- **Dependencies** — fallbacks and circuit breakers for third-party services, so someone else's downtime doesn't become yours.

The math behind this is why redundancy compounds. If a single component has 99% availability (roughly 3.65 days of downtime a year), two independent, redundant copies — where the system only fails if *both* fail simultaneously — bring you to:

```
1 - (0.01 × 0.01) = 99.99%
```

Two mediocre components, combined correctly, can outperform one excellent one. This is the core insight behind horizontally scaled, redundant architectures: you're not trying to build an unbreakable server, you're trying to build a system that doesn't care when one server breaks.

## Where availability math gets misleading

The "multiply the failure rates" trick only works cleanly for genuinely independent failures. Two database replicas in the same rack, on the same power circuit, in the same availability zone, are not independent — a single circuit breaker trip takes both down together, and your carefully calculated 99.99% quietly collapses back toward 99%. Real resilience comes from redundancy across failure domains (racks, zones, regions, providers), not just extra copies of the same thing sitting next to each other.

Availability also composes badly across a request path. If a request touches five services, each with 99.9% availability, and any one of them failing fails the whole request, your *effective* availability is:

```
0.999^5 ≈ 99.5%
```

That's the availability of a much shakier system than any single component in it. This is why availability is a whole-system property, not a per-service one — and why teams obsessed with their own service's nines can still ship a product that feels unreliable, because the number that matters to the user is the product of everyone's nines along the request path, not any single team's.

## The takeaway

Availability isn't a single knob you turn — it's an emergent property of where you've placed redundancy, how independent your failure domains really are, and how many hops a request has to survive to succeed. Chasing an extra nine on one component while ignoring a shared failure domain, or a five-service request chain, buys you a nicer number on a dashboard and nothing else. The engineering work is in the composition, not the component.
