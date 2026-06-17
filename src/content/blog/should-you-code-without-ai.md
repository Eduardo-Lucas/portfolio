---
title: "Should You Be Able to Code Without AI? The Question Splitting the Dev Community"
excerpt: "There's a heated debate in hiring rooms about whether developers should code without AI. After 25+ years in enterprise software, here's my honest take on fundamentals, fluency, and what interviews should actually test."
date: "2026-06-17"
readTime: "6 min read"
tags: ["AI", "Engineering", "Pair Programming", "Hiring"]
---

There's a debate happening in hiring rooms right now, and it's making engineers uncomfortable.

It goes something like this: a candidate opens their laptop for a technical interview. They're sharp, articulate, clearly experienced. Then the interviewer says, *"We'd like you to complete this without AI assistance."* And suddenly, the dynamic shifts. Some candidates freeze. Others argue the premise. A few walk out.

I've heard variations of this story from colleagues in São Paulo, London, and San Francisco. And it's raising a question that doesn't have an easy answer: **what does "knowing how to code" even mean in 2025?**

---

## The Split Is Real

Ask ten senior engineers whether developers should be able to code without AI, and you'll get two roughly equal camps — and a lot of passionate monologues.

**Camp 1: Fundamentals First.** These folks believe that if you can't write a loop without Copilot whispering the syntax in your ear, you don't truly understand what you're doing. You're operating the tool, not the craft. Their argument: the moment something breaks in production at 2am, you need to be able to reason through a debugger session without a chatbot holding your hand. AI doesn't understand your codebase. You do. Or you should.

**Camp 2: Tools Are the Job.** These engineers roll their eyes at the first group. They point out that no one asks architects if they can draft blueprints by hand before allowing them to use AutoCAD. The job is to ship working software. If AI helps you do that faster and with fewer bugs, refusing to use it isn't principled — it's performative. Gatekeeping a generation of talent because they grew up with better tools isn't quality control; it's nostalgia.

Both camps have real points. And the truth, as usual, is somewhere in the uncomfortable middle.

---

## By the Way — That Thing Where Someone Watches You Code?

Before I go further, let me answer the question I've been getting in DMs: **what do you call it when someone watches you code while you write?**

It's called **pair programming** — and specifically, the person watching is the **navigator**, while the person typing is the **driver**. The navigator proposes direction, catches errors in real time, thinks about the bigger picture. The driver focuses on execution, translating ideas into syntax.

This isn't just interview theater. It's a legitimate software development practice used by teams at Amazon, ThoughtWorks, and countless startups. The navigator-driver model is designed so that both people stay engaged — one in the weeds, one with the map.

What's fascinating is that pair programming is now experiencing a kind of AI-induced identity crisis too. A [2024 Stack Overflow study](https://stackoverflow.com/) found that 84% of professional developers were using or planning to use AI coding tools. Some engineers describe working with GitHub Copilot as a form of AI pair programming — with the AI acting as a kind of always-on navigator. But there's a key difference: the AI doesn't push back. It doesn't say *"wait, did you think about edge cases here?"* A human navigator does.

---

## The Real Problem with AI-Only Coders

Here's my honest take after 25+ years in enterprise software: the issue isn't AI. The issue is **shallow fluency**.

AI tools like Claude, Copilot, and Cursor are extraordinary force multipliers — when you already know what you're building. They're terrifying in the hands of someone who doesn't.

I've reviewed code from junior developers who used AI to generate entire Django views without understanding what a QuerySet is, why N+1 queries happen, or what the difference between `select_related` and `prefetch_related` means for database load. The code *runs*. It passes superficial testing. And then it silently destroys your database performance at scale.

The AI didn't teach them the wrong thing. It just taught them *nothing* — because they didn't have the foundation to ask the right questions, recognize bad output, or debug what they didn't write.

This is the core of the debate. **AI is a multiplier, not a foundation.** Multiply zero by anything, and you still get zero.

---

## But Interviews Are a Weird Place to Test This

Here's where I'll push back on the "code without AI" crowd: the solution isn't to ban AI from interviews. It's to redesign what you're actually testing.

A whiteboard coding session in a vacuum doesn't tell you whether someone is a good engineer. It tells you whether they can perform under artificial stress in an artificial environment. That's a useful data point, but it's not the whole picture — and pretending it is has been causing hiring mistakes for decades before AI existed.

What actually reveals engineering quality:

- Can they **read unfamiliar code** and describe what it does?
- Can they identify a **bug in AI-generated output** when you show it to them?
- Can they explain *why* a solution works, not just *that* it works?
- Do they ask good clarifying questions before writing anything?
- When the first approach doesn't work, how do they debug?

These are navigator skills. These are the things a great engineer does whether they're pair programming with a human or orchestrating an AI assistant. And they require genuine understanding — understanding you can't fake with autocomplete.

---

## What Good AI-Assisted Development Actually Looks Like

I want to be clear: I use AI daily. It's in my Django Ninja APIs. It's in my infrastructure scripts. It helps me write boilerplate I've written a thousand times, so I can focus my energy on the architectural decisions that actually matter.

But here's what that workflow actually looks like when it's done well:

**I know what I'm asking for.** When I prompt Claude to generate a FastAPI schema, I already know what the schema should look like. I'm using AI to save 10 minutes of typing — not to figure out what a schema is.

**I review everything.** I don't ship code I don't understand. If the AI generates something I can't explain to a colleague, I either learn what it does or I rewrite it myself.

**I treat it like a junior pair partner.** Capable, fast, occasionally overconfident. Needs review. The navigator (me) is always in the room.

**I still debug without it sometimes.** Not because it's a virtue, but because tracing through a stack trace forces you to understand your own code. That understanding is compounding — it makes you a better AI user too.

---

## What Should Companies Actually Do?

If you're on the hiring side, here's my practical take:

**Stop banning AI in interviews. Start designing better interviews.** Show candidates a piece of AI-generated code with a subtle bug — a race condition, a missing index, an N+1 query — and ask them to find it. If they can, they understand what they're doing. If they can't, the ban on AI wouldn't have helped you anyway.

**Distinguish between AI-assisted and AI-dependent.** One is a productivity upgrade. The other is a liability. The interview should probe which one you're looking at.

**Hire for growth, not for nostalgia.** The engineer who refuses to use AI and codes everything by hand isn't necessarily better. They might just be slower, and slower often means buggier in the long run.

---

## The Bottom Line

Should you be able to code without AI? Partially, yes — in the same way a chef should be able to cook without a food processor. You don't have to do it every day. But if you've never done it, you don't really understand what the machine is doing for you.

The engineers I worry about aren't the ones using AI. They're the ones using AI without understanding the craft underneath. And the solution isn't to take away their tools. It's to make sure they built the foundation first.

The pair programming dynamic — navigator and driver, human and AI, senior and junior — is still the best mental model for this. Someone has to have the map. Someone has to know where you're going. And right now, that still has to be you.
