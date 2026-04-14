import type { Metadata } from "next";
import {
  LegalList,
  LegalPage,
  LegalSection,
} from "@/components/boating/LegalPage";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description:
    "Terms of use for Wandermate Varanasi river cruise bookings and website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & conditions">
      <p className="text-sm text-muted">
        Last updated:{" "}
        <time dateTime="2026-03-27">27 March 2026</time>. Wandermate Varanasi
        (“Wandermate”, “we”, “us”) operates this booking experience. By using
        this website or completing a booking, you agree to these terms.
      </p>

      <LegalSection heading="1. Who we are and what we provide">
        <p>
          Wandermate curates and coordinates river experiences in Varanasi with
          vetted boat partners. We may act as an intermediary: the service on the
          water is performed by independent partners who meet our standards.
          Your contract for the cruise arises between you and Wandermate for
          coordination and payment as described at checkout, and between you
          and the operating partner for the on-river service, as communicated in
          your confirmation.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility and accurate information">
        <p>
          You must be legally able to enter a binding contract in India (e.g.
          18+ where applicable). You agree that all details you provide — name,
          contact, party size, date and time — are accurate. Incorrect
          information may result in forfeiture of the booking or extra charges.
        </p>
      </LegalSection>

      <LegalSection heading="3. Booking and payment">
        <p>
          A booking is confirmed only after successful online payment (or other
          method we expressly accept) and issuance of a booking reference. Prices
          are shown in Indian Rupees unless stated otherwise and include or
          exclude taxes as indicated at checkout. Festival, peak, or partner
          surcharges may apply and will be displayed before you pay.
        </p>
        <p>
          Payment processing is handled by secure third-party providers. You
          authorise us to charge the selected amount for the itinerary and any
          add-ons you select.
        </p>
      </LegalSection>

      <LegalSection heading="4. Meet points, timing, and changes">
        <p>
          Meeting locations and times are described on journey pages and in your
          confirmation. You are responsible for arriving on time at the agreed
          ghat. Late arrival may shorten the experience or be treated as a
          no-show per our cancellation policy.
        </p>
        <p>
          We may adjust meet points or routing for safety, river conditions, or
          local regulations. We will communicate material changes to you using
          the contact details you provided.
        </p>
      </LegalSection>

      <LegalSection heading="5. Guest conduct and safety">
        <LegalList
          items={[
            "Follow instructions from your host, boat operator, and local authorities.",
            "Wear life jackets when offered or required. Do not exceed stated boat capacity.",
            "Avoid behaviour that endangers people, wildlife, or property, or disrespects local customs at ghats and on the water.",
            "Alcohol, littering, or unsafe activities may result in immediate termination without refund.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="6. Weather, force majeure, and partner failure">
        <p>
          River levels, visibility, government orders, festivals, strikes, or
          other events beyond our reasonable control may require postponement
          or cancellation. Where that happens, we will offer rescheduling or
          refunds as set out in our{" "}
          <a
            href="/cancellation-policy"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            cancellation policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="7. Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law: (a) our total
          liability for any claim arising from your booking is limited to the
          amount you paid us for that booking; (b) we are not liable for
          indirect, consequential, or punitive damages; (c) we are not
          responsible for loss or damage to personal belongings you bring on
          board.
        </p>
        <p>
          Nothing in these terms excludes or limits liability that cannot
          legally be excluded or limited.
        </p>
      </LegalSection>

      <LegalSection heading="8. Photography and publicity">
        <p>
          Partners or hosts may take photos for safety or operations. Unless you
          object on the day, incidental images of group experiences may be used
          in marketing where permitted by law. Contact us if you require
          privacy.
        </p>
      </LegalSection>

      <LegalSection heading="9. Website and intellectual property">
        <p>
          Content on this site (text, layout, branding) is owned by Wandermate
          or its licensors. You may not copy, scrape, or reuse it for
          commercial purposes without permission.
        </p>
      </LegalSection>

      <LegalSection heading="10. Governing law and disputes">
        <p>
          These terms are governed by the laws of India. Courts at Varanasi,
          Uttar Pradesh, shall have exclusive jurisdiction, subject to any
          mandatory consumer protections that apply to you.
        </p>
      </LegalSection>

      <LegalSection heading="11. Changes to these terms">
        <p>
          We may update this page from time to time. The “Last updated” date will
          change accordingly. Material changes may also be communicated by
          email or notice on the site where appropriate.
        </p>
      </LegalSection>

      <LegalSection heading="12. Contact">
        <p>
          For questions about these terms: use the WhatsApp concierge linked on
          this site or the contact details provided in your confirmation
          correspondence.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
