---
title: "How DNS Actually Works"
excerpt: "DNS isn't a phonebook lookup — it's a distributed, heavily cached, eventually-consistent system, and most 'DNS is broken' bugs trace back to a stale cache or a TTL nobody planned for."
date: "2026-08-09"
readTime: "4 min read"
tags: ["System Design", "Novice", "Networking"]
---

You changed an A record two hours ago. Half your team sees the new site. The other half is still hitting the old server. Nobody touched anything else. This is normal, and understanding why it happens will save you hours of confused Slack threads.

DNS (Domain Name System) is the system that turns human-readable names like `api.example.com` into IP addresses computers can actually route traffic to. It's often called "the phonebook of the internet," but that undersells it — it's closer to a globally distributed, heavily cached, eventually-consistent database with almost no central authority. As a developer, you interact with it constantly, but the mental model most people carry around is incomplete.

## The resolution chain

When your laptop asks "what's the IP for `api.example.com`?", the request doesn't go to one server. It walks a chain:

1. **Stub resolver** — a tiny piece of OS-level code on your machine checks its local cache first, then forwards the query if it doesn't have an answer.
2. **Recursive resolver** — usually run by your ISP, or a public one like Cloudflare (`1.1.1.1`) or Google (`8.8.8.8`). This is the workhorse: it does the actual chasing-down on your behalf and caches the result for everyone else who asks.
3. **Root server** — one of 13 logical root server clusters worldwide. It doesn't know the answer, but it knows which server handles `.com`.
4. **TLD server** — the `.com` (or `.org`, `.dev`, etc.) nameserver. It doesn't know the IP either, but it knows which nameserver is authoritative for `example.com`.
5. **Authoritative nameserver** — the one your registrar or DNS host (Route 53, Cloudflare, NS1, etc.) runs. This is the actual source of truth. It returns the IP.

That answer then gets cached at every layer on the way back down, which is exactly why propagation isn't instant — and exactly why the next section matters.

## Record types you'll actually use

| Record | Purpose |
|---|---|
| **A** | Maps a hostname to an IPv4 address |
| **AAAA** | Same, but IPv6 |
| **CNAME** | Aliases one hostname to another (can't coexist with other records on the same name) |
| **MX** | Points to mail servers, with a priority value |
| **TXT** | Free-form text — used for domain verification, SPF/DKIM, and increasingly as a general-purpose config channel |
| **NS** | Delegates a zone (or subdomain) to a specific set of nameservers |
| **SOA** | Metadata about the zone itself: primary nameserver, refresh intervals, TTL defaults |

If you've ever fought with "can't add a CNAME at the root domain," that's not a bug — the DNS spec doesn't allow a CNAME to coexist with other records at the same name, and most registrars require an SOA/NS at the apex. Cloudflare and a few others work around this with proprietary "CNAME flattening."

## TTL: the actual reason changes feel slow

Every DNS record ships with a **TTL (time-to-live)**, in seconds, telling every resolver in that chain how long it's allowed to cache the answer before asking again. A record with a 3600 TTL means some resolver, somewhere, might legitimately serve a year-old answer for up to an hour after you changed it.

The practical takeaway: **lower your TTL before a planned migration**, not during it. Dropping a TTL from 86400 to 300 only helps once that change itself has propagated at the old TTL — so if you know a cutover is coming, drop the TTL days in advance, do the migration, then raise it back once things are stable.

## Debugging DNS like you mean it

`nslookup` gets you started, but `dig` gives you the whole chain:

```bash
dig api.example.com +trace
```

This walks the resolution from root to authoritative, showing you exactly where a stale or wrong answer is coming from. `dig +short` for a quick answer, `dig @1.1.1.1 api.example.com` to query a specific resolver directly and bypass your local cache entirely — invaluable when you suspect the problem is caching rather than the record itself.

## Security: DNS was not built with attackers in mind

The original protocol trusted every response by default, which opened the door to a few well-known problems:

- **Cache poisoning** — injecting a forged response into a resolver's cache so it serves an attacker-controlled IP for a legitimate domain.
- **DNS spoofing** — intercepting queries on the network path and returning fake answers.
- **Zone transfer leaks** — misconfigured authoritative servers that let anyone pull a full copy of a DNS zone, handing over your entire internal naming scheme.

**DNSSEC** addresses the first two by adding cryptographic signatures to DNS records, so a resolver can verify a response actually came from the zone's legitimate owner and wasn't tampered with in transit. It's not universally deployed — signing and validating add real operational overhead — but for anything handling sensitive traffic, it's worth the setup cost.

## The takeaway

DNS feels simple until the moment it doesn't, and almost every "mystery" bug traces back to one of two things: a cache serving a stale answer somewhere in the chain, or a record type interacting with another record in a way the spec doesn't actually allow. Understanding the resolution chain and respecting TTLs turns "DNS is being weird" into "I know exactly which layer to check."
