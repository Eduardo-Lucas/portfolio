---
title: "WebSockets, Long Polling, and Server-Sent Events"
excerpt: "Real-time features fail in production more often from picking the wrong transport than from bad code — here's how long polling, SSE, and WebSockets actually trade off, and how to choose before the incident, not after."
date: "2026-12-27"
readTime: "4 min read"
tags: ["System Design", "Expert", "APIs", "Real-Time"]
---

Most engineers meet this topic the hard way: a "real-time" feature ships, works fine in staging, then falls over in production because nobody thought about what happens when a load balancer doesn't understand your protocol, or why the client is hammering the server every 500ms. The mental model is simple enough to build in five minutes — it's just rarely built *before* the incident.

So let's build it now, proactively, instead of during an on-call shift.

## The Root Problem

HTTP was designed around a simple contract: client asks, server answers, connection closes. That model breaks the moment you need the server to tell the client something *without being asked first* — a new chat message, a price update, a job finishing in the background.

There are three common ways to bridge that gap, and they trade off in predictable ways: how wasteful they are, whether they're one-directional or two-directional, and how much infrastructure complexity they introduce.

## Long Polling: Stretching the Request-Response Model

Long polling keeps the original HTTP contract intact, but stretches it. The client sends a request; the server holds it open instead of responding immediately, waiting until it actually has something to say (or until a timeout forces a response). The moment the client gets a reply, it immediately opens another request.

It's still fundamentally request-response — just slow-motion. That means every cycle pays full price: a new TCP/TLS handshake, full HTTP headers, and connection setup, even if the payload is empty. At scale, that overhead adds up fast, and it's why long polling is usually a fallback rather than a first choice — useful when you're stuck behind infrastructure that doesn't support anything better.

**Practical takeaway:** if you see a client issuing requests in a tight loop with unusually long response times, that's long polling. It's not broken — it's just an older pattern doing its job at a real cost.

## Server-Sent Events: One Connection, One Direction

SSE opens a single long-lived HTTP connection and lets the server stream events down it as they occur, using the `text/event-stream` content type. The browser's native `EventSource` API handles the connection, reconnection, and even resuming from the last received event ID — all without extra client code.

The catch is that SSE is one-directional: server to client only. If the client needs to send data back, it does so over a normal separate HTTP request, not the same channel. SSE is also text-only by spec (binary has to be base64-encoded), and browsers cap the number of concurrent SSE connections per domain over HTTP/1.1 — a detail worth knowing before you open five of them on one page.

**Practical takeaway:** SSE is the right default for anything that's purely "server tells client" — live notifications, dashboards, activity feeds — and it's simpler to operate than it gets credit for, because it rides on ordinary HTTP infrastructure that proxies and load balancers already understand.

## WebSockets: Full Duplex, Full Responsibility

WebSockets start life as an HTTP request, then use an `Upgrade` handshake to switch the connection into a persistent, bidirectional socket. Once upgraded, either side can send a message at any time, with minimal overhead per message since there's no repeated header cost.

That power comes with responsibility. There's no equivalent of `EventSource` doing reconnection for you — you own the reconnect logic, message framing, and typically a heartbeat/ping-pong mechanism to detect a dead connection before the OS does. Infrastructure also needs to explicitly support the upgrade; older proxies or restrictive corporate networks can silently break WebSocket connections in ways that are painful to debug.

**Practical takeaway:** reach for WebSockets when the client genuinely needs to send data continuously too — chat, multiplayer state, collaborative editing. If traffic is mostly one-way, WebSockets are often more operational complexity than the problem requires.

## Choosing Between Them

| Situation | Best fit |
|---|---|
| Server pushes updates, client rarely/never sends real-time data | SSE |
| Both sides need continuous two-way messaging | WebSockets |
| Infrastructure doesn't support anything beyond plain HTTP | Long Polling |
| You want native reconnection with minimal client code | SSE |

The mistake worth avoiding — and the one that usually gets discovered in production — is defaulting to WebSockets because they sound more capable. A large share of "real-time" requirements are actually one-directional, and SSE handles them with a fraction of the operational surface: no custom protocol to load-balance, no reconnect logic to write, no heartbeat to maintain.

## The Mental Model to Keep

Think of it as a spectrum of how much the underlying HTTP request-response contract gets bent:

- **Long polling** keeps the contract, just delays the response — cheap to build, expensive to run at scale.
- **SSE** breaks the contract in one direction, keeps everything else about HTTP the same.
- **WebSockets** replaces the contract entirely with a new bidirectional protocol.

Knowing where a feature actually sits on that spectrum — before you build it — is the difference between choosing the right tool and finding out the hard way three weeks after launch.
