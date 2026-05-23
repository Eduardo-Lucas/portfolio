import AnimatedSection from "@/components/AnimatedSection";
import { Rocket, Code2, Database, Layers, ExternalLink, GitBranch } from "lucide-react";

export const metadata = {
  title: "Portfolio – Eduardo Lucas",
  description: "Projects and work by Eduardo Lucas — Senior Python/Django Developer.",
};

const placeholders = [
  {
    title: "ERP Integration Platform",
    desc: "Modernised a legacy Oracle ERP with a Python/Django REST API layer, enabling real-time data sync across 5 business units.",
    tags: ["Python", "Django", "Oracle", "REST API", "Docker"],
    icon: Database,
    color: "accent",
    status: "Case Study Coming Soon",
  },
  {
    title: "Tax Automation Engine",
    desc: "Built core calculation and reporting modules for a tax-tech SaaS serving Brazilian enterprises, reducing processing time by 70%.",
    tags: ["Python", "Django", "PostgreSQL", "Celery", "AWS"],
    icon: Code2,
    color: "violet",
    status: "Case Study Coming Soon",
  },
  {
    title: "Data Architecture Blueprint",
    desc: "Designed end-to-end data architecture for a manufacturing company — from SCADA ingestion to BI dashboards, with full compliance layer.",
    tags: ["Data Architecture", "PostgreSQL", "Python", "AWS", "Airflow"],
    icon: Layers,
    color: "accent",
    status: "Case Study Coming Soon",
  },
  {
    title: "Fitness Platform APIs",
    desc: "Developed backend APIs for a US-based fitness platform (HelloGym, Minnesota) — user management, scheduling, and payments.",
    tags: ["Python", "Django REST", "PostgreSQL", "International"],
    icon: Rocket,
    color: "violet",
    status: "Case Study Coming Soon",
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection className="mb-16 text-center">
          <span className="chip mb-4 inline-block">Work</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted text-lg leading-relaxed">
            Selected projects from 25+ years of enterprise development.
            Detailed case studies are being prepared — check back soon.
          </p>
        </AnimatedSection>

        {/* Coming soon notice */}
        <AnimatedSection className="mb-12">
          <div className="glass rounded-xl p-5 flex items-center gap-4 border border-accent/20 max-w-xl mx-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow flex-shrink-0" />
            <p className="text-sm text-muted">
              <span className="text-ink font-semibold">Portfolio in progress.</span>{" "}
              Detailed case studies with architecture diagrams and results will be published here.
            </p>
          </div>
        </AnimatedSection>

        {/* Project cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {placeholders.map((project, i) => {
            const Icon = project.icon;
            const isAccent = project.color === "accent";
            return (
              <AnimatedSection key={project.title} delay={i * 80}>
                <div className="glass rounded-2xl p-7 h-full flex flex-col group hover:border-white/15 transition-all duration-300">
                  {/* Icon & status */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isAccent
                          ? "bg-accent/12 border border-accent/25"
                          : "bg-violet/12 border border-violet/25"
                      }`}
                    >
                      <Icon
                        size={22}
                        className={isAccent ? "text-accent" : "text-violet"}
                      />
                    </div>
                    <span className={`chip text-[10px] ${isAccent ? "" : "chip-violet"}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-ink font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted text-sm leading-relaxed flex-1 mb-5">{project.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links placeholder */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <button
                      disabled
                      className="flex items-center gap-1.5 text-xs text-muted2 cursor-not-allowed"
                    >
                      <GitBranch size={13} />
                      Code
                    </button>
                    <button
                      disabled
                      className="flex items-center gap-1.5 text-xs text-muted2 cursor-not-allowed"
                    >
                      <ExternalLink size={13} />
                      Live
                    </button>
                    <span className="ml-auto text-xs text-muted2 italic">Coming soon</span>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* CTA */}
        <AnimatedSection className="text-center">
          <p className="text-muted mb-4">Have a project in mind?</p>
          <a
            href="mailto:eduardolucas40@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold rounded hover:bg-accent-dim transition-colors"
          >
            Let&apos;s talk
            <ExternalLink size={14} />
          </a>
        </AnimatedSection>
      </div>
    </main>
  );
}
