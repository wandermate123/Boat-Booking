import type { MapPin } from "@/lib/experiences";
import {
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
} from "@/lib/maps";

type Props = {
  pickup: MapPin;
  drop?: MapPin;
  zoom?: number;
};

export function TourMapEmbeds({ pickup, drop, zoom = 15 }: Props) {
  return (
    <section
      id="maps"
      className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 md:p-8"
    >
      <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
        Where you meet & finish
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
        Pins are approximate riverfront locations. Exact steps and partner
        boats are confirmed in your booking message.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Starting point
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {pickup.label}
          </p>
          <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <iframe
              title={`Map of ${pickup.label}`}
              src={googleMapsEmbedUrl(pickup, zoom)}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        {drop ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Drop-off
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              {drop.label}
            </p>
            <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              <iframe
                title={`Map of ${drop.label}`}
                src={googleMapsEmbedUrl(drop, zoom)}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        ) : null}
      </div>
      {drop ? (
        <p className="mt-6 text-center">
          <a
            href={googleMapsDirectionsUrl(pickup, drop)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center justify-center rounded-full border border-accent/40 bg-background px-5 py-2.5 text-sm font-semibold text-accent transition-[background-color,border-color] hover:border-accent hover:bg-accent-dim"
          >
            Open driving route between both pins
          </a>
        </p>
      ) : null}
    </section>
  );
}
