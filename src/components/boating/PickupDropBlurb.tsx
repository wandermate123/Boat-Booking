type Props = {
  pickupPoint: string;
  dropPoint: string;
  /** Tighter type for booking row cards and overlays */
  dense?: boolean;
  className?: string;
};

export function PickupDropBlurb({
  pickupPoint,
  dropPoint,
  dense = false,
  className = "",
}: Props) {
  const label = dense
    ? "text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-accent"
    : "text-xs font-semibold uppercase tracking-[0.2em] text-accent";
  const body = dense
    ? "text-[0.7rem] leading-snug text-foreground/90 sm:text-xs"
    : "text-sm leading-relaxed text-foreground/90";

  return (
    <div className={className}>
      <div className="space-y-1 sm:space-y-1.5">
        <p className={label}>Pickup</p>
        <p className={`${body} ${dense ? "line-clamp-2" : ""}`}>{pickupPoint}</p>
        <p className={`${label} ${dense ? "pt-1" : "pt-1.5"}`}>Drop</p>
        <p className={`${body} ${dense ? "line-clamp-2" : ""}`}>{dropPoint}</p>
      </div>
    </div>
  );
}
