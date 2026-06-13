import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { Calendar, Clock, ArrowLeft, Tag, ExternalLink } from "lucide-react";
import LinkedInIcon from "@/components/LinkedInIcon";
import GitHubIcon from "@/components/GitHubIcon";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

const BASE_URL = "https://www.eduardo-lucas-dev.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} – Eduardo Lucas`,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${BASE_URL}/blog/${slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Eduardo Lucas"],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2);
  const html = post.html;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: "Eduardo Lucas",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "Eduardo Lucas",
      url: BASE_URL,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    url: `${BASE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted hover:text-ink text-sm mb-10 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          All Articles
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-5 text-xs text-muted2 font-mono flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar size={11} />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock size={11} />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-ink leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-6">{post.excerpt}</p>

          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={12} className="text-muted2" />
            {post.tags.map((tag) => (
              <span key={tag} className="chip text-[10px]">{tag}</span>
            ))}
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-accent/40 via-violet/40 to-transparent" />
        </header>

        {/* Medium CTA */}
        {post.mediumUrl && (
          <div className="mb-8 glass rounded-xl p-5 flex items-center justify-between gap-4 border-l-2 border-accent/50">
            <p className="text-muted text-sm">Full article published on Medium.</p>
            <a
              href={post.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg font-semibold rounded text-sm hover:bg-accent-dim transition-colors flex-shrink-0"
            >
              Read on Medium <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Content */}
        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Author card */}
        <div className="mt-16 glass rounded-2xl p-7 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/30 to-violet/30 border border-white/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-black gradient-text">EL</span>
          </div>
          <div>
            <p className="text-ink font-bold">Eduardo Lucas</p>
            <p className="text-muted text-sm mt-0.5">
              Senior Python/Django Developer · Data Architect · 25+ years in enterprise IT
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://linkedin.com/in/eduardolucas40" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
                <LinkedInIcon size={12} />LinkedIn
              </a>
              <a href="https://github.com/Eduardo-Lucas" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
                <GitHubIcon size={12} />GitHub
              </a>
              <a href="mailto:eduardolucas40@gmail.com" className="text-xs text-accent hover:underline">Email</a>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-bold text-ink mb-5">More Articles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                  <div className="glass rounded-xl p-5 h-full hover:border-accent/20 transition-all duration-300">
                    <div className="text-xs text-muted2 font-mono mb-2 flex items-center gap-1.5">
                      <Clock size={10} />{p.readTime}
                    </div>
                    <h3 className="text-sm font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
