"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import PostCard from "@/components/PostCard";

interface SearchIndexEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

interface Props {
  children: ReactNode;
}

export default function BlogSearch({ children }: Props) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  const isSearching = query.trim().length > 0;

  useEffect(() => {
    if (!isSearching || index !== null || loading) return;
    setLoading(true);
    fetch("/api/search")
      .then((res) => res.json())
      .then((data: SearchIndexEntry[]) => setIndex(data))
      .finally(() => setLoading(false));
  }, [isSearching, index, loading]);

  const results = useMemo(() => {
    if (!isSearching || !index) return [];

    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return index
      .map((post) => {
        const title = post.title.toLowerCase();
        const tags = post.tags.join(" ").toLowerCase();
        const excerpt = post.excerpt.toLowerCase();
        const content = post.content.toLowerCase();

        const matchesEveryTerm = terms.every(
          (term) => title.includes(term) || tags.includes(term) || excerpt.includes(term) || content.includes(term)
        );
        if (!matchesEveryTerm) return null;

        const score = terms.reduce((total, term) => {
          if (title.includes(term)) total += 4;
          if (tags.includes(term)) total += 3;
          if (excerpt.includes(term)) total += 2;
          if (content.includes(term)) total += 1;
          return total;
        }, 0);

        return { post, score };
      })
      .filter((entry): entry is { post: SearchIndexEntry; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((entry) => entry.post);
  }, [query, index, isSearching]);

  return (
    <div>
      <div className="relative max-w-xl mx-auto mb-12">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles by keyword or topic…"
          aria-label="Search articles"
          className="w-full glass rounded-xl pl-11 pr-10 py-3 text-sm text-ink placeholder:text-muted2 focus:outline-none focus:border-accent/40 border border-white/5 transition-colors"
        />
        {isSearching && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted2 hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!isSearching && children}

      {isSearching && loading && <p className="text-center text-muted text-sm">Searching…</p>}

      {isSearching && !loading && (
        <div>
          <p className="text-center text-muted text-sm mb-8">
            {results.length > 0
              ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query.trim()}"`
              : `No results for "${query.trim()}"`}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                tags={post.tags}
                date={post.date}
                readTime={post.readTime}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
