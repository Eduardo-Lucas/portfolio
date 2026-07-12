---
title: "Concurrency Control and Locks: Keeping Shared State Sane"
excerpt: "Race conditions are invisible until load arrives — locks and optimistic concurrency control are the two answers to the same question: who gets to touch shared state first, and what happens when two actors collide."
date: "2027-02-21"
readTime: "4 min read"
tags: ["System Design", "Expert", "Distributed Systems"]
---

Two requests hit your API at the same second. Both read a bank balance of $100. Both subtract $30. Both write back $70. The balance should be $40 — it's $70. Nobody made a mistake in their individual logic. The system just let two operations that should have been sequential run as if they were independent.

This is the **race condition**, and concurrency control is the set of techniques that stop it from quietly corrupting your data.

## Why This Shows Up Everywhere

Any time more than one thread, process, or server can read and write the same piece of state, you have a concurrency problem. It doesn't require exotic infrastructure — a single Node.js server handling two requests that both touch the same row, two Kubernetes pods hitting the same cache key, or two background jobs updating the same counter are all the same shape of bug. The trigger isn't multi-threading specifically; it's **shared mutable state** accessed without coordination.

The classic sequence is: read, modify, write. If two actors interleave those three steps, one actor's write can silently overwrite the effect of the other's. This is often called a **lost update**.

## Locks: The Blunt but Reliable Fix

A lock is a coordination primitive that says: only one actor gets to hold this at a time. Everyone else waits.

- **Mutex (mutual exclusion lock):** the simplest form — one owner at a time, full stop.
- **Read-write lock:** allows many concurrent readers, but a writer needs exclusive access. This works well when reads vastly outnumber writes.
- **Distributed lock:** the same idea, but coordinated across machines rather than threads in one process, typically implemented with a system like Redis (`SETNX` with a TTL) or a consensus store like ZooKeeper or etcd.

Locks solve the correctness problem, but they introduce new ones:

- **Contention:** if many actors want the same lock, they queue up, and throughput drops.
- **Deadlock:** actor A holds lock 1 and wants lock 2; actor B holds lock 2 and wants lock 1. Neither proceeds. Ever.
- **Held locks and crashes:** if a process dies while holding a lock and there's no timeout or lease, everything behind it can stall indefinitely — this is why distributed locks almost always need a TTL.

## Optimistic vs. Pessimistic Control

Locks are the **pessimistic** approach: assume conflict is likely, so block early and let only one actor proceed at a time.

The alternative is **optimistic concurrency control (OCC)**: assume conflicts are rare, let everyone proceed without blocking, and check for a conflict only at write time.

The most common OCC mechanism is a **version number** (or timestamp) on each row:

1. Read the row, noting `version = 5`.
2. Make changes in memory.
3. Write back with a condition: `UPDATE ... SET data = ?, version = 6 WHERE id = ? AND version = 5`.
4. If zero rows were affected, someone else updated it first — reject the write, and let the caller retry.

No blocking, no deadlocks, no held resources while an actor thinks. The cost is retries under contention, and retries mean your application code needs to handle the "someone got there first" case, not just the happy path.

## Choosing Between Them

Pessimistic locking earns its cost when conflicts are frequent and retries would be expensive or user-visible — think seat reservations on a flight, where you'd rather make people wait briefly than repeatedly fail and retry a purchase.

Optimistic concurrency control earns its keep when conflicts are rare and most operations touch independent data — think most CRUD APIs, where two users editing the same record at the same instant is the exception, not the rule.

Database engines also bake concurrency control into how transactions see data. **Isolation levels** — read committed, repeatable read, serializable — are really policies about how much of this coordination the database handles for you automatically, and at what cost to throughput. Reaching for application-level locks or version columns is often a sign you need stronger guarantees than your default isolation level gives you, not a replacement for understanding what that level already provides.

## Practical Takeaway

Concurrency bugs are invisible until load arrives, which is exactly why they're dangerous — a codebase can pass every test and still lose data the day two users hit the same button close enough together. Locks are the direct fix: correctness first, throughput second. Optimistic control flips that priority for the common case where actors mostly don't collide. Neither is universally right; the job is recognizing shared mutable state before it becomes a shipped bug, and picking the coordination strategy that matches how often that state actually gets contested.
