import type { Booking } from "@prisma/client";
import { Resend } from "resend";
import { getExperienceById } from "@/lib/experiences";
import { formatInr } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

function publicAppUrl(): string {
  return getSiteUrl();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bookingSummaryHtml(booking: Booking, extraTeamBlock: string): string {
  const exp = getExperienceById(booking.experienceId);
  const pickup = exp?.pickupPoint ?? "—";
  const drop = exp?.dropPoint ?? "—";
  const url = publicAppUrl();
  const confLink = `${url}/book/confirmation?ref=${encodeURIComponent(booking.reference)}`;
  const paid = booking.paidAt
    ? new Date(booking.paidAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return `
    <p>Hi ${escapeHtml(booking.customerName)},</p>
    <p>Your river cruise with <strong>Wandermate Varanasi</strong> is <strong>paid and confirmed</strong>.</p>
    <table style="border-collapse:collapse;margin:16px 0;font-size:14px;max-width:520px">
      <tr><td style="padding:6px 12px 6px 0;color:#666">Reference</td><td style="padding:6px 0"><strong>${escapeHtml(booking.reference)}</strong></td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Journey</td><td style="padding:6px 0">${escapeHtml(booking.journeyTitle)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Date</td><td style="padding:6px 0">${escapeHtml(booking.date)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Time</td><td style="padding:6px 0">${escapeHtml(booking.slotLabel)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Guests</td><td style="padding:6px 0">${booking.guests}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Amount paid</td><td style="padding:6px 0">${escapeHtml(formatInr(booking.amountRupees))}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Payment ID</td><td style="padding:6px 0;font-family:monospace">${escapeHtml(booking.razorpayPaymentId ?? "—")}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666">Paid at</td><td style="padding:6px 0">${escapeHtml(paid)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">Pickup</td><td style="padding:6px 0">${escapeHtml(pickup)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">Drop</td><td style="padding:6px 0">${escapeHtml(drop)}</td></tr>
    </table>
    <p><a href="${confLink}" style="color:#2563eb;font-weight:600">Open your confirmation page</a> (reference + phone required on that page).</p>
    <p style="color:#666;font-size:12px;margin-top:24px">We’ll follow up with final ghat meet-point details on WhatsApp or phone if needed.</p>
    ${extraTeamBlock}
  `;
}

/** Send guest + ops emails once per paid booking (idempotent via DB flag). */
export async function sendBookingConfirmationIfNeeded(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.status !== "paid" || booking.confirmationEmailSentAt) {
    return;
  }

  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.BOOKING_EMAIL_FROM?.trim();
  const teamEmail = process.env.BOOKING_TEAM_EMAIL?.trim();

  if (!key || !from) {
    console.info(
      "[booking-email] Optional: set RESEND_API_KEY + BOOKING_EMAIL_FROM (and BOOKING_TEAM_EMAIL) to email confirmations.",
    );
    return;
  }

  const resend = new Resend(key);
  const subject = `Confirmed: ${booking.journeyTitle} · ${booking.reference}`;

  const teamBlock =
    teamEmail != null
      ? `<p style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#666"><strong>Team copy</strong> — Phone: ${escapeHtml(booking.customerPhone)} · Notes: ${escapeHtml(booking.notes ?? "—")}</p>`
      : "";

  let delivered = false;

  try {
    if (booking.customerEmail) {
      await resend.emails.send({
        from,
        to: booking.customerEmail,
        subject,
        html: bookingSummaryHtml(booking, ""),
      });
      delivered = true;
    }

    if (teamEmail) {
      await resend.emails.send({
        from,
        to: teamEmail,
        subject: `[Wandermate] Paid · ${booking.reference} · ${booking.journeyTitle}`,
        html: bookingSummaryHtml(booking, teamBlock),
      });
      delivered = true;
    }

    if (delivered) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { confirmationEmailSentAt: new Date() },
      });
    }
  } catch (e) {
    console.error("[booking-email] send failed", e);
  }
}
