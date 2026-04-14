import Link from "next/link";
import { getRecentPostsMeta } from "@/lib/blog";

export function BlogTeaserSection() {
  const posts = getRecentPostsMeta(3);
  if (posts.length === 0) return null;

  return (
    <section
      id="journal"
      className="scroll-mt-24 border-t border-border bg-surface/30 px-5 py-24 md:px-8 md:py-28"
      aria-labelledby="journal-teaser-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              Journal
            </p>
            <h2
              id="journal-teaser-heading"
              className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl"
            >
              Field notes from the Ganges
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Plain-language guides on booking, dawn cruises, and ghats —
              written for search and for guests who want context before they
              commit.
            </p>
          </div>
          <Link
            href="/blog"
            className="focus-ring shrink-0 rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-accent-dim md:self-start"
          >
            All articles
          </Link>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-background/80 p-6 md:p-7">
                <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {post.description}
                </p>
                <p className="mt-4 text-xs font-medium text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
