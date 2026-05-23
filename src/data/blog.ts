export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "25-years-in-it-lessons-learned",
    title: "25 Years in IT: What the Industry Actually Taught Me",
    excerpt:
      "From ZIM databases in 1989 to AI pair programming in 2024 — a candid retrospective on what really matters in a long tech career.",
    date: "2025-03-10",
    readTime: "8 min read",
    tags: ["Career", "Reflection", "Software Engineering"],
    content: `
# 25 Years in IT: What the Industry Actually Taught Me

Starting my IT career in August 1989, I've witnessed more paradigm shifts than most people have had jobs. Mainframes gave way to client-server, which gave way to the web, which is now dissolving into distributed cloud-native systems laced with AI. And yet, the fundamentals haven't changed at all.

## The Technology Changes. The Problems Don't.

Every decade brings a new stack. In the early 90s it was ZIM databases and green-screen terminals. By 2000 it was Oracle and ERP systems. By 2010 it was SOA and web services. Today it's Python microservices, Docker containers, and LLM-powered automation.

But the *problems* enterprises face are remarkably consistent: data silos, poor integration, manual processes that should be automated, and systems that resist change. The tools evolve; the pain remains.

## What Actually Delivers Value

After 25 years of watching projects succeed and fail, here's my working theory: **projects fail at the boundaries, not at the core**. The code usually works. It's the handoff between systems, teams, and departments where things fall apart.

This is why I've become obsessed with integration patterns, API design, and data architecture. The logic is easy. The connections are hard.

## The AI Inflection Point

The last two years have been the most disruptive I've ever seen — and I've seen Y2K, the dot-com crash, and the smartphone era. AI pair programming isn't hype. It genuinely changes the velocity ceiling for individual developers.

I'm now pursuing a postgraduate degree in Applied AI Engineering. Not because I need another credential, but because I genuinely believe this is the most consequential shift in software development history.

## The Advice I'd Give Myself in 1989

- Learn the business domain as deeply as you learn the technology.
- Write code for the person who reads it next, not the machine that runs it.
- Every legacy system was once someone's brilliant idea. Respect it.
- The soft skills compound faster than the technical ones.
`,
  },
  {
    slug: "django-drf-production-patterns",
    title: "Django REST Framework in Production: Patterns That Actually Scale",
    excerpt:
      "After years building enterprise Django APIs, here are the architectural patterns that separate toy projects from production-grade systems.",
    date: "2025-04-22",
    readTime: "10 min read",
    tags: ["Python", "Django", "API Design", "Backend"],
    content: `
# Django REST Framework in Production: Patterns That Actually Scale

Building Django APIs for startups and for enterprises are completely different challenges. The framework is the same; the requirements are not.

## Serializer Discipline

The most common Django API mistake I see is treating serializers as a thin wrapper around models. In production systems with business rules, this falls apart fast.

A cleaner approach: separate your serializers by use case.

\`\`\`python
class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "created_at"]

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "full_name"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
\`\`\`

## Service Layer: The Missing Piece

Django's MVT pattern doesn't prescribe a service layer, which is why most Django codebases become bloated views and fat models within 18 months.

I've found that extracting business logic into a \`services/\` module dramatically improves testability and reuse.

## Caching Strategy

For enterprise-scale APIs, caching is not optional. My default approach:
- Redis for session and hot-path data
- Vary headers for CDN edge caching
- ETags for expensive read endpoints

## Async Tasks with Celery

Any operation that takes more than 200ms should be a background task. This is non-negotiable at scale.

## Monitoring from Day One

In production, you need to know *before* your users do when something breaks. APM tools, structured logging, and alerting should be wired in at project inception, not retrofitted later.
`,
  },
  {
    slug: "erp-modernization-python-perspective",
    title: "ERP Modernization: A Python Developer's Field Guide",
    excerpt:
      "What to expect, what to avoid, and what nobody tells you about replacing or modernizing enterprise ERP systems with modern Python stacks.",
    date: "2025-05-18",
    readTime: "12 min read",
    tags: ["ERP", "Python", "Enterprise", "Architecture"],
    content: `
# ERP Modernization: A Python Developer's Field Guide

I've spent a significant portion of my career inside ERP systems — Oracle, SAP, and custom-built enterprise platforms. Modernizing these systems is one of the highest-leverage, highest-risk things a technology organization can attempt.

## Why ERP Projects Fail

The number one reason ERP modernization projects fail has nothing to do with the technology. It's the assumption that software alone changes how people work.

ERP systems encode decades of business process decisions. Replacing them means changing those processes, which means changing behavior, which means organizational change management. Most tech teams are not equipped for this.

## The Strangler Fig Pattern

The safest approach to ERP modernization is the Strangler Fig: replace functionality incrementally while the old system continues to run in parallel.

With Python/Django, this typically looks like:
1. Build an API layer that wraps legacy ERP endpoints
2. Route new functionality to the modern stack
3. Migrate data progressively with dual-write strategies
4. Sunset legacy modules one at a time

## Data Model Pitfalls

Legacy ERP databases are almost always heavily denormalized, with business logic embedded in stored procedures and views. Mapping this to a clean Django ORM is a multi-month exercise.

My advice: don't try to map it perfectly from the start. Build read models optimized for your application's actual queries, and accept that the transition period will be messy.

## The SOX Compliance Constraint

If your client operates under Sarbanes-Oxley (as many of mine have), every change to financial processing is subject to audit. This means:
- Comprehensive audit trails on every transaction
- Immutable logging of data changes
- Separation of duties enforced in code, not just policy

## Conclusion

ERP modernization is the hardest category of software project I've worked on. The technical challenges are manageable. The organizational ones require patience, diplomacy, and an unusual ability to make the business understand why the thing that worked for 20 years needs to change.
`,
  },
  {
    slug: "ai-pair-programming-2025",
    title: "AI Pair Programming in 2025: What Changed, What Didn't",
    excerpt:
      "One year of daily AI-assisted development — an honest assessment of what accelerates, what still requires human judgment, and where the tools fall short.",
    date: "2025-05-01",
    readTime: "7 min read",
    tags: ["AI", "Productivity", "Python", "Developer Tools"],
    content: `
# AI Pair Programming in 2025: What Changed, What Didn't

I hold a certification in Pair Programming with AI, and more importantly, I've been doing it every day for over a year. Here's my unfiltered assessment.

## What Genuinely Accelerated

**Boilerplate elimination.** Serializers, migrations, test scaffolding, CRUD views — anything pattern-based is now nearly instantaneous. This alone represents a 30–40% productivity gain for routine backend work.

**Debugging.** Describing a traceback to an AI assistant and getting a targeted hypothesis is faster than stack-tracing manually in most cases. Not always — but most.

**Documentation.** Generating docstrings, README sections, and API documentation from code is now a one-shot operation.

## What Still Requires Human Judgment

**Architecture decisions.** AI tools are excellent at generating code within a pattern. They're weak at questioning whether the pattern is right. The decision to use a service layer, event-driven architecture, or CQRS is still entirely a human call.

**Business domain understanding.** No tool understands why your client's tax computation module has that inexplicable edge case from 2011. That's still tribal knowledge.

**Production readiness.** AI-generated code passes tests but often misses operational concerns: connection pool sizing, cache invalidation edge cases, failure mode handling.

## The Skill That Matters Most Now

The most valuable skill in AI-assisted development is *knowing what to ask*. Prompt engineering for code generation is a craft that rewards domain expertise — the better you understand the problem, the better the output you elicit.

This is good news for senior engineers. Our value isn't being replaced; it's being multiplied.
`,
  },
  {
    slug: "data-architecture-manufacturing",
    title: "Data Architecture for Manufacturing & Chemical Sectors",
    excerpt:
      "Designing data systems for industries where reliability, traceability, and compliance are non-negotiable — hard-won lessons from the field.",
    date: "2025-02-14",
    readTime: "9 min read",
    tags: ["Data Architecture", "Manufacturing", "Enterprise", "Python"],
    content: `
# Data Architecture for Manufacturing & Chemical Sectors

Manufacturing and chemical companies are data-rich and insight-poor. They generate enormous volumes of operational data, but converting it into business intelligence requires an architecture built for reliability, traceability, and regulatory compliance.

## The Data Landscape

A typical mid-size manufacturing company has:
- SCADA systems generating real-time sensor data
- ERP systems capturing financial and logistics flows
- Quality management systems with batch traceability
- Maintenance systems with equipment history
- External compliance reporting requirements

Integrating these without a coherent data architecture leads to what I call "spreadsheet infrastructure" — critical business processes running on Excel files emailed between departments.

## Core Design Principles

**Traceability over convenience.** In chemical manufacturing especially, you need to trace every batch from raw material receipt to product delivery. This means audit trails, not just snapshots.

**Event sourcing for operations.** Rather than overwriting records, log every state change as an event. This enables both compliance reporting and operational replay for debugging.

**Separation of operational and analytical models.** Your production database is not your analytics database. Build a proper data warehouse or lakehouse layer for reporting.

## Python in the Data Stack

Python has become the de facto language for data engineering, and for good reason. With tools like:
- **SQLAlchemy** for ORM-level database interaction
- **Pandas/Polars** for data transformation
- **Airflow** for pipeline orchestration
- **FastAPI** for data API services

...you can build a coherent, maintainable data architecture without specialized tooling.

## The Compliance Layer

Regulatory compliance (ISO, GMP, SOX) imposes constraints that must be designed in from the start:
- Immutable audit logs
- Role-based data access controls
- Data retention and archival policies
- Cross-system reconciliation reports

Retrofitting compliance into an existing system is 10× harder than building it in. This is the single most common mistake I see in greenfield projects.
`,
  },
];
