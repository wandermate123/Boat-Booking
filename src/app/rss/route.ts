import { getAllPostsMeta } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

function cdata(s: string) {
  return s.replaceAll("]]>", "]]]]><![CDATA[>");
}

export async function GET() {
  const base = getSiteUrl();
  const posts = getAllPostsMeta();

  const items = posts
    .map((p) => {
      const link = `${base}/blog/${p.slug}`;
      const pubDate = new Date(p.date).toUTCString();
      return `
    <item>
      <title><![CDATA[${cdata(p.title)}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${cdata(p.description)}]]></description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${cdata("Wandermate Varanasi — River journal")}]]></title>
    <link>${base}/blog</link>
    <description><![CDATA[${cdata("Guides and stories from the Ganges in Varanasi.")}]]></description>
    <language>en</language>
    <atom:link href="${base}/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
