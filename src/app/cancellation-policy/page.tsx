import type { Metadata } from "next";
import {
  LegalList,
  LegalPage,
  LegalSection,
} from "@/components/boating/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation policy",
  description:
    "How to change or cancel a Wandermate Varanasi river booking, refunds, and weather rules.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage title="Cancellation policy">
      <p className="text-sm text-muted">
        Last updated:{" "}
        <time dateTime="2026-03-27">27 March 2026</time>. These rules apply to
        bookings made through this website for Wandermate Varanasi experiences
        unless a different policy was explicitly stated at checkout for a
        specific offer.
      </p>

      <LegalSection heading="1. How to request a change or cancellation">
        <p>
          Email or message us using the contact details or WhatsApp link in your
          confirmation. Include your booking reference, name, and mobile number
          so we can verify the reservation.
        </p>
      </LegalSection>

      <LegalSection heading="2. Guest-initiated cancellation (standard journeys)">
        <p>
          The timelines below are measured from the{" "}
          <strong className="text-foreground">scheduled meet time</strong> on
          the day of your cruise.
        </p>
        <LegalList
          items={[
            "More than 48 hours before meet time: full refund of the amount paid for the cruise (excluding any non-refundable payment-processing fees retained by payment providers, where applicable).",
            "Between 24 and 48 hours before meet time: 50% refund, or one reschedule to a mutually available date within 90 days (your choice).",
            "Less than 24 hours before meet time, or no-show without notice: no refund. A discretionary partial credit may be offered for genuine emergencies, assessed case by case.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. Rescheduling">
        <p>
          One complimentary reschedule is included when you request it at least
          48 hours before meet time, subject to availability. Further changes
          may incur a service fee. Reschedules requested inside 48 hours are
          treated as cancellations under section 2 unless we confirm otherwise
          in writing.
        </p>
      </LegalSection>

      <LegalSection heading="4. Weather, river conditions, and safety">
        <p>
          If we cancel because the river or weather makes the trip unsafe or
          impractical, you may choose a full refund or a reschedule without
          penalty. If you cancel solely due to personal preference while
          conditions remain operable, section 2 applies.
        </p>
      </LegalSection>

      <LegalSection heading="5. Changes or cancellations by Wandermate">
        <p>
          Rarely, we may need to cancel due to partner unavailability, regulatory
          restrictions, or events beyond our control. If we cancel, you receive
          a full refund or an alternative date — your choice. We are not liable
          for third-party costs (hotels, trains) beyond the cruise fare.
        </p>
      </LegalSection>

      <LegalSection heading="6. Add-ons and third-party services">
        <p>
          Optional add-ons (guides, offerings kits, extended time) follow the
          same cancellation window as the main booking unless stated otherwise
          at purchase. Third-party services arranged at your request may follow
          separate supplier rules; we will tell you when that applies.
        </p>
      </LegalSection>

      <LegalSection heading="7. Refund processing">
        <p>
          Approved refunds are initiated to the original payment method where
          possible. Banks and payment providers typically settle in 5–14
          business days; timings are outside our control.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disputes">
        <p>
          If you disagree with how a cancellation was handled, contact us first
          with your reference. For broader terms of service, see our{" "}
          <a
            href="/terms"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            terms &amp; conditions
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
