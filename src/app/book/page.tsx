import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";
import { BookingWizard } from "./BookingWizard";

export const metadata: Metadata = {
  title: "Book a cruise",
};

function WizardFallback() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-border bg-surface p-10">
      <div className="h-8 w-48 rounded bg-border" />
      <div className="mt-8 h-64 rounded-xl bg-border/60" />
      <div className="mt-6 h-12 w-full rounded-full bg-border/40" />
    </div>
  );
}

export default function BookPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Reservation
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            A few calm steps — then the river takes the lead.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Complete everything here: choose your cruise, pay securely online,
            and receive an instant confirmation with reference and payment
            details. Support is available on WhatsApp if you need help after
            booking.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-6xl lg:grid lg:grid-cols-12 lg:gap-12">
          <Suspense fallback={<WizardFallback />}>
            <BookingWizard />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
