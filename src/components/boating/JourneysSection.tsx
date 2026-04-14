import { experiences } from "@/lib/experiences";
import { ExperienceCard } from "./ExperienceCard";

export function JourneysSection() {
  return (
    <section
      id="journeys"
      className="scroll-mt-24 border-t border-border bg-background px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Journeys
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Crafted cruises — not generic boat rides.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            As an aggregator, Wandermate matches you with licensed, reviewed
            partners. Every itinerary below can be tuned to your party — we
            handle coordination so you stay in the moment.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-2 xl:grid-cols-3 xl:gap-10">
          {experiences.map((e) => (
            <ExperienceCard key={e.id} experience={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
