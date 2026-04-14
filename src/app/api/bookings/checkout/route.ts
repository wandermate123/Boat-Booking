import { NextResponse } from "next/server";
import { sendBookingConfirmationIfNeeded } from "@/lib/booking-emails";
import { addOns, getExperienceById } from "@/lib/experiences";
import { prisma } from "@/lib/prisma";
import { computeBookingTotalRupees, rupeesToPaise } from "@/lib/pricing";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";

export type CheckoutBody = {
  experienceId: string;
  date: string;
  guests: number;
  slot: string;
  slotLabel: string;
  addOnIds: string[];
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  /** Client display total; must match server pricing. */
  estimatedTotal: number;
};

function referenceFromNow() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WM-${t}-${r}`;
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    experienceId,
    date,
    guests,
    slot,
    slotLabel,
    addOnIds,
    name,
    phone,
    email,
    notes,
    estimatedTotal,
  } = body;

  if (
    !experienceId ||
    !date ||
    typeof guests !== "number" ||
    guests < 1 ||
    !slot ||
    !String(name).trim() ||
    !String(phone).trim()
  ) {
    return NextResponse.json(
      { error: "Missing required booking fields" },
      { status: 400 },
    );
  }

  const experience = getExperienceById(experienceId);
  if (!experience) {
    return NextResponse.json({ error: "Unknown experience" }, { status: 400 });
  }

  const allowed = new Set(addOns.map((a) => a.id));
  const cleanAddOns = Array.from(new Set(addOnIds ?? [])).filter((id) =>
    allowed.has(id),
  );

  let amountRupees: number;
  try {
    amountRupees = computeBookingTotalRupees(experienceId, cleanAddOns);
  } catch {
    return NextResponse.json({ error: "Invalid pricing" }, { status: 400 });
  }

  if (
    typeof estimatedTotal !== "number" ||
    estimatedTotal !== amountRupees
  ) {
    return NextResponse.json(
      {
        error: "Price mismatch — please refresh the page and try again.",
        serverTotal: amountRupees,
      },
      { status: 400 },
    );
  }

  let amountPaise: number;
  try {
    amountPaise = rupeesToPaise(amountRupees);
  } catch {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const reference = referenceFromNow();
  const receipt =
    reference.length <= 40 ? reference : reference.slice(0, 40);

  const booking = await prisma.booking.create({
    data: {
      reference,
      status: "pending_payment",
      amountRupees,
      amountPaise,
      experienceId,
      journeyTitle: experience.title,
      date,
      guests,
      slot,
      slotLabel,
      addOnIdsJson: JSON.stringify(cleanAddOns),
      customerName: String(name).trim(),
      customerPhone: String(phone).trim(),
      customerEmail: email ? String(email).trim() : null,
      notes: notes ? String(notes).trim() : null,
    },
  });

  const receivedAt = booking.createdAt.toISOString();

  if (!isRazorpayConfigured()) {
    if (process.env.NODE_ENV === "production") {
      await prisma.booking.delete({ where: { id: booking.id } });
      return NextResponse.json(
        {
          error:
            "Payments are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        },
        { status: 503 },
      );
    }

    const paidAt = new Date();
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "paid",
        paidAt,
        razorpayPaymentId: "dev_no_gateway",
        razorpayOrderId: null,
      },
    });

    await sendBookingConfirmationIfNeeded(booking.id);

    return NextResponse.json({
      reference,
      receivedAt,
      journeyTitle: experience.title,
      date,
      guests,
      slotLabel,
      estimatedTotal: amountRupees,
      paidAt: paidAt.toISOString(),
      paymentId: "dev_no_gateway",
      devMode: true,
    });
  }

  try {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        reference: String(reference),
        journeyTitle: String(experience.title),
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      reference,
      receivedAt,
      journeyTitle: experience.title,
      date,
      guests,
      slotLabel,
      estimatedTotal: amountRupees,
      amountPaise,
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    await prisma.booking.delete({ where: { id: booking.id } }).catch(() => {});
    console.error("[checkout] Razorpay order failed", e);
    return NextResponse.json(
      { error: "Could not start payment. Try again in a moment." },
      { status: 502 },
    );
  }
}
