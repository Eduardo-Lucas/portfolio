import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
}

export default function PostCard({ slug, title, excerpt, tags, date, readTime }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article className="glass rounded-xl p-6 h-full flex flex-col hover:border-accent/20 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4 text-xs text-muted2 font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar size={10} />
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            {readTime}
          </div>
        </div>

        <h2 className="text-lg font-bold text-ink mb-2 group-hover:text-accent transition-colors duration-200 leading-snug">
          {title}
        </h2>
        <p className="text-muted text-sm leading-relaxed flex-1 mb-4">{excerpt}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag) => (
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
  );
}
