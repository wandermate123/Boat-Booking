import { addOns, getExperienceById } from "@/lib/experiences";

/** Server-side total in whole INR (validated against client display). */
export function computeBookingTotalRupees(
  experienceId: string,
  addOnIds: string[],
): number {
  const experience = getExperienceById(experienceId);
  if (!experience) throw new Error("INVALID_EXPERIENCE");

  const allowed = new Set(addOns.map((a) => a.id));
  const clean = Array.from(new Set(addOnIds)).filter((id) => allowed.has(id));
  const addOnSum = addOns
    .filter((a) => clean.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  return experience.priceFrom + addOnSum;
}

export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees) || rupees < 1) {
    throw new Error("INVALID_AMOUNT");
  }
  return Math.round(rupees * 100);
}
