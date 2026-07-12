import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

// The System Design series is scheduled weekly through 2027-02-21, so a plain
// "newest first" sort currently surfaces those future-dated posts above ones
// that feel current. Sorting ascending keeps the reading order sane until
// real time catches up — flip this back to "desc" once it does.
const BLOG_SORT_ORDER: "asc" | "desc" = "asc";

function compareByDate(a: { date: string }, b: { date: string }): number {
  const ascending = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  return BLOG_SORT_ORDER === "asc" ? ascending : -ascending;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  mediumUrl?: string;
  html: string;
}

export interface BlogPostMeta extends Omit<BlogPost, "html"> {}

export interface SearchIndexEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^-{3,}$/gm, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return result.toString();
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      readTime: data.readTime as string,
      tags: data.tags as string[],
      mediumUrl: data.mediumUrl as string | undefined,
    };
  });

  return posts.sort(compareByDate);
}

export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      readTime: data.readTime as string,
      tags: data.tags as string[],
      content: markdownToPlainText(content),
    };
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = await markdownToHtml(content);

  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    date: data.date as string,
    readTime: data.readTime as string,
    tags: data.tags as string[],
    mediumUrl: data.mediumUrl as string | undefined,
    html,
  };
}
