import Link from "next/link";
import { WA_BOOKING_NUMBER } from "@/lib/whatsapp";

export function SiteHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 border-b border-border/80 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[4.5rem] md:px-8">
        <Link
          href="/"
          className="group flex items-baseline gap-2 text-foreground transition-colors hover:text-accent"
        >
          <span className="font-serif text-xl font-semibold tracking-tight md:text-2xl">
            Wandermate
          </span>
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-muted md:text-xs">
            Varanasi
          </span>
        </Link>
        <nav
          className="flex items-center gap-6 text-sm font-medium text-muted"
          aria-label="Primary"
        >
          <Link
            href="/#journeys"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            Journeys
          </Link>
          <Link
            href="/#ritual"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            The river
          </Link>
          <Link
            href="/#faq"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            FAQs
          </Link>
          <Link
            href="/blog"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            Journal
          </Link>
          <Link
            href={`https://wa.me/${WA_BOOKING_NUMBER}`}
            className="hidden transition-colors hover:text-foreground lg:inline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Concierge
          </Link>
          <Link
            href="/book"
            className="focus-ring rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-[0_0_0_1px_rgba(37,99,235,0.35)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_12px_40px_-12px_rgba(37,99,235,0.45)] active:scale-[0.99]"
          >
            Book
          </Link>
        </nav>
      </div>
    </header>
  );
}
