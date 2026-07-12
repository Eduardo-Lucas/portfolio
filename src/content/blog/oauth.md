---
title: "OAuth: Letting Apps Act on Your Behalf Without Handing Over Your Password"
excerpt: "OAuth's real contribution is replacing 'share your credentials' with a scoped, revocable, time-limited token — here's how the authorization code flow, refresh tokens, and PKCE fit together."
date: "2027-01-31"
readTime: "4 min read"
tags: ["System Design", "Expert", "Security"]
---

Every time you click "Continue with Google" or let a scheduling tool see your calendar, you're relying on a protocol whose entire job is to prevent you from doing the one thing that feels natural: typing your password into a third-party app.

OAuth 2.0 exists to solve a specific, narrow problem — **delegated authorization**. Not "who are you" (that's authentication), but "what is this app allowed to do on your behalf, and for how long."

## The Problem It Replaces

Before OAuth, the pattern was ugly: a third-party app asked for your username and password for some other service, stored them, and used them to log in as you whenever it needed to. This meant:

- The third party had your full credentials, forever
- It could do anything your account could do, not just the one thing it needed
- Revoking access meant changing your password everywhere
- There was no way to see what had access to what

OAuth replaces "give me your password" with "let the actual service issue this app a limited, revocable token instead."

## The Four Roles

Every OAuth flow involves four parties:

- **Resource Owner** — you, the user who owns the data
- **Client** — the third-party app requesting access (e.g., a scheduling tool)
- **Authorization Server** — issues tokens after you approve access (e.g., Google's login/consent screen)
- **Resource Server** — the API that actually holds your data and accepts the token (e.g., Google Calendar's API)

Notice the client never sees your password. It only ever gets a token, and only after the authorization server confirms you approved it.

## The Authorization Code Flow

The most common flow — and the one you should default to for any server-side app — looks like this:

1. Your app redirects you to the authorization server's login/consent screen
2. You log in (if needed) and approve the specific permissions ("this app wants to read your calendar")
3. The authorization server redirects back to your app with a short-lived **authorization code**
4. Your app's backend exchanges that code — plus a client secret — for an **access token** (and often a **refresh token**)
5. Your app calls the resource server's API, attaching the access token on each request

The code-for-token exchange happens server-to-server, away from the browser, which is why a leaked authorization code alone isn't enough to compromise anything — it's single-use and expires in seconds.

## Tokens and Scopes

- **Access token** — a short-lived credential (often 15 minutes to an hour) the client presents to the resource server. Usually a JWT or an opaque string the server can look up.
- **Refresh token** — a long-lived credential used to get new access tokens without re-prompting the user. Stored server-side, never exposed to the browser.
- **Scopes** — the specific permissions granted, like `calendar.readonly` or `contacts.write`. The consent screen you see is just scopes rendered as human language.

Short-lived access tokens plus scopes are what make OAuth safer than shared passwords: even if a token leaks, it expires soon and can only do the narrow thing it was scoped for.

## PKCE: The Flow for Apps That Can't Keep a Secret

Mobile apps and single-page apps can't safely store a client secret — anyone can decompile the app or read the JS bundle. For these, OAuth uses **PKCE** (Proof Key for Code Exchange, pronounced "pixy"):

1. The app generates a random `code_verifier` and derives a `code_challenge` from it (a hash)
2. The challenge is sent with the initial authorization request
3. When exchanging the code for a token, the app must present the original verifier
4. The server checks that the verifier matches the challenge it received earlier

This proves the app exchanging the code is the same one that started the flow, without needing a secret at all. PKCE is now recommended for every client type, not just public ones.

## OAuth Is Not Authentication

This is the most common source of confusion: OAuth tells you an app has permission to call an API on your behalf. It does not, by itself, tell an application who you are.

"Login with Google" works because on top of OAuth, Google also returns an **ID token** — a signed JWT containing your identity claims (email, name, subject ID). That extra layer is **OpenID Connect (OIDC)**, a thin identity protocol built on top of OAuth's plumbing. If a system needs to know who's logging in, it needs OIDC, not bare OAuth.

## When You're Building This Yourself

A few practical rules:

- Never implement the resource-owner password flow (asking users for credentials directly) — it's deprecated for a reason
- Always use PKCE, even for confidential clients
- Keep access tokens short-lived; lean on refresh tokens for longevity
- Validate the `redirect_uri` exactly — open redirects here are a classic vulnerability
- Store refresh tokens server-side only, never in browser storage

OAuth's real contribution isn't cryptographic cleverness — it's the shift from "share your credentials" to "grant a scoped, revocable, time-limited token." Once that mental model clicks, every "Continue with X" button on the internet makes a lot more sense.
