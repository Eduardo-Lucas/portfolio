---
title: "Understanding IP Addresses"
excerpt: "An IP address is the addressing system that makes the internet possible. Here's how IPv4 and IPv6 differ, what public, private, static, and dynamic actually mean, and how to find your own."
date: "2026-07-19"
readTime: "5 min read"
tags: ["System Design", "Novice", "Networking", "Fundamentals"]
---

If you've ever wondered how your laptop knows how to find a website hosted on a server thousands of miles away, the answer lies in a simple but powerful concept: the IP address. Every device that connects to the internet — your phone, your smart TV, your router, even your smart fridge — relies on an IP address to communicate. This post breaks down what an IP address is, the different versions and types you'll encounter, and how you can check your own.

## What Is an Internet Protocol (IP) Address?

An IP address (Internet Protocol address) is a unique numerical label assigned to every device connected to a network that uses the Internet Protocol for communication. Think of it as a digital mailing address — just as the postal service needs your street address to deliver a package, the internet needs an IP address to deliver data packets to the correct device.

Every time you send an email, stream a video, or load a webpage, your device is sending and receiving small packets of data. Each packet contains a "source" and "destination" IP address so routers along the way know exactly where to send it. Without this addressing system, the internet as we know it simply couldn't function — there would be no way to distinguish one device from billions of others.

IP addresses are managed globally by the Internet Assigned Numbers Authority (IANA), which allocates blocks of addresses to Regional Internet Registries (RIRs). These registries then distribute addresses to internet service providers (ISPs), who assign them to individual users and organizations.

## Versions of IP Addresses

There are two versions of IP addresses in active use today:

### IPv4 (Internet Protocol version 4)
IPv4 has been the backbone of the internet since the 1980s. It uses a 32-bit address format, written as four decimal numbers separated by dots (e.g., `192.168.1.1`), with each number ranging from 0 to 255. This format allows for roughly 4.3 billion unique addresses.

That sounds like a lot, but with billions of smartphones, laptops, servers, and IoT devices online, the world officially ran out of new IPv4 addresses to allocate years ago. This scarcity is exactly why IPv6 was developed.

### IPv6 (Internet Protocol version 6)
IPv6 uses a 128-bit address format, written as eight groups of hexadecimal digits separated by colons (e.g., `2001:0db8:85a3:0000:0000:8a2e:0370:7334`). This expands the address pool to an almost incomprehensible 340 undecillion addresses — enough to assign a unique IP to every grain of sand on Earth many times over.

IPv6 also brings improvements beyond just capacity, including simplified header structures for faster routing, built-in support for encryption, and no need for network address translation (NAT). Adoption has been gradual, but most modern devices and ISPs now support both IPv4 and IPv6 simultaneously (a setup known as "dual stack").

## Types of IP Addresses

Beyond version, IP addresses can also be categorized by how they're used and assigned:

**Public vs. Private**
- A **public IP address** is the address your entire network uses to communicate with the outside internet. It's assigned by your ISP and is visible to websites and services you interact with.
- A **private IP address** is used within a local network (like your home Wi-Fi) to identify individual devices — your phone, laptop, and smart speaker each get their own private address, but they all share one public address when reaching the internet, thanks to your router.

**Static vs. Dynamic**
- A **static IP address** stays the same permanently. Businesses often use static IPs for servers so they can always be found at the same address.
- A **dynamic IP address** changes periodically, assigned automatically by a DHCP (Dynamic Host Configuration Protocol) server. Most home internet connections use dynamic IPs, which is more efficient for ISPs managing limited address pools.

**Shared vs. Dedicated**
Some hosting services assign a single IP to multiple websites (shared), while others give each site its own dedicated IP — often preferred for SSL certificates or specific server configurations.

## How to Check Your IP Address

Checking your IP address is quick and can be done a few different ways:

**Find your public IP:**
The simplest method is to search "what is my IP address" on Google, or visit a site like whatismyip.com. This shows the address your network uses to communicate with the wider internet.

**Find your private IP on Windows:**
1. Open Command Prompt
2. Type `ipconfig` and press Enter
3. Look for "IPv4 Address" under your active network adapter

**Find your private IP on Mac:**
1. Go to System Settings > Network
2. Select your active connection (Wi-Fi or Ethernet)
3. Your IP address will be listed under connection details

**Find your private IP on Linux:**
1. Open a terminal
2. Type `ip addr show` or `ifconfig`
3. Look for the "inet" entry under your active interface

**Find your IP on a smartphone:**
- On iOS: Settings > Wi-Fi > tap the (i) icon next to your connected network
- On Android: Settings > Network & Internet > Wi-Fi > tap your connected network

## Wrapping Up

IP addresses are the quiet infrastructure that makes the modern internet possible — every click, message, and stream depends on this addressing system working correctly behind the scenes. Understanding the difference between IPv4 and IPv6, public and private, and static and dynamic addresses gives you a much clearer picture of how your devices actually talk to the rest of the world. Next time your device connects to Wi-Fi, you'll know exactly what's happening under the hood.
