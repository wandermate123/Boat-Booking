const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I book and pay?",
    answer:
      "Choose a journey and slot on the Book page, enter your details, and complete payment securely online. You’ll see a confirmation screen and can receive a confirmation email when those services are configured. For questions before you pay, use WhatsApp — we’re happy to help.",
  },
  {
    question: "Where do we meet the boat?",
    answer:
      "Each journey lists a default meet point (usually a named ghat). After booking, we confirm the exact steps and signage with you — often via WhatsApp — so you’re not guessing which boat is yours on a busy ghat.",
  },
  {
    question: "What if the weather or river conditions are bad?",
    answer:
      "Safety and comfort come first. If we need to postpone, we’ll contact you with reschedule options. Refunds and credits follow our published cancellation policy and what you confirmed at checkout.",
  },
  {
    question: "Can I change the date or cancel?",
    answer:
      "Message us as early as you can on WhatsApp or the email on your confirmation. Refund percentages, notice periods, and reschedules are set out in our cancellation policy (linked in the footer).",
  },
  {
    question: "How many guests fit on one boat?",
    answer:
      "Capacity is listed on each journey card (e.g. private boats for up to four). Larger parties may need multiple boats or a different itinerary — ask on WhatsApp and we’ll suggest what works.",
  },
  {
    question: "Are life jackets available?",
    answer:
      "Life jackets are available on request for adults and children where partners supply them. Rowers are licensed through Wandermate’s partner network — not ad‑hoc boats at the ghat.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-border bg-background px-5 py-24 md:px-8 md:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          FAQs
        </p>
        <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Before you step into the boat.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Quick answers about booking, meet points, and what to expect. Message
          us on WhatsApp anytime for anything not covered here.
        </p>
        <div className="mt-12 space-y-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-surface/50 transition-colors open:border-accent/30 open:bg-accent-dim/25"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-medium text-foreground md:p-6 [&::-webkit-details-marker]:hidden">
                <span className="pr-2">{item.question}</span>
                <span
                  className="shrink-0 rounded-full border border-border bg-background/80 px-2 py-0.5 text-xs font-semibold text-muted transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="border-t border-border/80 px-5 pb-5 pt-0 md:px-6 md:pb-6">
                <p className="pt-4 text-sm leading-relaxed text-muted md:text-base">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
