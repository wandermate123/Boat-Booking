/** Last 10 digits for India-style matching. */
export function phoneDigitsLast10(value: string): string {
  const d = value.replace(/\D/g, "");
  return d.slice(-10);
}

export function phonesMatchLast10(a: string, b: string): boolean {
  const da = phoneDigitsLast10(a);
  const db = phoneDigitsLast10(b);
  if (db.length < 10 || da.length < 10) return false;
  return da === db;
}
