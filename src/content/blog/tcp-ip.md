---
title: "The TCP/IP Model: A Developer's Refresher"
excerpt: "TCP/IP is the four-layer stack the internet actually runs on: each layer wraps the one above it, strips its own header on the way back, and gives you a shape for reasoning about any network failure."
date: "2026-08-02"
readTime: "5 min read"
tags: ["System Design", "Novice", "Networking"]
---

Every time your code calls `fetch()`, opens a socket, or shells out to `curl`, it hands off a pile of bytes to a stack of protocols that you almost never think about. Most days you don't need to. The abstraction holds. But the day it doesn't — a mysterious timeout, a connection refused, a request that works on your machine and nowhere else — you're debugging the stack whether you meant to or not. It helps to already know its shape.

That's what the TCP/IP model gives you: a shape. Four layers, each with one job, each wrapping the one above it before handing it down to the next. Here's the refresher.

## It's just a nested object

If you've ever wrapped one object inside another — a request body inside an HTTP envelope inside a WebSocket frame — you already understand encapsulation, which is the entire trick behind networking. Sending data down the stack looks like this:

```
Ethernet Frame(
  IP Packet(
    TCP Segment(
      HTTP Data
    )
  )
)
```

Each layer takes what the layer above gave it, tacks on its own header, and passes the result down. On the receiving end, the exact same thing happens in reverse: each layer strips off its own header and hands the remainder up, until what's left is the original HTTP data your application asked for. Same stack, opposite direction. That's why it's called a stack.

The four layers, from the one your code lives in down to the one that's actually a physical wire:

| Layer | Handles | Examples |
|---|---|---|
| Application | What the bytes *mean* | HTTP, DNS, TLS, SMTP, gRPC |
| Transport | Getting bytes between two *processes* | TCP, UDP |
| Internet | Getting packets between two *networks* | IP, ICMP |
| Link | Getting frames between two *devices* on the same wire | Ethernet, Wi-Fi |

## Application layer: where your code actually lives

This is the only layer most application developers ever touch directly, and it's deliberately indifferent to everything below it. HTTP doesn't know or care whether it's riding over Wi-Fi, fiber, or a satellite link — that's the whole point of the layering. This layer's job is to define what the bytes *mean*: a GET request, a DNS query, a TLS handshake, an SMTP command.

## Transport layer: TCP or UDP, pick your guarantees

This is where ports live — which is why your server binds to `:8080` rather than the OS just picking a spot on the wire. It's also where you choose your delivery guarantees:

- **TCP** is ordered and reliable. It opens a connection with a three-way handshake, numbers every byte it sends, and retransmits anything that gets lost. You pay for this with a bit of latency and overhead, and in exchange your application never has to think about lost or out-of-order packets.
- **UDP** is fire-and-forget. No handshake, no retransmission, no ordering guarantee — just send the packet and hope. That tradeoff is exactly why it's the right choice for things like DNS lookups, video calls, and multiplayer games, where a late packet is worse than a dropped one.

Neither is "better" — they're guarantees you're buying or declining to buy, and the right choice depends entirely on whether your application can tolerate loss.

## Internet layer: IP gets it there, eventually

The internet layer's only job is addressing and routing — getting a packet from one network to another, hopping through routers along the way. It makes no promises about order or delivery; if a packet needs to arrive reliably and in sequence, that's the transport layer's problem, not this one. This is also the layer that fragments packets when they're too large for a given network link, and it's the layer `traceroute` is inspecting when it shows you the hops between you and a destination.

## Link layer: the last mile

The link layer handles the physical hop from your network interface to the next device on the same local network — a switch, a router, an access point. This is Ethernet frames and MAC addresses, the addressing scheme for devices that are directly reachable on the same wire or radio segment, as opposed to IP addresses, which route across many networks.

## The one mix-up worth avoiding

If you've studied networking formally, you've probably also met the **OSI model**, which splits things into seven layers instead of four, separating Application, Presentation, and Session into distinct layers where TCP/IP collapses all three into one. OSI is a teaching model, useful for reasoning precisely about where a given concern lives. TCP/IP is the model the actual internet runs on. They describe overlapping territory with different granularity, not competing versions of the same thing — worth remembering next time the distinction comes up in an interview.

## Using this when something breaks

The practical payoff of all this is a mental checklist for network failures. Next time a request fails, the symptom usually tells you which layer to look at first:

- **DNS resolution failure** → application layer
- **Connection refused** → transport layer (nothing's listening on that port)
- **Host unreachable / timeout** → internet layer (routing problem)
- **No link / cable unplugged** → link layer

You don't need to memorize an RFC to reason about a networking bug. You need the shape of the stack, and a habit of asking which layer just broke.

---

*Building something that touches sockets, HTTP clients, or infra day to day? This refresher is part of a series aimed at the concepts developers use constantly but rarely have to name.*
