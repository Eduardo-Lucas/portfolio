export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
  mediumUrl?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "stop-burning-tokens",
    title: "Stop Burning Tokens: A Developer's Guide to Smarter AI Usage",
    excerpt:
      "Upgrading your Claude plan won't fix inefficient habits. Learn practical strategies — from selective file referencing to model selection — to get more out of every session.",
    date: "2026-05-10",
    readTime: "5 min read",
    tags: ["AI", "Claude Code", "Developer Tools", "Productivity"],
    mediumUrl: "https://medium.com/@CariocaBotafogo/stop-burning-tokens-a-developers-guide-to-smarter-ai-usage-0a07dc9e77bc",
    content: `
# Stop Burning Tokens: A Developer's Guide to Smarter AI Usage

Hitting your Claude quota mid-sprint is frustrating. The instinct is to upgrade — but the real problem is usually how you're using the tool, not how much you're paying for it.

## What This Article Covers

- Why token waste happens and how to spot it
- Selective file referencing to keep context lean
- Choosing between Sonnet and Opus for the right tasks
- Managing extended thinking and session windows
- Practical habits that stretch your quota further

Read the full article on Medium using the button above.
`,
  },
  {
    slug: "from-procedures-to-intelligence",
    title: "From Procedures to Intelligence: A Developer's Shift Across Paradigms",
    excerpt:
      "From writing every line by hand to orchestrating systems through intent — how programming paradigms evolved and what it means to be a developer in the AI era.",
    date: "2026-05-02",
    readTime: "3 min read",
    tags: ["AI", "Software Architecture", "Career", "Programming Paradigms"],
    mediumUrl: "https://medium.com/@CariocaBotafogo/from-procedures-to-intelligence-a-developers-shift-across-paradigms-4161f44f160a",
    content: `
# From Procedures to Intelligence: A Developer's Shift Across Paradigms

Every generation of developers has had to unlearn something. Procedural gave way to object-oriented; object-oriented gave way to functional and distributed thinking. Now AI-assisted development is rewriting the rules again.

## What This Article Covers

- The arc from procedural code to OOP to AI collaboration
- How "abstraction increases, manual control decreases" across each shift
- The evolving role of the developer: from typist to architect to orchestrator
- What GitHub Copilot, ChatGPT, and Claude represent in this continuum

Read the full article on Medium using the button above.
`,
  },
  {
    slug: "ai-powered-job-interviews",
    title: "Talking to the Machine: How to Survive — and Win — AI-Powered Job Interviews",
    excerpt:
      "AI screening is now standard in senior tech hiring. Before your CV reaches a human, an algorithm has already scored it. Here's how to engineer your way through it.",
    date: "2026-05-01",
    readTime: "4 min read",
    tags: ["AI", "Career", "Job Interviews"],
    mediumUrl: "https://medium.com/@CariocaBotafogo/talking-to-the-machine-how-to-survive-and-win-ai-powered-job-interviews-528fa389043b",
    content: `
# Talking to the Machine: How to Survive — and Win — AI-Powered Job Interviews

AI-powered screening is now a standard part of the hiring funnel for senior tech roles. Before your CV ever reaches a human recruiter, it may already have been scored, ranked, and filtered by an algorithm.

## What This Article Covers

The anxiety around AI-evaluated interviews is understandable — but mostly misplaced. Once you understand how these systems work, they become a constraint to engineer around, not a judgment to fear.

- How AI screening systems actually evaluate candidates
- The STAR method and why structured answers score higher
- Keyword alignment strategies that get you past the initial filter
- What shifts once you know a human is reading

Read the full article on Medium using the button above.
`,
  },
  {
    slug: "gratitude-growth-long-goodbye",
    title: "Gratitude, Growth, and the Weight of a Long Goodbye",
    excerpt:
      "After 26 years with one company, a LinkedIn farewell post becomes a meditation on how long careers shape identity — and why every role, challenge, and colleague leaves a mark.",
    date: "2026-04-12",
    readTime: "3 min read",
    tags: ["Career", "Leadership", "Reflection", "Professional Growth"],
    mediumUrl: "https://medium.com/@CariocaBotafogo/gratitude-growth-and-the-weight-of-a-long-goodbye-487db36448c7",
    content: `
# Gratitude, Growth, and the Weight of a Long Goodbye

After 26 years with the same organization, leaving isn't a single event — it's a slow accumulation of lasts. The last stand-up. The last deployment. The last goodbye to someone who understood exactly what you'd been through.

## What This Article Covers

- Why LinkedIn farewell posts aren't performative — they're necessary
- How careers become intertwined with organizational identity
- The idea that every role, every challenge, every colleague shapes who you become
- What "cumulative career" means in practice

Read the full article on Medium using the button above.
`,
  },
  {
    slug: "ai-cant-replace-thinking",
    title: "AI Can Write Code — But It Can't Replace Thinking: Why Learning Programming Still Matters",
    excerpt:
      "GitHub Copilot generates the snippet. ChatGPT explains the error. But neither can decide if the architecture is wrong. Foundational programming knowledge is more valuable now, not less.",
    date: "2026-04-05",
    readTime: "3 min read",
    tags: ["AI", "Software Engineering", "Programming", "Tech Careers"],
    mediumUrl: "https://medium.com/@CariocaBotafogo/ai-can-write-code-but-it-cant-replace-thinking-why-learning-programming-still-matters-5de7da742386",
    content: `
# AI Can Write Code — But It Can't Replace Thinking: Why Learning Programming Still Matters

AI tools can generate a working function in seconds. They can explain a stack trace, suggest a refactor, and scaffold an entire module from a prompt. So why does learning to program still matter?

## What This Article Covers

- Why AI-generated code still needs a human who understands it
- The gap between generating code and validating it
- Debugging and architectural decisions that AI tools can't make alone
- Why foundational programming knowledge compounds faster in the AI era

Read the full article on Medium using the button above.
`,
  },
  {
    slug: "is-claude-code-worth-it",
    title: "Is Claude Code Worth It If You Already Use ChatGPT and GitHub Copilot?",
    excerpt:
      "A third AI subscription is a hard sell. Here's an honest cost-benefit breakdown of where Claude Code earns its place — and where it's redundant.",
    date: "2026-03-25",
    readTime: "4 min read",
    tags: ["AI", "Claude Code", "Developer Tools", "GitHub Copilot"],
    mediumUrl: "https://medium.com/@CariocaBotafogo/is-claude-code-worth-it-if-you-already-use-chatgpt-and-github-copilot-e864fa06f2a0",
    content: `
# Is Claude Code Worth It If You Already Use ChatGPT and GitHub Copilot?

You already pay for GitHub Copilot. ChatGPT handles your conversational debugging. Adding Claude Code to the stack is a real money question, not a shiny-tool question.

## What This Article Covers

- What Claude Code does that ChatGPT and Copilot don't
- Where it genuinely adds value: large-scale refactoring, legacy codebases, multi-file tasks
- Where it's redundant: standard API work, CRUD development, quick lookups
- The honest cost-benefit verdict: situational investment, not automatic upgrade

Read the full article on Medium using the button above.
`,
  },
];
