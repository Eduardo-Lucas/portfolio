---
title: "Single Sign-On: One Login, Many Doors"
excerpt: "SSO works by moving trust, not passwords — an identity provider authenticates once, and every downstream application just verifies a signed assertion instead of checking a password itself."
date: "2027-01-24"
readTime: "5 min read"
tags: ["System Design", "Expert", "Security"]
---

Every product you build eventually needs more than one system. A marketing site, an app, an admin panel, a docs portal, a billing dashboard — each one, in the naive version of the world, asks the user to log in separately. Multiply that by however many services your company runs, and you've built a small nightmare: N passwords, N session stores, N places for credentials to leak, and a user who has long since given up remembering which login goes where.

Single Sign-On (SSO) is the fix. It lets a user authenticate once, with one identity provider, and move between every connected application without logging in again. Here's how SSO actually works under the hood, the two protocols that dominate it, and where it fits next to related concepts like OAuth.

## The Core Idea: Separate Authentication From Applications

The key architectural move in SSO is pulling authentication out of each individual application and centralizing it in one place — an **Identity Provider (IdP)**. Okta, Azure AD, Auth0, Google Workspace, and Keycloak are common examples. Your applications become **Service Providers (SPs)**: they don't verify passwords themselves, they trust the IdP to do it and accept its word for who the user is.

This is a trust relationship, not just a redirect. The SP and IdP agree in advance (via configuration, certificates, or metadata) that a signed assertion from the IdP is sufficient proof of identity. That agreement is what makes the "single" in single sign-on possible — without it, every app would need its own way of validating a user, and you're back to square one.

## The Flow, Step by Step

A typical SSO login looks like this:

1. A user tries to access an application (the SP) — say, your internal dashboard.
2. The SP notices there's no valid session and redirects the user to the IdP, along with a request identifying itself.
3. If the user isn't already authenticated with the IdP, they log in there — password, SSO-linked MFA, whatever the IdP requires.
4. The IdP generates a signed assertion (a token or ticket) confirming who the user is, and redirects the browser back to the SP with that assertion attached.
5. The SP validates the signature, extracts the user's identity, and creates a local session.

Now here's the part that actually delivers the "single" sign-on experience: if the user goes to a *second* application in step 1, the IdP already has an active session for them from step 3. It skips straight to generating a new assertion for the new SP — no login prompt at all. The user experiences this as "I'm just logged in everywhere," but mechanically it's a fresh assertion issued for each app, backed by one persistent session at the IdP.

## Two Protocols, Two Eras

SSO isn't one specific technology — it's a pattern, implemented by a couple of competing protocols.

**SAML (Security Assertion Markup Language)** is the older, XML-based standard, still heavily used in enterprise software. An IdP issues a SAML assertion — an XML document, digitally signed, containing the user's identity and attributes — and the browser carries it to the SP via an HTTP POST. SAML is verbose and occasionally painful to debug (nobody enjoys reading raw XML signatures), but it's mature, well-understood by enterprise IT teams, and deeply embedded in tools like Salesforce, Workday, and most corporate IdPs.

**OIDC (OpenID Connect)** is the modern alternative, built as an identity layer on top of OAuth 2.0. Instead of XML, it uses JSON Web Tokens (JWTs) and standard OAuth redirect flows. The IdP issues an **ID token** — a signed JWT containing claims like the user's ID, email, and session timing — which the SP decodes and verifies. OIDC is lighter weight, plays well with mobile and SPA clients, and has become the default choice for anything built in the last decade.

If you're integrating SSO today and have a choice, OIDC is usually the easier path. SAML shows up when the IdP or the enterprise customer mandates it — which, in B2B software, happens more often than you'd like.

## SSO vs. OAuth: A Common Mix-Up

It's worth being precise here, because these two get conflated constantly. **OAuth 2.0 is an authorization protocol** — it grants an application permission to act on a user's behalf against some resource (read your calendar, post to your feed) without handing over a password. It answers "what is this app allowed to do?"

**SSO answers a different question: "who is this user?"** OIDC exists specifically because OAuth alone doesn't have a standardized concept of identity — it was built for delegated access, not authentication. OIDC adds the ID token and a `/userinfo` endpoint on top of OAuth's existing token machinery, turning an authorization protocol into one that can also answer the identity question. So when you see OIDC described as "OAuth plus an identity layer," that's exactly the gap it's closing.

## Where SSO Earns Its Complexity

SSO isn't free. Standing up an IdP, configuring trust relationships with every SP, and handling session and logout semantics across multiple applications (single logout is notoriously fiddly to get right) is real engineering work. For a two-person side project, it's overkill.

It earns its keep once you have:

- Multiple internal or customer-facing applications sharing a user base
- Compliance or enterprise-sales requirements (many enterprise buyers simply require SSO before they'll sign a contract)
- A need for centralized access control — one place to disable a departing employee's access to *everything*, instead of hunting through a dozen systems

## Practical Takeaway

SSO works by moving trust, not passwords. The IdP does the authenticating once; every SP downstream just verifies a signed assertion and trusts the source. Whether that assertion travels as SAML's XML or OIDC's JWT is an implementation detail — the architectural shift that matters is centralizing "who are you" into a single system that everything else defers to. Once you're maintaining more than a couple of applications with a shared user base, that centralization stops being a nice-to-have and starts being the only sane way to manage identity at all.
