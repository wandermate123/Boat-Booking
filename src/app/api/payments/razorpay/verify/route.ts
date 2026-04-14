import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendBookingConfirmationIfNeeded } from "@/lib/booking-emails";
import { prisma } from "@/lib/prisma";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";

type VerifyBody = {
  reference: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export async function POST(req: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payment gateway not configured" },
      { status: 503 },
    );
  }

  let body: VerifyBody;
  try {
    body = (await req.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { reference, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    body;

  if (
    !reference ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { reference } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status === "paid" && booking.razorpayPaymentId) {
    return NextResponse.json({
      reference: booking.reference,
      receivedAt: booking.createdAt.toISOString(),
      paidAt: booking.paidAt!.toISOString(),
      paymentId: booking.razorpayPaymentId,
      journeyTitle: booking.journeyTitle,
      date: booking.date,
      guests: booking.guests,
      slotLabel: booking.slotLabel,
      estimatedTotal: booking.amountRupees,
    });
  }

  if (booking.status !== "pending_payment") {
    return NextResponse.json({ error: "Booking is not awaiting payment" }, { status: 400 });
  }

  if (booking.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(razorpay_signature, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const rzp = getRazorpay();
  const payment = await rzp.payments.fetch(razorpay_payment_id);

  if (payment.order_id !== razorpay_order_id) {
    return NextResponse.json({ error: "Payment order mismatch" }, { status: 400 });
  }

  if (typeof payment.amount === "number" && payment.amount !== booking.amountPaise) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  const ok =
    payment.status === "captured" || payment.status === "authorized";

  if (!ok) {
    return NextResponse.json(
      { error: `Payment not complete (status: ${payment.status})` },
      { status: 400 },
    );
  }

  const paidAt = new Date();
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      paidAt,
    },
  });

  await sendBookingConfirmationIfNeeded(booking.id);

  return NextResponse.json({
    reference: booking.reference,
    receivedAt: booking.createdAt.toISOString(),
    paidAt: paidAt.toISOString(),
    paymentId: razorpay_payment_id,
    journeyTitle: booking.journeyTitle,
    date: booking.date,
    guests: booking.guests,
    slotLabel: booking.slotLabel,
    estimatedTotal: booking.amountRupees,
  });
}
