import { NextResponse } from "next/server";
import { getExperienceById } from "@/lib/experiences";
import { formatInr } from "@/lib/format";
import { phonesMatchLast10 } from "@/lib/phone";
import { prisma } from "@/lib/prisma";

type Body = { reference?: string; phone?: string };

/**
 * POST-only: returns paid booking summary if reference + phone (last 10 digits) match.
 * Generic 404 avoids leaking whether a reference exists.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const reference = String(body.reference ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!reference || !phone) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { reference } });
  if (!booking || booking.status !== "paid") {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (!phonesMatchLast10(booking.customerPhone, phone)) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const exp = getExperienceById(booking.experienceId);

  return NextResponse.json({
    reference: booking.reference,
    journeyTitle: booking.journeyTitle,
    date: booking.date,
    guests: booking.guests,
    slotLabel: booking.slotLabel,
    amountRupees: booking.amountRupees,
    amountPaidLabel: formatInr(booking.amountRupees),
    paymentId: booking.razorpayPaymentId,
    paidAt: booking.paidAt?.toISOString() ?? null,
    customerName: booking.customerName,
    pickupPoint: exp?.pickupPoint ?? null,
    dropPoint: exp?.dropPoint ?? null,
  });
}
