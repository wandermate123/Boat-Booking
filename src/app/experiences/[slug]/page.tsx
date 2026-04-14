import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";
import { TourMapEmbeds } from "@/components/boating/TourMapEmbeds";
import { experiences, getExperienceBySlug } from "@/lib/experiences";
import { formatInr } from "@/lib/format";

const categoryLabel: Record<string, string> = {
  dawn: "Dawn",
  heritage: "Heritage",
  aarti: "Evening Aarti",
  private: "Private & bespoke",
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  if (!experience) {
    return { title: "Tour not found" };
  }
  return {
    title: `${experience.title} — Varanasi river cruise`,
    description: experience.tagline,
    openGraph: {
      title: experience.title,
      description: experience.tagline,
      images: [{ url: experience.imageSrc, alt: experience.imageAlt }],
    },
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);
  if (!experience) notFound();

  const kind = categoryLabel[experience.category] ?? experience.category;

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-24 pt-28 md:pt-32">
        <article>
          <header className="relative border-b border-border">
            <div className="relative mx-auto max-w-6xl px-5 md:px-8">
              <div className="relative aspect-[21/9] min-h-[200px] w-full overflow-hidden rounded-b-2xl md:aspect-[21/8] md:min-h-[280px]">
                <Image
                  src={experience.imageSrc}
                  alt={experience.imageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1200px) 1152px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/15" />
                <div className="absolute inset-x-0 bottom-0 p-6 pb-8 md:p-10 md:pb-12">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                    {kind}
                  </p>
                  <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                    {experience.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/85 md:text-lg">
                    {experience.tagline}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <nav
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="text-accent underline-offset-4 hover:underline"
              >
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link
                href="/#journeys"
                className="text-accent underline-offset-4 hover:underline"
              >
                Journeys
              </Link>
              <span aria-hidden>/</span>
              <span className="text-foreground/80">{experience.title}</span>
            </nav>

            <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:gap-16">
              <div className="min-w-0 flex-1 space-y-14">
                <section>
                  <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                    Overview
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                    {experience.longDescription}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                    About this tour
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/85">
                    {experience.aboutTour.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>

                <section className="grid gap-10 md:grid-cols-2">
                  <div>
                    <h2 className="font-serif text-xl font-semibold tracking-tight md:text-2xl">
                      What you&apos;ll see
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted md:text-base">
                      {experience.whatYouWillSee.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span
                            className="mt-2 h-px w-4 shrink-0 bg-accent/70"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold tracking-tight md:text-2xl">
                      What you&apos;ll experience
                    </h2>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted md:text-base">
                      {experience.whatYouWillExperience.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span
                            className="mt-2 h-px w-4 shrink-0 bg-accent/70"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <TourMapEmbeds
                  pickup={experience.mapPickup}
                  drop={experience.mapDrop}
                  zoom={experience.defaultMapZoom}
                />
              </div>

              <aside className="lg:w-80 xl:w-96 lg:shrink-0">
                <div className="sticky top-28 rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Basic details
                  </h2>
                  <dl className="mt-5 space-y-4 border-t border-border pt-5">
                    {experience.basicDetails.map((row) => (
                      <div key={row.label}>
                        <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-sm leading-snug text-foreground/90">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="font-serif text-2xl font-semibold tabular-nums">
                      From {formatInr(experience.priceFrom)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {experience.billingNote}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      href={`/book?e=${experience.id}`}
                      className="focus-ring inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-background transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.45)] active:scale-[0.99]"
                    >
                      Reserve this tour
                    </Link>
                    <a
                      href="#maps"
                      className="focus-ring inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-accent-dim"
                    >
                      Jump to map
                    </a>
                  </div>
                  <div className="mt-6 border-t border-border pt-6 text-sm text-muted">
                    <p className="font-medium text-foreground/80">Meet & end</p>
                    <p className="mt-2 leading-relaxed">{experience.pickupPoint}</p>
                    <p className="mt-2 leading-relaxed">{experience.dropPoint}</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
