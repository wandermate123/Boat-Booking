import Image from "next/image";
import Link from "next/link";
import type { Experience } from "@/lib/experiences";
import { formatInr } from "@/lib/format";
import { PickupDropBlurb } from "./PickupDropBlurb";

type Props = {
  experience: Experience;
};

export function ExperienceCard({ experience }: Props) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,transform] duration-500 hover:border-accent/35 md:hover:-translate-y-1">
      {experience.popular ? (
        <span className="absolute right-4 top-4 z-20 rounded-full bg-accent/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-background">
          Guest favourite
        </span>
      ) : null}
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={experience.imageSrc}
          alt={experience.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {experience.duration}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          <Link
            href={`/experiences/${experience.slug}`}
            className="transition-colors hover:text-accent"
          >
            {experience.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
          {experience.tagline}
        </p>
        <ul className="mt-5 space-y-2 text-sm text-foreground/80">
          {experience.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <PickupDropBlurb
          pickupPoint={experience.pickupPoint}
          dropPoint={experience.dropPoint}
          className="mt-5 border-t border-border pt-5"
        />
        <div className="mt-8 flex flex-1 flex-col justify-end gap-4 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold text-foreground">
              From {formatInr(experience.priceFrom)}
            </p>
            <p className="text-xs text-muted">{experience.billingNote}</p>
            <p className="mt-1 text-xs text-muted">{experience.capacity}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href={`/experiences/${experience.slug}`}
              className="focus-ring inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-accent-dim"
            >
              Tour details
            </Link>
            <Link
              href={`/book?e=${experience.id}`}
              className="focus-ring inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_8px_32px_-8px_rgba(37,99,235,0.45)] active:scale-[0.99]"
            >
              Reserve
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
