import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";
import { ConfirmationClient } from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "Confirmation lookup",
  description: "Retrieve your paid Wandermate Varanasi cruise confirmation.",
};

export default function ConfirmationPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            After booking
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Confirmation lookup
          </h1>
          <p className="mt-3 text-muted">
            Enter the booking reference from your success screen or email, and
            the mobile number you used when paying. We only show paid bookings.
          </p>
          <Suspense
            fallback={
              <div className="mt-10 h-48 animate-pulse rounded-2xl border border-border bg-surface" />
            }
          >
            <ConfirmationClient />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
