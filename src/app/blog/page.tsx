import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";
import { getAllPostsMeta } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "River journal",
  description:
    "Guides and field notes on private Ganga cruises, dawn boats in Varanasi, ghats, and booking with confidence.",
  openGraph: {
    title: "River journal · Wandermate Varanasi",
    description:
      "Practical guides for boating on the Ganges — timing, etiquette, and what to expect.",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();
  const base = getSiteUrl();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Wandermate Varanasi — River journal",
    description:
      "Guides and stories about private river experiences, dawn cruises, and Varanasi ghats.",
    url: `${base}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Wandermate Varanasi",
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      url: `${base}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Journal
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            River field notes
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Short, practical articles for travellers planning time on the Ganges
            — booking, mornings on the water, and what good coordination looks
            like. <Link href="/rss" className="font-medium text-accent underline-offset-4 hover:underline">RSS feed</Link> for readers and tools.
          </p>
          <ul className="mt-14 space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-accent/30 md:p-8">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl -m-2 p-2"
                  >
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground group-hover:text-accent md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted">{post.description}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-accent">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      {post.updated && post.updated !== post.date ? (
                        <span className="text-muted normal-case">
                          {" "}
                          · updated{" "}
                          {new Date(post.updated).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).toLowerCase()}
                        </span>
                      ) : null}
                    </p>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
          <p className="mt-14 text-center text-sm text-muted">
            Plan a cruise:{" "}
            <Link
              href="/#journeys"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              Browse journeys
            </Link>{" "}
            ·{" "}
            <Link
              href="/book"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              Book
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
