const items = [
  {
    title: "Licensed partners",
    text: "Boats and rowers sourced through Wandermate standards — not anonymous listings.",
  },
  {
    title: "Transparent billing",
    text: "What you approve online aligns with partner quotes. Festival surcharges shown before you pay.",
  },
  {
    title: "Weather wisdom",
    text: "If the river turns, we reschedule or refund per policy — communicated plainly, not in fine print.",
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-border bg-surface/40 px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          The promise behind the booking.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border p-6">
              <h3 className="font-serif text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
