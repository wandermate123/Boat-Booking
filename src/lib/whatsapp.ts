/** WhatsApp click-to-chat (secondary booking channel). Replace with your business number. */

export const WA_BOOKING_NUMBER = "919999999999";

const supportPrefillMessage =
  "Hi Wandermate — I need help with a river booking or have a question.";

/** wa.me link for general support (floating button, etc.). */
export function getWhatsAppSupportHref(): string {
  return `https://wa.me/${WA_BOOKING_NUMBER}?text=${encodeURIComponent(supportPrefillMessage)}`;
}

export function buildBookingWhatsAppText(params: {
  reference: string;
  journeyTitle: string;
  date: string;
  guests: number;
  slotLabel: string;
  estimatedTotalLabel: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}) {
  const lines = [
    `Hi Wandermate — I booked on the website.`,
    `Reference: ${params.reference}`,
    `Journey: ${params.journeyTitle}`,
    `Date: ${params.date}`,
    `Guests: ${params.guests}`,
    `Timing: ${params.slotLabel}`,
    `Estimate: ${params.estimatedTotalLabel}`,
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
    params.email ? `Email: ${params.email}` : null,
    params.notes ? `Notes: ${params.notes}` : null,
  ].filter(Boolean);
  return encodeURIComponent(lines.join("\n"));
}
