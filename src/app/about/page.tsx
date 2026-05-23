import AnimatedSection from "@/components/AnimatedSection";
import GitHubIcon from "@/components/GitHubIcon";
import { skillGroups } from "@/data/skills";
import {
  Server,
  Database,
  Cloud,
  Monitor,
  CheckCircle2,
  Briefcase,
  Layers,
  Cpu,
  MapPin,
  GraduationCap,
  Award,
  MessageSquare,
  Terminal,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  server: Server,
  database: Database,
  cloud: Cloud,
  monitor: Monitor,
  check: CheckCircle2,
  briefcase: Briefcase,
  layers: Layers,
  cpu: Cpu,
};

const education = [
  {
    school: "UNIPDS",
    degree: "Postgraduate – Applied AI Engineering",
    period: "Feb 2026 – Feb 2027",
    note: "In progress",
  },
  {
    school: "Fundação Getulio Vargas (FGV)",
    degree: "Postgraduate – Project Management",
    period: "2011 – 2013",
  },
  {
    school: "Universidade Salvador",
    degree: "Postgraduate – Web Systems & Applications",
    period: "2001 – 2003",
  },
  {
    school: "Faculdades Prof Nuno Lisboa",
    degree: "Tecnólogo em Processamento de Dados",
    period: "1987 – 1993",
  },
];

const certifications = [
  "PRINCE2® Foundation",
  "Pair Programming with AI",
];

export const metadata = {
  title: "About – Eduardo Lucas",
  description: "Senior Python/Django Developer with 25+ years of enterprise IT experience.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection className="mb-16 text-center">
          <span className="chip mb-4 inline-block">About Me</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="gradient-text">The Story</span>
            <br />
            <span className="text-ink">Behind the Code</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted text-lg leading-relaxed">
            I started my IT career in 1989 with ZIM databases and green-screen terminals.
            Today I design data architectures and build AI-assisted Python systems.
            The industry changed; my curiosity never did.
          </p>
        </AnimatedSection>

        {/* Bio cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <AnimatedSection direction="left">
            <div className="glass rounded-2xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <MapPin size={18} className="text-accent" />
                </div>
                <h2 className="text-xl font-bold text-ink">Who I Am</h2>
              </div>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Senior Python/Django Developer based in Brazil, with a decade of focused
                  web development on top of 25+ years of enterprise IT. I specialise in
                  scalable, secure, data-driven applications that modernise ERP systems
                  and support digital transformation.
                </p>
                <p>
                  My career has taken me from Salvador to São Paulo, with professional
                  assignments in the US — building systems for energy, aerospace, tax-tech,
                  fitness, and chemical sectors.
                </p>
                <p>
                  I bring a solid track record using Django, Django REST Framework, FastAPI,
                  PostgreSQL, Oracle, Docker, and AWS, with a strong emphasis on
                  performance, maintainability, and business value.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="glass rounded-2xl p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet/15 border border-violet/30 flex items-center justify-center">
                  <Cpu size={18} className="text-violet" />
                </div>
                <h2 className="text-xl font-bold text-ink">What Drives Me</h2>
              </div>
              <ul className="space-y-4">
                {[
                  {
                    title: "Solving Real Problems",
                    desc: "Technology that doesn't solve a business problem is just overhead. I bridge the gap between code and outcomes.",
                  },
                  {
                    title: "Clean Architecture",
                    desc: "Systems that are maintainable in 5 years are as important as systems that work today.",
                  },
                  {
                    title: "Continuous Learning",
                    desc: "Currently pursuing a postgraduate degree in AI Engineering — staying ahead matters.",
                  },
                  {
                    title: "Cross-Cultural Teams",
                    desc: "I've worked with teams across 4 continents and thrive in multicultural, distributed environments.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    <div>
                      <span className="text-ink font-semibold text-sm">{item.title} — </span>
                      <span className="text-muted text-sm">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        {/* Skills grid */}
        <AnimatedSection className="mb-20">
          <div className="text-center mb-10">
            <span className="chip mb-3 inline-block">Tech Stack</span>
            <h2 className="text-3xl font-black tracking-tighter text-ink">
              Skills & Expertise
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillGroups.map((group, i) => {
              const Icon = iconMap[group.icon] ?? Server;
              return (
                <AnimatedSection key={group.category} delay={i * 60}>
                  <div className="glass rounded-xl p-5 h-full hover:border-accent/20 transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Icon size={15} className="text-accent" />
                      </div>
                      <h3 className="text-sm font-bold text-ink">{group.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Education & Certifications */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection direction="left">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <GraduationCap size={18} className="text-accent" />
                </div>
                <h2 className="text-xl font-bold text-ink">Education</h2>
              </div>
              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.school} className="border-l-2 border-border pl-4 hover:border-accent/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <p className="text-ink font-semibold text-sm">{edu.school}</p>
                      {edu.note && (
                        <span className="chip text-[10px] py-0">{edu.note}</span>
                      )}
                    </div>
                    <p className="text-muted text-sm mt-0.5">{edu.degree}</p>
                    <p className="text-muted2 text-xs mt-0.5 font-mono">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet/15 border border-violet/30 flex items-center justify-center">
                  <Award size={18} className="text-violet" />
                </div>
                <h2 className="text-xl font-bold text-ink">Certifications & Languages</h2>
              </div>
              <div className="space-y-3 mb-8">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-3 px-4 py-3 bg-surface2 rounded-lg border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-ink text-sm font-medium">{cert}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-6">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">Languages</h3>
                <div className="space-y-2">
                  {[
                    { lang: "Portuguese", level: "Native / Bilingual", pct: 100 },
                    { lang: "English", level: "Full Professional", pct: 85 },
                  ].map(({ lang, level, pct }) => (
                    <div key={lang}>
                      <div className="flex justify-between mb-1">
                        <span className="text-ink text-sm font-medium">{lang}</span>
                        <span className="text-muted text-xs">{level}</span>
                      </div>
                      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-violet"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* AI Journey */}
        <AnimatedSection className="mt-20">
          <div className="text-center mb-10">
            <span className="chip mb-3 inline-block">AI-Assisted Development</span>
            <h2 className="text-3xl font-black tracking-tighter text-ink">
              My AI Journey
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              From autocomplete suggestions to agentic coding — how I adopted AI tooling and made it part of my daily workflow.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <GitHubIcon size={22} />,
                  tool: "GitHub Copilot",
                  era: "The first step",
                  color: "accent",
                  borderColor: "border-accent/30",
                  bgColor: "bg-accent/10",
                  desc: "My first serious AI pair programming tool. Copilot taught me that the bottleneck isn't typing speed — it's decision-making. Autocomplete got smarter; I started thinking at a higher level of abstraction.",
                  tags: ["Inline completion", "Tab-driven flow", "Code generation"],
                },
                {
                  icon: <MessageSquare size={22} />,
                  tool: "ChatGPT",
                  era: "Expanding the scope",
                  color: "violet",
                  borderColor: "border-violet/30",
                  bgColor: "bg-violet/10",
                  desc: "When GPT-3.5 landed, I shifted to conversational problem solving. Debugging sessions, architecture discussions, writing SQL — all faster and more iterative. AI stopped being a helper and became a thought partner.",
                  tags: ["Problem solving", "Architecture review", "Documentation"],
                },
                {
                  icon: <Terminal size={22} />,
                  tool: "Claude Code",
                  era: "Agentic engineering",
                  color: "accent",
                  borderColor: "border-accent/30",
                  bgColor: "bg-accent/10",
                  desc: "Claude Code changed the game again. Running directly in the terminal, it reads the full codebase, writes files, runs commands, and iterates. This website was built with it. I no longer context-switch — I describe intent and review the result.",
                  tags: ["Agentic CLI", "Full codebase context", "Multi-step tasks"],
                  current: true,
                },
              ].map((step, i) => (
                <AnimatedSection key={step.tool} delay={i * 100}>
                  <div className={`glass rounded-2xl p-7 h-full hover:${step.borderColor} transition-all duration-300 relative`}>
                    {step.current && (
                      <span className="absolute top-4 right-4 chip text-[10px] py-0">Current</span>
                    )}
                    <div className={`w-11 h-11 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center mb-5 text-${step.color}`}>
                      {step.icon}
                    </div>
                    <p className={`text-xs font-mono text-${step.color} mb-1 uppercase tracking-widest`}>{step.era}</p>
                    <h3 className="text-lg font-bold text-ink mb-3">{step.tool}</h3>
                    <p className="text-muted text-sm leading-relaxed mb-5">{step.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5">{tag}</span>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          <div className="mt-10 glass rounded-xl p-6 border-l-2 border-accent/50">
            <p className="text-muted text-sm leading-relaxed">
              <span className="text-ink font-semibold">The takeaway:</span>{" "}
              AI didn&apos;t replace the 25 years of context I carry — it amplified it. Knowing what to build and why is still human territory.
              AI handles the mechanical translation from intent to code, faster and with fewer typos than I ever managed alone.
              I&apos;m currently pursuing a{" "}
              <span className="text-accent">Postgraduate degree in Applied AI Engineering</span>{" "}
              to formalise what I&apos;ve been learning in the field.
            </p>
          </div>
        </AnimatedSection>

      </div>
    </main>
  );
}
