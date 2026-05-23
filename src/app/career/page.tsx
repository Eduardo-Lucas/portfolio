import AnimatedSection from "@/components/AnimatedSection";
import { experience } from "@/data/experience";
import { MapPin, Calendar, Briefcase } from "lucide-react";

export const metadata = {
  title: "Career – Eduardo Lucas",
  description: "25+ years of enterprise IT experience across Brazil, USA, and beyond.",
};

export default function CareerPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection className="mb-16 text-center">
          <span className="chip mb-4 inline-block">25+ Years</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-ink">Career</span>{" "}
            <span className="gradient-text">Journey</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted text-lg leading-relaxed">
            From ZIM databases in 1989 to cloud-native Python architectures today —
            a career built on continuous reinvention and enterprise impact.
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent md:-translate-x-px" />

          <div className="space-y-10">
            {experience.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <AnimatedSection
                  key={`${exp.company}-${i}`}
                  delay={i * 50}
                  direction={isLeft ? "left" : "right"}
                  className="relative flex items-start gap-6 md:gap-0"
                >
                  {/* Desktop: left side content */}
                  <div
                    className={`hidden md:block w-1/2 ${isLeft ? "pr-12 text-right" : "pl-12 order-3"}`}
                  >
                    {isLeft ? (
                      <ExperienceCard exp={exp} align="right" />
                    ) : (
                      <div className="pt-2">
                        <div className="flex items-center justify-start gap-2">
                          <Calendar size={12} className="text-muted2" />
                          <span className="text-xs font-mono text-muted2">{exp.period}</span>
                        </div>
                        {exp.duration && (
                          <p className="text-xs text-muted2 mt-0.5 ml-[20px]">{exp.duration}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        exp.current
                          ? "bg-accent border-accent animate-pulse-glow"
                          : "bg-surface border-accent/40"
                      }`}
                    />
                  </div>

                  {/* Mobile / right side content */}
                  <div
                    className={`flex-1 md:w-1/2 ${isLeft ? "md:pl-12 md:order-3" : "md:pr-12 md:text-right"}`}
                  >
                    {/* Mobile always shows full card */}
                    <div className="md:hidden">
                      <ExperienceCard exp={exp} align="left" />
                    </div>
                    {/* Desktop right column */}
                    <div className="hidden md:block">
                      {isLeft ? (
                        <div className="pt-2">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-muted2" />
                            <span className="text-xs font-mono text-muted2">{exp.period}</span>
                          </div>
                          {exp.duration && (
                            <p className="text-xs text-muted2 mt-0.5 ml-[20px]">{exp.duration}</p>
                          )}
                        </div>
                      ) : (
                        <ExperienceCard exp={exp} align="left" />
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <AnimatedSection className="mt-20 text-center">
          <div className="glass rounded-2xl p-10 max-w-xl mx-auto">
            <Briefcase size={32} className="text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-ink mb-3">Open to New Challenges</h2>
            <p className="text-muted mb-6 text-sm leading-relaxed">
              Senior roles in Python/Django engineering, data architecture, or technical leadership.
              Remote-friendly, internationally experienced.
            </p>
            <a
              href="mailto:eduardolucas40@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold rounded hover:bg-accent-dim transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}

function ExperienceCard({
  exp,
  align,
}: {
  exp: (typeof experience)[number];
  align: "left" | "right";
}) {
  return (
    <div className={`glass rounded-xl p-5 hover:border-accent/20 transition-all duration-300 group ${align === "right" ? "text-left" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-ink font-bold text-sm">{exp.company}</h3>
            {exp.current && (
              <span className="chip text-[10px] py-0">Current</span>
            )}
          </div>
          <p className="text-accent text-sm font-medium mt-0.5">{exp.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-muted2 font-mono flex-wrap">
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          {exp.period}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={10} />
          {exp.location}
        </span>
      </div>

      {exp.description && exp.description.length > 0 && (
        <ul className="space-y-1 mb-3">
          {exp.description.slice(0, 2).map((d, i) => (
            <li key={i} className="text-xs text-muted flex gap-2">
              <span className="text-accent mt-0.5 flex-shrink-0">›</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      )}

      {exp.tags && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {exp.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
