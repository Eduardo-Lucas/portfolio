import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { getAllPosts } from "@/lib/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog – Eduardo Lucas",
  description: "Articles on Python, Django, data architecture, and enterprise software by Eduardo Lucas.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <AnimatedSection className="mb-16 text-center">
          <span className="chip mb-4 inline-block">Writing</span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            <span className="text-ink">The</span>{" "}
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted text-lg leading-relaxed">
            Thoughts on Python engineering, data architecture, enterprise systems,
            and 25+ years of lessons learned the hard way.
          </p>
        </AnimatedSection>

        {/* Featured post */}
        <AnimatedSection className="mb-10">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <article className="glass rounded-2xl p-8 md:p-10 hover:border-accent/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <span className="chip">Featured</span>
                <div className="flex items-center gap-2 text-xs text-muted2 font-mono">
                  <Calendar size={11} />
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted2 font-mono">
                  <Clock size={11} />
                  {featured.readTime}
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-ink mb-4 group-hover:text-accent transition-colors duration-200 leading-tight">
                {featured.title}
              </h2>
              <p className="text-muted leading-relaxed mb-6 max-w-3xl">{featured.excerpt}</p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded bg-surface2 text-muted border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={15} />
                </span>
              </div>
            </article>
          </Link>
        </AnimatedSection>

        {/* Article grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((post, i) => (
            <AnimatedSection key={post.slug} delay={i * 70}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="glass rounded-xl p-6 h-full flex flex-col hover:border-accent/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4 text-xs text-muted2 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} />
                      {post.readTime}
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-ink mb-2 group-hover:text-accent transition-colors duration-200 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-muted text-sm leading-relaxed flex-1 mb-4">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-surface2 text-muted border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-accent text-xs font-semibold mt-auto pt-3 border-t border-white/5">
                    Read more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </main>
  );
}
