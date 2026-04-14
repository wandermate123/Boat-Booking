import { BlogTeaserSection } from "@/components/boating/BlogTeaserSection";
import { FaqSection } from "@/components/boating/FaqSection";
import { Hero } from "@/components/boating/Hero";
import { JourneysSection } from "@/components/boating/JourneysSection";
import { RiverStorySection } from "@/components/boating/RiverStorySection";
import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";
import { TrustSection } from "@/components/boating/TrustSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <JourneysSection />
        <RiverStorySection />
        <TrustSection />
        <BlogTeaserSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
