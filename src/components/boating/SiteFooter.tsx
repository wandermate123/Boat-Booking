import Link from "next/link";
import { WA_BOOKING_NUMBER } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-16 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-serif text-2xl font-semibold">Wandermate</p>
          <p className="mt-1 text-sm text-muted">Varanasi · River experiences</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            This microsite integrates with your main Wandermate property — keep
            navigation and brand tokens aligned for a single, premium journey.
          </p>
        </div>
        <div className="flex flex-wrap gap-10 text-sm">
          <div>
            <p className="font-semibold text-foreground">Experience</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <Link href="/#journeys" className="hover:text-foreground">
                  Journeys
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-foreground">
                  Book
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Journal
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Wandermate</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground"
                  aria-current="page"
                >
                  Varanasi hub
                </Link>
              </li>
              <li>
                <Link
                  href={`https://wa.me/${WA_BOOKING_NUMBER}`}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp concierge
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground">Legal</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms &amp; conditions
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-foreground">
                  Cancellation policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-6xl text-center text-xs text-muted">
        © {new Date().getFullYear()} Wandermate Varanasi. Images via Unsplash —
        replace with your own photography for launch.
      </p>
    </footer>
  );
}
