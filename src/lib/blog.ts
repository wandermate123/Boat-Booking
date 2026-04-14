import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  keywords?: string[];
  /** Path under public/ or absolute URL for og:image */
  ogImage?: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

function readPostFile(slug: string): string | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf8");
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.basename(f, ".md"));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const raw = readPostFile(slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  const title = data.title;
  const description = data.description;
  const date = data.date;
  if (typeof title !== "string" || typeof description !== "string" || typeof date !== "string") {
    return null;
  }
  return {
    slug,
    title,
    description,
    date,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    keywords: Array.isArray(data.keywords)
      ? data.keywords.filter((k): k is string => typeof k === "string")
      : undefined,
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    content,
  };
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const posts = getPostSlugs()
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      const { content: _c, ...meta } = post;
      return meta;
    })
    .filter(Boolean) as BlogPostMeta[];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getRecentPostsMeta(limit: number): BlogPostMeta[] {
  return getAllPostsMeta().slice(0, limit);
}
