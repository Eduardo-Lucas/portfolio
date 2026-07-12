---
title: "PACELC: The Trade-off CAP Theorem Never Told You About"
excerpt: "CAP only describes what happens during a network partition — a rare event. PACELC covers the other 99.9% of the time, when your cluster is healthy and you're still trading latency for consistency on every request."
date: "2026-10-04"
readTime: "5 min read"
tags: ["System Design", "Practitioner", "Distributed Systems"]
---

If you've designed a distributed system, you've cited the CAP theorem at least once — probably to justify why your database drops consistency during a network partition. It's a useful law, but it describes exactly one moment: the instant something breaks. It says nothing about the other 99.9% of the time when your cluster is healthy and you still have to decide how consistent your reads should be.

That's the gap PACELC closes. Proposed by Daniel Abadi in 2010, it's not a rejection of CAP — it's the rest of the sentence CAP left unfinished.

## A quick refresher on CAP

The CAP theorem says a distributed data store can only guarantee two of three properties at once:

- **Consistency (C)** — every read gets the most recent write, or an error
- **Availability (A)** — every request gets a (non-error) response
- **Partition tolerance (P)** — the system keeps working despite dropped or delayed messages between nodes

In practice, network partitions happen, so P isn't optional — it's a fact of distributed life. That collapses CAP into a much narrower question: **when a partition occurs, do you choose availability or consistency?**

That's a real and important decision. But it only fires during partitions, which for most well-run clusters are rare. CAP is silent about the trade-off you're making constantly, every millisecond the network is behaving.

## The formula

PACELC states it as a single conditional:

```
if Partition:
    choose Availability or Consistency
else (normal operation):
    choose Latency or Consistency
```

Shorthand: **PA/EL**, **PC/EC**, **PA/EC**, **PC/EL** — read as "if Partition, A or C; Else, L or C."

The insight is that consistency has a cost even when nothing is broken. To guarantee every replica agrees before acknowledging a write (or serving a read), you need coordination — consensus rounds, quorum reads, synchronous replication to a remote region. That coordination takes time. So even in the *else* branch — normal, partition-free operation — a system still has to pick a side: pay the latency tax for strong consistency, or respond fast and accept some staleness.

## Breaking down each branch

**If Partition (P): Availability vs. Consistency**

- Choose **A**: nodes keep answering requests even if they can't confirm they're seeing the latest write. You get uptime; you risk stale or conflicting data until the partition heals.
- Choose **C**: nodes refuse to answer (or block) unless they can guarantee correctness. You get correctness; you risk timeouts and unavailability for the affected partition.

**Else (E): Latency vs. Consistency**

- Choose **L**: serve from the nearest replica immediately, without waiting for cross-node confirmation. Fast, but a read might return slightly outdated data.
- Choose **C**: wait for enough replicas (or the leader) to confirm before responding. Correct, but every request pays a coordination round-trip.

Most systems don't pick one letter per axis in isolation — the two decisions are usually correlated, but not identical, which is exactly why PACELC needs four labels instead of two.

## Where real systems land

| System | Classification | What that means in practice |
|---|---|---|
| **Cassandra** (default settings) | PA/EL | Stays available through partitions; serves fast reads from local replicas normally. Tunable per query via consistency levels. |
| **DynamoDB** | PA/EL (tunable to EC) | Optimizes for availability and low latency by default; supports strongly-consistent reads at extra latency cost. |
| **MongoDB** (default) | PC/EC | Favors consistency in both branches — writes go through a primary, reads can require majority acknowledgment. |
| **Google Spanner** | PC/EC | Uses synchronized clocks (TrueTime) to offer strong consistency globally, accepting the latency and infrastructure cost. |
| **MySQL / PostgreSQL** (single primary, sync replication) | PC/EC | A single writer avoids partition ambiguity; synchronous replicas trade latency for durability guarantees. |
| **Riak** | PA/EL | Dynamo-style design prioritizing availability and low latency, with eventual consistency and conflict resolution. |

Notice that the "else" behavior isn't a footnote — for something like Spanner or a synchronously replicated Postgres setup, the *everyday* latency cost of consistency is the dominant thing users feel. Partitions might happen once a quarter; every single query pays the else-branch tax.

## Why this matters when you're choosing a database

CAP tells you what happens on a bad day. PACELC tells you what you're paying every ordinary day. When you're evaluating a data store, ask both:

1. **During a partition, do I need this data to stay available, or do I need it to stay correct?** (Think: shopping cart vs. account balance.)
2. **During normal operation, can my application tolerate a few hundred milliseconds of extra latency in exchange for guaranteed freshness — or does the user experience require the fastest possible response, even if that response is occasionally a little stale?**

A lot of production incidents trace back to teams answering only the first question. They pick a "highly available" database for its partition behavior, without noticing that its default *else*-branch setting is also eventual consistency — and then are surprised when a user doesn't see their own write immediately after making it, on a perfectly healthy cluster.

## The takeaway

CAP is a theorem about failure. PACELC is a theorem about trade-offs you're making right now, whether you've noticed or not. Every distributed system you depend on has already answered both halves of this conditional — the question is whether you know which answers it gave, and whether they match what your application actually needs.
