---
title: "Database Replication: The Backup That's Also Your Bottleneck"
excerpt: "Replication buys you availability and read scale, but never for free — you're always trading either latency or a data-loss window, and managing some amount of lag. Knowing which failure you're least willing to tolerate is the whole design decision."
date: "2026-10-25"
readTime: "5 min read"
tags: ["System Design", "Practitioner", "Databases"]
---

Somewhere in your architecture diagram there's a little arrow labeled "replica," and most engineers treat it as a solved problem — set it up once, forget it exists. Then a failover goes sideways, or a read comes back stale right after a write, and suddenly everyone's relearning what that arrow actually promised.

Replication is simple in concept — copy the data, keep the copies in sync — and surprisingly deep in practice, because "in sync" is doing a lot of work in that sentence.

## What replication is actually for

Database replication means maintaining multiple copies of the same data across different nodes, kept consistent with each other. Teams reach for it for a handful of distinct reasons, and it's worth being clear about which one you're solving for, because the right topology depends on it:

- **High availability** — if the primary dies, a replica can take over
- **Read scaling** — spread read traffic across multiple copies instead of hammering one node
- **Geographic locality** — serve users from a nearby region instead of a distant primary
- **Disaster recovery** — a copy that survives if the primary's datacenter doesn't

Notice none of these is "make writes faster." Replication almost never helps write throughput — every copy eventually needs the write — and conflating it with write scaling is a common early-career mistake.

## The three topologies

**Single-leader (primary-replica).** One node accepts writes; every other node replicates from it and serves reads. This is the default in PostgreSQL, MySQL, and MongoDB. It's simple to reason about — there's exactly one source of truth at any moment — but the primary is both your single point of failure and your write ceiling.

**Multi-leader.** Several nodes each accept writes and replicate to each other, common across multiple datacenters where you want local writes in each region. The tradeoff is conflict resolution: if two leaders accept conflicting writes to the same row before either replicates, something has to decide which one wins.

**Leaderless.** Any node can accept a write, and the client (or a coordinator) writes to several nodes at once, reading back from several and reconciling differences. Cassandra and DynamoDB use this model. It trades a clean mental model for resilience — there's no leader to lose.

## Synchronous vs. asynchronous: the trade-off that actually matters

This is the decision that determines what happens when things go wrong, and it's the one most worth understanding cold.

**Synchronous replication** waits for the replica to confirm it has the write before telling the client "success." Lose the primary, and the replica is guaranteed to be caught up — no data loss on failover. The cost is latency: every write waits on a round trip to the replica, and if that replica is slow or unreachable, so are your writes.

**Asynchronous replication** tells the client "success" as soon as the primary has the write, and ships it to replicas in the background. Writes stay fast and the primary doesn't stall if a replica lags. The cost shows up exactly when you need replication most: if the primary fails before a write ships, that write is gone, and the replica that gets promoted is missing it.

Most production systems land on a middle ground: **semi-synchronous replication**, where the primary waits for acknowledgment from just one replica (not all of them) before confirming the write. You get a durability guarantee without paying the latency cost of waiting on every copy.

## Replication lag is the thing that actually bites you

Replication lag is the delay between a write landing on the primary and that same write becoming visible on a replica. It's usually milliseconds. It's occasionally seconds, under load or after a large batch write. And it's the direct cause of one of the most common bug reports in any system with read replicas: **read-your-own-writes** violations — a user updates their profile, refreshes, and sees the old version, because the read got routed to a replica that hasn't caught up yet.

The usual fixes:
- **Route the immediate follow-up read to the primary** for a short window after a write
- **Read-your-writes tokens** — track a write's position and require a replica to have reached at least that position before serving a read for that user
- **Just tolerate it** — for content that isn't user-specific, a few hundred milliseconds of staleness is often fine

The mistake isn't having lag. Lag is physics — data takes time to travel. The mistake is not deciding, ahead of time, which reads can tolerate it and which can't.

## How the replication happens under the hood

Most modern databases replicate by shipping a log, not by re-running queries. PostgreSQL streams its write-ahead log (WAL); MySQL ships its binlog. The replica replays that log to reconstruct the same state, which is both faster and safer than re-executing SQL statements that might behave non-deterministically on a second run (think `NOW()` or `RAND()`).

This is also why replicas are usually **read-only** — they're a derived state, computed by replaying someone else's log, not an independent source of writes.

## The practical takeaway

Replication buys you availability and read scale, but it isn't free: you're trading either latency (synchronous) or a data-loss window (asynchronous), and you're always managing some amount of lag. The right setup depends on which failure you're least willing to tolerate — a slow write, a lost write, or a stale read — because replication can protect you from two of those at once, but never all three for free.
