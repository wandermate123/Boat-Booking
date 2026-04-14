const stages = [
  {
    title: "Arrive",
    body: "We pin the exact ghat, walking time, and who greets you — no guessing in the dark or the crowd.",
  },
  {
    title: "Cruise",
    body: "Hand‑rowed quiet or ceremonial spectacle — your boat class and pacing follow the spirit of the journey you chose.",
  },
  {
    title: "Return",
    body: "Disembark with clarity: what you paid, what was included, and a direct line if the night shifts plans.",
  },
];

export function RiverStorySection() {
  return (
    <section
      id="ritual"
      className="scroll-mt-24 border-t border-border px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
              How Wandermate hosts
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              Three beats. One calm thread through the chaos.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Luxury here is timing, tone, and trust — the river is ancient;
              your experience should feel impeccably modern.
            </p>
          </div>
          <ol className="space-y-10 lg:col-span-7 lg:space-y-12">
            {stages.map((stage, i) => (
              <li
                key={stage.title}
                className="relative border-l border-border pl-8 md:pl-10"
              >
                <span className="absolute -left-1.5 top-2 flex h-3 w-3 items-center justify-center rounded-full bg-accent shadow-[0_0_0_4px_var(--background)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold md:text-3xl">
                  {stage.title}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                  {stage.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
