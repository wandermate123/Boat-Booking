import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostBody } from "@/components/boating/BlogPostBody";
import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";
import { getAllPostsMeta, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post" };

  const base = getSiteUrl();
  const canonical = `${base}/blog/${post.slug}`;
  const ogImage =
    post.ogImage != null
      ? post.ogImage.startsWith("http")
        ? post.ogImage
        : new URL(post.ogImage, base).toString()
      : undefined;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      url: canonical,
      ...(ogImage ? { images: [{ url: ogImage, alt: post.title }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const base = getSiteUrl();
  const canonical = `${base}/blog/${post.slug}`;
  const modified = post.updated ?? post.date;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: modified,
    author: {
      "@type": "Organization",
      name: "Wandermate Varanasi",
    },
    publisher: {
      "@type": "Organization",
      name: "Wandermate Varanasi",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    ...(post.ogImage
      ? {
          image:
            post.ogImage.startsWith("http")
              ? post.ogImage
              : new URL(post.ogImage, base).toString(),
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "River journal",
        item: `${base}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonical,
      },
    ],
  };

  const related = getAllPostsMeta()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <article className="mx-auto max-w-3xl">
          <nav
            className="text-sm text-muted"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Journal
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="truncate text-foreground">{post.title}</li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            River journal
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
          <p className="mt-4 text-sm text-muted">
            <time dateTime={post.date}>Published {new Date(post.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</time>
            {post.updated && post.updated !== post.date ? (
              <>
                {" "}
                ·{" "}
                <time dateTime={post.updated}>
                  Updated {new Date(post.updated).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </time>
              </>
            ) : null}
          </p>
          <div className="mt-12 max-w-none">
            <BlogPostBody content={post.content} />
          </div>
          {related.length > 0 ? (
            <aside className="mt-16 border-t border-border pt-10">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                More from the journal
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
