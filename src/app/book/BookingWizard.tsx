"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  addOns,
  bookingTimeOptions,
  experiences,
  getExperienceById,
  type AddOn,
} from "@/lib/experiences";
import { formatInr } from "@/lib/format";
import { PickupDropBlurb } from "@/components/boating/PickupDropBlurb";
import { apiRoute } from "@/lib/api-route";
import {
  buildBookingWhatsAppText,
  WA_BOOKING_NUMBER,
} from "@/lib/whatsapp";

const STEPS = [
  "Journey",
  "When & who",
  "Enhancements",
  "Your details",
  "Confirm",
] as const;

type StepIndex = 0 | 1 | 2 | 3 | 4;

type Confirmation = {
  reference: string;
  receivedAt: string;
  journeyTitle: string;
  date: string;
  guests: number;
  slotLabel: string;
  estimatedTotal: number;
  paidAt?: string;
  paymentId?: string;
};

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"));
      return;
    }
    if (window.Razorpay) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load payment script"));
    document.body.appendChild(s);
  });
}

export function BookingWizard() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("e") ?? undefined;
  const [step, setStep] = useState<StepIndex>(0);
  const [experienceId, setExperienceId] = useState<string | undefined>(
    () => getExperienceById(initialId)?.id,
  );
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [slot, setSlot] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const experience = useMemo(
    () => getExperienceById(experienceId),
    [experienceId],
  );

  const slotLabel =
    bookingTimeOptions.find((s) => s.value === slot)?.label ?? slot;

  const addOnTotal = useMemo(
    () =>
      addOns.reduce(
        (sum, a) => (selectedAddOns[a.id] ? sum + a.price : sum),
        0,
      ),
    [selectedAddOns],
  );

  const addOnIds = useMemo(
    () => addOns.filter((a) => selectedAddOns[a.id]).map((a) => a.id),
    [selectedAddOns],
  );

  const estimatedTotal = (experience?.priceFrom ?? 0) + addOnTotal;

  const canNext =
    step === 0
      ? Boolean(experienceId)
      : step === 1
        ? Boolean(date && guests >= 1 && slot)
        : step === 2
          ? true
          : step === 3
            ? Boolean(name.trim() && phone.trim())
            : true;

  function goNext() {
    if (!canNext || submitting) return;
    if (step < 4) setStep((s) => (s + 1) as StepIndex);
  }

  async function submitBooking() {
    if (!experience || !canNext || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(apiRoute("/api/bookings/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: experience.id,
          date,
          guests,
          slot,
          slotLabel,
          addOnIds,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          notes: notes.trim() || undefined,
          estimatedTotal,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        serverTotal?: number;
        devMode?: boolean;
        razorpayKeyId?: string;
        razorpayOrderId?: string;
        amountPaise?: number;
        paidAt?: string;
        paymentId?: string;
      } & Partial<Confirmation>;

      if (!res.ok) {
        const extra =
          data.serverTotal != null
            ? ` (correct total: ${formatInr(data.serverTotal)})`
            : "";
        throw new Error((data.error ?? "Checkout failed") + extra);
      }

      if (
        !data.reference ||
        !data.receivedAt ||
        !data.journeyTitle ||
        !data.date ||
        data.guests == null ||
        !data.slotLabel ||
        data.estimatedTotal == null
      ) {
        throw new Error("Invalid response from server");
      }

      if (data.devMode && data.paymentId && data.paidAt) {
        setConfirmation({
          reference: data.reference,
          receivedAt: data.receivedAt,
          journeyTitle: data.journeyTitle,
          date: data.date,
          guests: data.guests,
          slotLabel: data.slotLabel,
          estimatedTotal: data.estimatedTotal,
          paidAt: data.paidAt,
          paymentId: data.paymentId,
        });
        setDone(true);
        setSubmitting(false);
        return;
      }

      if (
        !data.razorpayKeyId ||
        !data.razorpayOrderId ||
        data.amountPaise == null
      ) {
        throw new Error("Payment could not be started");
      }

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        order_id: data.razorpayOrderId,
        amount: data.amountPaise,
        currency: "INR",
        name: "Wandermate Varanasi",
        description: data.journeyTitle,
        theme: { color: "#2563eb" },
        prefill: {
          name: name.trim(),
          email: email.trim() || undefined,
          contact: phone.trim(),
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(apiRoute("/api/payments/razorpay/verify"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: data.reference,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const v = (await verifyRes.json()) as {
              error?: string;
            } & Partial<Confirmation> & {
              paidAt?: string;
              paymentId?: string;
            };

            if (!verifyRes.ok) {
              setSubmitError(v.error ?? "Payment verification failed");
              setSubmitting(false);
              return;
            }

            if (
              !v.reference ||
              !v.receivedAt ||
              !v.journeyTitle ||
              v.guests == null ||
              !v.slotLabel ||
              v.estimatedTotal == null ||
              !v.paidAt ||
              !v.paymentId
            ) {
              setSubmitError("Invalid confirmation from server");
              setSubmitting(false);
              return;
            }

            setConfirmation({
              reference: v.reference,
              receivedAt: v.receivedAt,
              journeyTitle: v.journeyTitle,
              date: v.date!,
              guests: v.guests,
              slotLabel: v.slotLabel,
              estimatedTotal: v.estimatedTotal,
              paidAt: v.paidAt,
              paymentId: v.paymentId,
            });
            setDone(true);
          } catch {
            setSubmitError("Could not verify payment");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });

      rzp.open();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => (s - 1) as StepIndex);
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const waHref = useMemo(() => {
    if (!confirmation) return "";
    const text = buildBookingWhatsAppText({
      reference: confirmation.reference,
      journeyTitle: confirmation.journeyTitle,
      date: confirmation.date,
      guests: confirmation.guests,
      slotLabel: confirmation.slotLabel,
      estimatedTotalLabel: formatInr(confirmation.estimatedTotal),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    return `https://wa.me/${WA_BOOKING_NUMBER}?text=${text}`;
  }, [confirmation, name, phone, email, notes]);

  if (done && confirmation) {
    return (
      <>
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-accent/35 bg-accent-dim/80 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Payment successful
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">
              Your booking is confirmed.
            </h2>
            <ul className="mt-4 max-w-xl list-disc space-y-2 pl-5 text-sm text-muted">
              <li>
                <strong className="text-foreground/90">This screen</strong> is
                your receipt — save or screenshot it for your records.
              </li>
              <li>
                If you provided an email, you&apos;ll receive a confirmation
                message there once outbound email is enabled for this site.
              </li>
              <li>
                Wandermate sees every paid booking in the booking system and can
                receive team inbox alerts when those are configured.
              </li>
              <li>
                <Link
                  href={`/book/confirmation?ref=${encodeURIComponent(confirmation.reference)}`}
                  className="font-medium text-accent underline-offset-4 hover:underline"
                >
                  Look up this confirmation later
                </Link>{" "}
                using your reference and the mobile number you used when paying.
              </li>
            </ul>
            {confirmation.paymentId === "dev_no_gateway" ? (
              <p className="mt-3 max-w-xl rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted">
                Local dev: Razorpay keys are not set, so payment was skipped.
                Add <code className="text-foreground/90">RAZORPAY_KEY_ID</code>{" "}
                and <code className="text-foreground/90">RAZORPAY_KEY_SECRET</code>{" "}
                to test the real checkout.
              </p>
            ) : null}
            <div className="mt-8 rounded-xl border border-border bg-background/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Booking reference
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
                {confirmation.reference}
              </p>
              {confirmation.paymentId && confirmation.paymentId !== "dev_no_gateway" ? (
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">
                  Payment ID
                </p>
              ) : null}
              {confirmation.paymentId && confirmation.paymentId !== "dev_no_gateway" ? (
                <p className="mt-1 font-mono text-sm text-foreground">
                  {confirmation.paymentId}
                </p>
              ) : null}
              <p className="mt-4 text-sm text-muted">
                Booked{" "}
                {new Date(confirmation.receivedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {confirmation.paidAt ? (
                  <>
                    {" "}
                    · Paid{" "}
                    {new Date(confirmation.paidAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </>
                ) : null}
              </p>
            </div>
            <ul className="mt-8 space-y-3 border-t border-border pt-8 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-muted">Journey</span>
                <span className="text-right font-medium">
                  {confirmation.journeyTitle}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted">Date</span>
                <span className="text-right font-medium">{confirmation.date}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted">Guests</span>
                <span className="text-right font-medium">{confirmation.guests}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted">Timing</span>
                <span className="max-w-[60%] text-right font-medium">
                  {confirmation.slotLabel}
                </span>
              </li>
              <li className="flex justify-between gap-4 pt-2 text-base">
                <span className="text-muted">Amount paid</span>
                <span className="font-serif text-lg font-semibold text-accent">
                  {formatInr(confirmation.estimatedTotal)}
                </span>
              </li>
            </ul>

            <p className="mt-8 text-sm text-muted">
              Need help?{" "}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                Message concierge on WhatsApp
              </a>{" "}
              with your reference.
            </p>

            <p className="mt-8">
              <Link
                href="/"
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Back to river experiences
              </Link>
            </p>
          </div>
        </div>

        <aside className="mt-10 lg:col-span-5 lg:mt-0">
          <div className="sticky top-28 rounded-2xl border border-border bg-background/90 p-6 backdrop-blur-md md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              What happens next
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted">
              <li>
                We&apos;ll email or WhatsApp your ghat meet-point and arrival
                window using the contact you provided.
              </li>
              <li>
                Partner boats are assigned for your date and time; changes are
                rare and we&apos;ll notify you if anything shifts.
              </li>
              <li>
                Keep your reference and payment ID for your records.
              </li>
            </ol>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      <div className="lg:col-span-7">
        <div className="mb-8 flex gap-1 overflow-x-auto pb-2 md:flex-wrap">
          {STEPS.map((label, i) => {
            const active = i === step;
            const complete = i < step;
            return (
              <button
                key={label}
                type="button"
                disabled={i > step}
                onClick={() => {
                  if (i <= step) setStep(i as StepIndex);
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-accent text-background"
                    : complete
                      ? "bg-surface text-foreground ring-1 ring-border"
                      : "bg-transparent text-muted ring-1 ring-border/60"
                } `}
              >
                {i + 1}. {label}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_24px_64px_-40px_rgba(28,25,23,0.14)] md:p-10">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                  Which journey calls you?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  Each option includes a{" "}
                  <span className="text-foreground/90">sample boat visual</span> —
                  illustrative of the class we assign. Your partner may place you
                  on an equivalent licensed vessel.
                </p>
              </div>

              <div className="flex flex-col gap-8">
                <div className="w-full shrink-0 lg:max-w-lg">
                  {experience ? (
                    <figure className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_64px_-40px_rgba(28,25,23,0.16)]">
                      <div className="relative aspect-[16/10] w-full max-h-[320px] sm:aspect-[3/2] sm:max-h-[380px] lg:max-h-[400px]">
                        <Image
                          src={experience.imageSrc}
                          alt={experience.imageAlt}
                          fill
                          sizes="(min-width: 1280px) 380px, (min-width: 640px) 28rem, 100vw"
                          className="object-cover transition duration-500"
                          priority
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent"
                          aria-hidden
                        />
                        {experience.popular ? (
                          <span className="absolute right-3 top-3 rounded-full bg-accent/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-background">
                            Guest favourite
                          </span>
                        ) : null}
                        <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent">
                            Sample vessel
                          </p>
                          <p className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight">
                            {experience.title}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                            {experience.boatSampleCaption}
                          </p>
                          <PickupDropBlurb
                            pickupPoint={experience.pickupPoint}
                            dropPoint={experience.dropPoint}
                            dense
                            className="mt-3 border-t border-border/80 pt-3"
                          />
                          <p className="mt-3 border-t border-border/80 pt-3 text-xs text-muted">
                            {experience.capacity}
                          </p>
                        </figcaption>
                      </div>
                    </figure>
                  ) : (
                    <div className="flex aspect-[16/10] min-h-[200px] w-full max-h-[280px] flex-col justify-end rounded-2xl border border-dashed border-border bg-surface/50 p-6 sm:max-h-[320px]">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                        Preview
                      </p>
                      <p className="mt-3 font-serif text-xl font-semibold">
                        Choose a journey
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        Select a row below to load the sample boat and details.
                      </p>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <ul className="flex flex-col gap-3 sm:gap-3.5">
                    {experiences.map((e) => {
                      const selected = experienceId === e.id;
                      return (
                        <li key={e.id} className="min-w-0">
                          <button
                            type="button"
                            onClick={() => {
                              setExperienceId(e.id);
                              setSlot("");
                            }}
                            className={`group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border text-left transition-[border-color,box-shadow,background-color] sm:min-h-[7.75rem] sm:flex-row sm:items-stretch ${
                              selected
                                ? "border-accent/60 bg-accent-dim shadow-[0_0_0_1px_rgba(37,99,235,0.22)] ring-2 ring-inset ring-accent/25"
                                : "border-border bg-background/40 hover:border-accent/35 hover:bg-surface"
                            } `}
                          >
                            <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-background sm:aspect-auto sm:h-full sm:min-h-[7.75rem] sm:w-44 sm:self-stretch md:w-48">
                              <Image
                                src={e.imageSrc}
                                alt={e.imageAlt}
                                fill
                                sizes="(min-width: 640px) 176px, 100vw"
                                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                              />
                              <div
                                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent sm:bg-gradient-to-r"
                                aria-hidden
                              />
                              {e.popular ? (
                                <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent backdrop-blur-sm sm:left-2 sm:top-2">
                                  Top pick
                                </span>
                              ) : null}
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-4 sm:py-3 md:px-5">
                              <div className="flex min-w-0 items-start justify-between gap-2">
                                <p className="font-serif text-[1.05rem] font-semibold leading-snug tracking-tight sm:text-lg">
                                  {e.title}
                                </p>
                              </div>
                              <Link
                                href={`/experiences/${e.slug}`}
                                className="mt-1 inline-block text-xs font-semibold text-accent underline-offset-2 hover:underline"
                              >
                                Full tour page &amp; map
                              </Link>
                              <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-wide text-muted">
                                {e.duration}
                              </p>
                              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                                {e.boatSampleCaption}
                              </p>
                              <PickupDropBlurb
                                pickupPoint={e.pickupPoint}
                                dropPoint={e.dropPoint}
                                dense
                                className="mt-2 border-t border-border/50 pt-2"
                              />
                              <p className="mt-2 text-sm font-semibold tabular-nums text-accent sm:mt-auto sm:pt-2">
                                From {formatInr(e.priceFrom)}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                  When are you on the river?
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Choose your date, group size, and departure time.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 md:items-end">
                <label className="block md:min-w-0">
                  <span className="text-sm font-medium text-muted">Date</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
                  />
                </label>
                <label className="block md:min-w-0">
                  <span className="text-sm font-medium text-muted">Time</span>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="focus-ring mt-2 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-foreground bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat text-base [&>option]:bg-background [&>option]:text-foreground"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    }}
                    aria-label="Departure time"
                  >
                    <option value="">Select time</option>
                    {bookingTimeOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-muted">Guests</span>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="h-2 w-full max-w-md accent-accent"
                  />
                  <span className="min-w-[2rem] font-serif text-2xl font-semibold tabular-nums">
                    {guests}
                  </span>
                </div>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                Enhance your cruise
              </h2>
              <div className="space-y-3">
                {addOns.map((a: AddOn) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      selectedAddOns[a.id]
                        ? "border-accent/60 bg-accent-dim"
                        : "border-border hover:border-accent/35"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedAddOns[a.id])}
                      onChange={() => toggleAddOn(a.id)}
                      className="mt-1 accent-accent"
                    />
                    <span>
                      <span className="font-medium">{a.label}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {a.description} · {formatInr(a.price)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                How do we reach you?
              </h2>
              <label className="block">
                <span className="text-sm font-medium text-muted">Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-muted">
                  Mobile number
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
                />
                <span className="mt-1 block text-xs text-muted">
                  For SMS or call about this booking — not required to use
                  WhatsApp.
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-muted">
                  Email for confirmation (recommended)
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-muted">
                  Notes for concierge
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Dietary needs, surprise occasion, reduced mobility…"
                  className="focus-ring mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/70"
                />
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">
                Review & confirm
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between gap-4 border-b border-border py-2">
                  <span className="text-muted">Journey</span>
                  <span className="text-right font-medium">{experience?.title}</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-border py-2">
                  <span className="text-muted">Date</span>
                  <span className="text-right font-medium">{date}</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-border py-2">
                  <span className="text-muted">Guests</span>
                  <span className="text-right font-medium">{guests}</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-border py-2">
                  <span className="text-muted">Timing</span>
                  <span className="text-right font-medium">
                    {bookingTimeOptions.find((s) => s.value === slot)?.label}
                  </span>
                </li>
                <li className="flex justify-between gap-4 border-b border-border py-2">
                  <span className="text-muted">Add-ons</span>
                  <span className="text-right font-medium">
                    {addOnTotal ? formatInr(addOnTotal) : "—"}
                  </span>
                </li>
                <li className="flex justify-between gap-4 pt-2 text-base">
                  <span className="text-muted">Estimated from</span>
                  <span className="font-serif text-xl font-semibold text-accent">
                    {formatInr(estimatedTotal)}
                  </span>
                </li>
              </ul>
              <p className="text-xs leading-relaxed text-muted">
                The total below is what you pay now. Festival surcharges or
                upgrades, if any, are agreed with concierge before a separate
                charge.
              </p>
              {submitError ? (
                <p
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  {submitError}
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || submitting}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted transition-colors enabled:hover:border-accent/40 enabled:hover:text-foreground disabled:opacity-40"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canNext}
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-background transition-[transform,opacity] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submitBooking()}
                disabled={!canNext || submitting}
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-background transition-[transform,opacity] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Processing…" : "Pay & confirm"}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="mt-10 lg:col-span-5 lg:mt-0">
        <div className="sticky top-28 rounded-2xl border border-border bg-background/90 p-6 backdrop-blur-md md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Live summary
          </p>
          <h3 className="mt-3 font-serif text-2xl font-semibold">
            {experience?.title ?? "Your journey"}
          </h3>
          {experience ? (
            <p className="mt-2 text-sm text-muted">{experience.tagline}</p>
          ) : (
            <p className="mt-2 text-sm text-muted">Select a journey to begin.</p>
          )}
          {experience ? (
            <PickupDropBlurb
              pickupPoint={experience.pickupPoint}
              dropPoint={experience.dropPoint}
              className="mt-5 border-t border-border pt-5"
            />
          ) : null}
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Date</dt>
              <dd className="font-medium">{date || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Time</dt>
              <dd className="max-w-[55%] text-right font-medium">
                {slot ? slotLabel : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Guests</dt>
              <dd className="font-medium">{guests}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">From</dt>
              <dd className="font-serif text-lg font-semibold text-accent">
                {experience ? formatInr(estimatedTotal) : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-muted">
            Review your choices, then pay on the last step to confirm. Pricing
            is fixed from your selections before checkout opens.
          </p>
        </div>
      </aside>
    </>
  );
}
