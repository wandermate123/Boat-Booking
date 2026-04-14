import type { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/blog";
import { experiences } from "@/lib/experiences";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = [
    "",
    "/blog",
    "/book",
    "/book/confirmation",
    "/terms",
    "/cancellation-policy",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path, i) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : i === 1 ? 0.85 : 0.75,
  }));

  for (const e of experiences) {
    entries.push({
      url: `${base}/experiences/${e.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const post of getAllPostsMeta()) {
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
