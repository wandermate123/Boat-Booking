import type { MapPin } from "@/lib/experiences";

/** Google Maps embed without API key (search / center on coordinates). */
export function googleMapsEmbedUrl(
  pin: MapPin,
  zoom: number = 16,
): string {
  const q = `${pin.lat},${pin.lng}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed&hl=en`;
}

export function googleMapsDirectionsUrl(from: MapPin, to: MapPin): string {
  return `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;
}
