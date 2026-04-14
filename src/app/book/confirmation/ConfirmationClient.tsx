"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiRoute } from "@/lib/api-route";

type LookupOk = {
  reference: string;
  journeyTitle: string;
  date: string;
  guests: number;
  slotLabel: string;
  amountPaidLabel: string;
  paymentId: string | null;
  paidAt: string | null;
  customerName: string;
  pickupPoint: string | null;
  dropPoint: string | null;
};

export function ConfirmationClient() {
  const searchParams = useSearchParams();
  const refDefault = searchParams.get("ref") ?? "";

  const [reference, setReference] = useState(refDefault);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LookupOk | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(apiRoute("/api/bookings/lookup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.trim(), phone: phone.trim() }),
      });
      const json = (await res.json()) as LookupOk & { error?: string };
      if (!res.ok) {
        setError(
          json.error === "Booking not found"
            ? "No paid booking matches those details. Check the reference and the phone number you used when booking."
            : "Could not load booking.",
        );
        return;
      }
      setData(json);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="space-y-4 rounded-2xl border border-border bg-surface p-6 md:p-8"
      >
        <label className="block">
          <span className="text-sm font-medium text-muted">Booking reference</span>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground"
            placeholder="e.g. WM-XXXXX-XXXX"
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-muted">Mobile number (same as on booking)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            className="focus-ring mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            placeholder="10-digit number"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading || !reference.trim() || !phone.trim()}
          className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-background disabled:opacity-40"
        >
          {loading ? "Loading…" : "Show confirmation"}
        </button>
      </form>

      {data ? (
        <div className="mt-10 rounded-2xl border border-accent/30 bg-accent-dim/40 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Confirmed booking
          </p>
          <p className="mt-2 font-serif text-2xl font-semibold">{data.journeyTitle}</p>
          <p className="mt-1 text-sm text-muted">Ref. {data.reference}</p>
          <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Guest</dt>
              <dd className="text-right font-medium">{data.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Date</dt>
              <dd className="font-medium">{data.date}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Time</dt>
              <dd className="max-w-[60%] text-right font-medium">{data.slotLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Guests</dt>
              <dd className="font-medium">{data.guests}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Amount paid</dt>
              <dd className="font-semibold text-accent">{data.amountPaidLabel}</dd>
            </div>
            {data.paymentId && data.paymentId !== "dev_no_gateway" ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Payment ID</dt>
                <dd className="max-w-[55%] break-all text-right font-mono text-xs">
                  {data.paymentId}
                </dd>
              </div>
            ) : null}
            {data.paidAt ? (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Paid at</dt>
                <dd className="text-right text-xs">
                  {new Date(data.paidAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
            ) : null}
          </dl>
          {data.pickupPoint && data.dropPoint ? (
            <div className="mt-6 border-t border-border pt-6 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">Pickup</p>
              <p className="mt-1 text-foreground/90">{data.pickupPoint}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">Drop</p>
              <p className="mt-1 text-foreground/90">{data.dropPoint}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="mt-10 text-center text-sm text-muted">
        <Link href="/book" className="text-accent hover:underline">
          New booking
        </Link>
        {" · "}
        <Link href="/" className="text-accent hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
