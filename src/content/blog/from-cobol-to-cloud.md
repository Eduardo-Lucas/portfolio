---
title: "From COBOL to Cloud: What a 1985 Army Computing Centre Taught Me About Being a Developer"
excerpt: "Joining the 80s-throwback photo trend, but set where it actually happened: a Brazilian Army Computing Centre. What COBOL, shared machine time, and a wall painted with 'DADOS, PESSOAS, SISTEMAS' taught a young programmer that still holds up 40 years later."
date: "2026-09-09"
readTime: "3 min read"
tags: ["Career", "Reflection", "Professional Growth"]
---

![Edu at the IBM terminal, Centro de Informática, Exército Brasileiro, November 1985](/blog/from-cobol-to-cloud.png)

*NOV 85 — Centro de Informática, Exército Brasileiro*

There's a trend going around where people recreate themselves in the 80s, and I couldn't resist joining in — except mine had to be set somewhere specific: a Computing Centre for the Brazilian Army, where I actually got my start.

Picture me sitting in front of an IBM terminal, green phosphor glow, a printer still chewing through fanfold paper behind me. The screen reads:

```
CIE - EXÉRCITO BRASILEIRO
SISTEMA OPERACIONAL DOS/CP
VERSÃO 3.1

READY.
_
```

Stacked next to the keyboard: *Linguagem COBOL*, *Sistemas Operacionais*, *Processamento de Dados*, *Organização de Computadores*, and a *Manual Técnico* thick enough to stop a door. That was the entire internet, back then. No Stack Overflow, no docs site, no Ctrl+F. If the answer wasn't in one of those books, you asked the sergeant two terminals down, or you figured it out yourself.

## The best thing a "programmer" could dream of

I wasn't a "developer" in 1985 — that word didn't exist yet in this context. I was a *programmer*, full stop, and COBOL was the language. Not one of several options. **The** option, if you were lucky enough to be working with data processing at all. Getting a seat in that room, at that Computing Centre, felt like getting handed the future.

And in a way, it was. COBOL was built for exactly the kind of work I still do today at DGTAX: taking mountains of structured, high-stakes financial and fiscal data and turning it into something a business — or in my case, a tax authority — can trust. The domain hasn't changed nearly as much as the syntax has.

## What that room actually taught me

It wasn't the language itself that stuck with me. It was everything around it:

- **Discipline before convenience.** There was no "just run it and see." Compile time was expensive, machine time was shared, and mistakes cost everyone in the room, not just you. You planned before you typed.
- **Respect for the manual.** Today I read documentation, RFCs, and source code. Back then it was literally a manual with a Ministry of Defence cover on it. The habit of *actually reading the manual* instead of guessing was forged right there.
- **Systems thinking.** "DADOS, PESSOAS, SISTEMAS" was painted on that wall for a reason. Data doesn't exist without people, and people don't get value from data without systems connecting the two. I'm still building exactly that triangle today — just with Django instead of DOS/CP.
- **Working under real constraints.** No cloud to autoscale into. No `pip install` to save you. Whatever the terminal in front of you could do, that was the entire budget. If you wanted performance, you earned it in the algorithm, not the hardware.

## From DOS/CP to Docker

The mug on the desk that day said *Disciplina, Tecnologia, Segurança, Soberania*. I didn't know it then, but that was basically a job description for everything that came after: running ERP and cost modules on Oracle at a multinational, SOX and InfoSec work alongside Deloitte and EY, and now co-founding a tax-tech startup built on Django, PostgreSQL, and an immutable ledger architecture that — funnily enough — isn't so different in spirit from the batch-processing rigor COBOL demanded.

The stack changed. FastAPI, Celery, Redis, AWS Lambda — none of that existed when this photo was taken. But the fundamentals painted on that wall in 1985 are the same ones I lean on when I'm designing a costing engine or reviewing a pull request today: know your data, respect your systems, and never ship something you haven't actually understood.

So yes, I'm joining the 80s-throwback trend — but I picked the setting that actually made me who I am. That many `READY.` prompts later, I'm still in front of a terminal, still solving the same kind of problem, just with a much better manual.

---

*What's your origin story? Whether it started on a mainframe, a TI-83, or a cracked copy of Visual Basic — I'd love to hear it.*
