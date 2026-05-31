import Hero from "@/components/Hero";
import AnimatedSection from "@/components/AnimatedSection";
import LinkedInIcon from "@/components/LinkedInIcon";
import GitHubIcon from "@/components/GitHubIcon";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { skillGroups } from "@/data/skills";
import { experience } from "@/data/experience";
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react";

export default async function HomePage() {
  const featuredPosts = (await getAllPosts()).slice(0, 3);
  const currentRoles = experience.filter((e) => e.current);
  const recentExp = experience.slice(0, 4);

  return (
    <>
      <Hero />

      {/* What I Do */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="chip mb-4 inline-block">Expertise</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-ink">
              What I Build
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "Backend Systems",
                desc: "Scalable, production-grade APIs and services using Python, Django, FastAPI, and PostgreSQL. From microservices to monoliths done right.",
                tags: ["Python", "Django", "FastAPI", "PostgreSQL"],
              },
              {
                num: "02",
                title: "Data Architecture",
                desc: "End-to-end data pipelines, warehouse design, and governance strategies for enterprises that need traceability and compliance.",
                tags: ["Data Modeling", "PostgreSQL", "AWS", "Airflow"],
              },
              {
                num: "03",
                title: "ERP Modernisation",
                desc: "Replacing or wrapping legacy Oracle/SAP ERP systems with modern Python stacks — without losing 20 years of business logic.",
                tags: ["Oracle", "SAP", "Django", "Integration"],
              },
            ].map((item) => (
              <AnimatedSection key={item.num}>
                <div className="glass rounded-2xl p-7 h-full hover:border-accent/20 transition-all duration-300 group">
                  <div className="text-5xl font-black gradient-text mb-5 leading-none">{item.num}</div>
                  <h3 className="text-xl font-bold text-ink mb-3">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-5">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Skills strip */}
      <section className="py-16 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-10">
            <span className="chip mb-4 inline-block">Tech Stack</span>
            <h2 className="text-3xl font-black tracking-tighter text-ink">Core Skills</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {skillGroups.slice(0, 8).map((group, i) => (
              <AnimatedSection key={group.category} delay={i * 50}>
                <div className="glass rounded-lg p-4 border border-white/5 hover:border-accent/20 transition-colors">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{group.category}</p>
                  <p className="text-muted text-xs leading-relaxed">{group.skills.slice(0, 3).join(" · ")}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/about" className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-1">
              See full skill set <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Experience */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="chip mb-3 inline-block">Experience</span>
              <h2 className="text-4xl font-black tracking-tighter text-ink">Recent Roles</h2>
            </div>
            <Link href="/career" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
              Full timeline <ArrowRight size={13} />
            </Link>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5">
            {recentExp.map((exp, i) => (
              <AnimatedSection key={`${exp.company}-${i}`} delay={i * 60}>
                <div className="glass rounded-xl p-6 h-full hover:border-accent/20 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-ink font-bold text-sm">{exp.company}</h3>
                        {exp.current && <span className="chip text-[10px] py-0">Now</span>}
                      </div>
                      <p className="text-accent text-sm font-medium mt-0.5">{exp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted2 font-mono mb-4 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {exp.period}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {exp.location}</span>
                  </div>
                  {exp.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="chip mb-3 inline-block">Writing</span>
              <h2 className="text-4xl font-black tracking-tighter text-ink">Latest Articles</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
              All articles <ArrowRight size={13} />
            </Link>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {featuredPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 70}>
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="glass rounded-xl p-6 h-full flex flex-col hover:border-accent/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4 text-xs text-muted2 font-mono">
                      <div className="flex items-center gap-1.5"><Calendar size={10} />
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-1.5"><Clock size={10} /> {post.readTime}</div>
                    </div>
                    <h3 className="text-ink font-bold leading-snug mb-3 group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed flex-1 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-accent text-xs font-semibold mt-auto pt-3 border-t border-white/5">
                      Read <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="glass rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ background: "radial-gradient(ellipse at center, #00d4ff 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <span className="chip mb-5 inline-block">Open to Opportunities</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-ink mb-4">
                  Let&apos;s Build Something
                  <span className="gradient-text"> Together</span>
                </h2>
                <p className="text-muted max-w-lg mx-auto mb-8 leading-relaxed">
                  Senior Python engineering, data architecture, or technical leadership roles.
                  Remote-first, internationally experienced.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="mailto:eduardolucas40@gmail.com"
                    className="px-8 py-3.5 bg-accent text-bg font-semibold rounded hover:bg-accent-dim transition-colors inline-flex items-center gap-2"
                  >
                    Get In Touch <ArrowRight size={15} />
                  </a>
                  <a
                    href="https://linkedin.com/in/eduardolucas40"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 glass border border-white/10 text-ink font-semibold rounded hover:border-accent/40 hover:text-accent transition-all"
                  >
                    <LinkedInIcon size={16} />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Eduardo-Lucas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 glass border border-white/10 text-ink font-semibold rounded hover:border-accent/40 hover:text-accent transition-all"
                  >
                    <GitHubIcon size={16} />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
