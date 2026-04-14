import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1704872833058-1948ac9230c1?w=1920&q=85"
        alt="Many wooden boats moored along the Ganges at Varanasi"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/65 to-background"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/35 to-transparent md:from-background/92 md:via-background/25" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:pb-0 md:pt-20 md:pl-8">
        <p className="mb-4 max-w-xl font-sans text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          Wandermate · River desk
        </p>
        <h1 className="max-w-[14ch] font-serif text-5xl leading-[0.95] font-semibold tracking-tight text-foreground md:max-w-[12ch] md:text-7xl lg:text-8xl">
          The Ganges,{" "}
          <span className="text-accent italic">reserved</span> for you.
        </h1>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-foreground/85 md:text-xl">
          Curated boat journeys across Varanasi — from the quiet before sunrise
          to the crescendo of Aarti. One booking flow. Vetted partners. No
          surprises at the ghat.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/book"
            className="focus-ring inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-center text-sm font-semibold text-background transition-[transform,background-color] hover:bg-foreground/90 active:scale-[0.99]"
          >
            Start your reservation
          </Link>
          <Link
            href="/#journeys"
            className="focus-ring inline-flex items-center justify-center rounded-full border border-border bg-surface px-8 py-4 text-center text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:bg-accent-dim"
          >
            Explore journeys
          </Link>
        </div>
        <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8 text-left md:max-w-2xl">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              Partners
            </dt>
            <dd className="mt-1 font-serif text-2xl text-foreground">Vetted</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              Meet
            </dt>
            <dd className="mt-1 font-serif text-2xl text-foreground">
              Your ghat
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted">
              Support
            </dt>
            <dd className="mt-1 font-serif text-2xl text-foreground">
              WhatsApp
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
