export type ExperienceCategory = "dawn" | "heritage" | "aarti" | "private";

export type MapPin = {
  lat: number;
  lng: number;
  label: string;
};

export type Experience = {
  id: string;
  /** URL segment (`/experiences/[id]`). */
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  capacity: string;
  priceFrom: number;
  currency: "INR";
  billingNote: string;
  highlights: string[];
  category: ExperienceCategory;
  imageSrc: string;
  imageAlt: string;
  /** Shown in booking step 1 — illustrative; partner assigns actual vessel. */
  boatSampleCaption: string;
  /** Default meet & end points for live summary (confirm with concierge if needed). */
  pickupPoint: string;
  dropPoint: string;
  popular?: boolean;
  /** One or two paragraphs for the detail hero / overview. */
  longDescription: string;
  /** Sections on the detail page. */
  aboutTour: string[];
  whatYouWillSee: string[];
  whatYouWillExperience: string[];
  /** Key facts grid — duration, group size, language, inclusions, etc. */
  basicDetails: { label: string; value: string }[];
  mapPickup: MapPin;
  mapDrop?: MapPin;
  defaultMapZoom?: number;
};

/** Plain clock times for booking (30‑min steps, 5:00 AM – 9:00 PM). */
export const bookingTimeOptions: { value: string; label: string }[] = (() => {
  const opts: { value: string; label: string }[] = [];
  for (let h = 5; h <= 21; h++) {
    for (const m of [0, 30] as const) {
      if (h === 21 && m === 30) break;
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const hour12 = h % 12 || 12;
      const period = h < 12 ? "AM" : "PM";
      const label =
        m === 0 ? `${hour12}:00 ${period}` : `${hour12}:30 ${period}`;
      opts.push({ value, label });
    }
  }
  return opts;
})();

export const experiences: Experience[] = [
  {
    id: "dawn-silence",
    slug: "dawn-silence",
    title: "Dawn on the Ganges",
    tagline: "First light, empty ghats, and the city before it wakes.",
    duration: "90 minutes · departs pre-sunrise",
    capacity: "Up to 4 guests · hand‑rowed boat",
    priceFrom: 2499,
    currency: "INR",
    billingNote: "per private cruise · taxes as applicable",
    highlights: [
      "Quiet stretch along Assi to Dashashwamedh",
      "Tea & blanket on board (seasonal)",
      "Wandermate concierge for ghat meet‑point",
    ],
    category: "dawn",
    imageSrc:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
    imageAlt: "Soft morning mist over a wide river",
    boatSampleCaption:
      "Sample vessel: narrow hand-rowed boat — low profile for still water at dawn.",
    pickupPoint: "Assi Ghat — main river steps (Wandermate flag)",
    dropPoint: "Dashashwamedh Ghat — lower landing",
    popular: true,
    longDescription:
      "Step onto the river when Varanasi is still half-asleep: mist over the Ganges, distant bells, and the first orange line on the horizon. This is a slow, private row — no motors — so you hear water against the hull and the city waking one ghat at a time.",
    aboutTour: [
      "We designed this cruise for guests who want the Ganga before the crowds. Your boatman rows north along the sacred arc from Assi toward Dashashwamedh while light changes by the minute. A Wandermate host meets you at the agreed steps with clear signage so you are never guessing which boat is yours.",
      "The pace is unhurried: there is time to sit in silence, photograph the mist, or ask quiet questions about the ghats you pass. Seasonal tea and a light blanket are offered when the air is cool. Drop-off is coordinated at Dashashwamedh’s lower landing so you can walk up into the old city or return with your host’s directions.",
    ],
    whatYouWillSee: [
      "Soft pre-sunrise sky and reflections on still water",
      "Assi Ghat and the southern cluster of steps from the river",
      "Temple silhouettes and riverside architecture along the route",
      "The growing bustle of Dashashwamedh as the city fully wakes",
    ],
    whatYouWillExperience: [
      "A hand-rowed private boat with no engine noise",
      "Concierge meet-and-greet at Assi with a fixed flag / sign",
      "Optional seasonal hot drink and blanket on board",
      "A calm, respectful atmosphere — ideal for first mornings in Kashi",
    ],
    basicDetails: [
      { label: "Duration", value: "About 90 minutes from meet time" },
      { label: "Typical meet time", value: "Roughly 45–60 minutes before sunrise (varies by season)" },
      { label: "Group size", value: "Private — up to 4 guests" },
      { label: "Boat type", value: "Hand-rowed rowboat (sample shown when you book)" },
      { label: "Languages", value: "English-friendly host; Hindi with boatmen" },
      { label: "Included", value: "Life jackets on request · seasonal tea where offered" },
    ],
    mapPickup: {
      lat: 25.2836,
      lng: 83.0059,
      label: "Assi Ghat — meet at main steps (Wandermate flag)",
    },
    mapDrop: {
      lat: 25.3065,
      lng: 83.0093,
      label: "Dashashwamedh Ghat — lower landing",
    },
    defaultMapZoom: 15,
  },
  {
    id: "heritage-ghats",
    slug: "heritage-ghats",
    title: "Heritage Ghat Circuit",
    tagline: "The living spine of Kashi — architecture, devotion, and river life.",
    duration: "2.5 hours · guided narrative",
    capacity: "1–6 guests · shared or private options",
    priceFrom: 3299,
    currency: "INR",
    billingNote: "from · per group for private hand‑rowed cruise",
    highlights: [
      "Curated route across iconic ghats",
      "English / Hindi storyteller (on request)",
      "Life jackets & licensed partner boats",
    ],
    category: "heritage",
    imageSrc:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    imageAlt: "Stone steps of a riverside ghat at golden hour",
    boatSampleCaption:
      "Sample vessel: classic open rowboat · shaded canopy on select partners.",
    pickupPoint: "Dashashwamedh Ghat — boat stand near Raja Ghat lane",
    dropPoint: "Assi Ghat — near the broad steps",
    longDescription:
      "This is Varanasi from the water’s eye: centuries of steps, shrines, and daily ritual unfolded along one continuous bank. Your route strings together the most readable chapter of the city — not as a lecture, but as a moving story you can see and feel from the boat.",
    aboutTour: [
      "You board near Dashashwamedh, where the riverfront is at its busiest and most iconic. From there we move south along the ghat line with time to linger where the view is strongest — crematoria smoke at a distance, washer-folk at the steps, priests, tourists, and sadhus sharing the same stone stairs.",
      "On request we arrange a bilingual storyteller who can connect what you’re seeing to history, mythology, and contemporary life without rushing you past the moments that matter. The circuit ends at Assi, where the southern ghats feel slightly quieter — a natural exhale after a dense visual hour.",
    ],
    whatYouWillSee: [
      "Dashashwamedh and the dense ceremonial architecture around it",
      "Long bands of stepped ghats and small shrines at water level",
      "River work: boats, offerings, laundry, and pilgrims at the edge",
      "The transition from the heart of the strip toward Assi’s wider steps",
    ],
    whatYouWillExperience: [
      "A curated row route with pace matched to photography and questions",
      "Optional dedicated cultural guide (request when booking)",
      "Life jackets and vetted partner skiffs",
      "Drop at Assi with time to climb up into cafes and lanes",
    ],
    basicDetails: [
      { label: "Duration", value: "About 2.5 hours on the water + boarding buffer" },
      { label: "Group size", value: "1–6 guests · private or shared per availability" },
      { label: "Guide", value: "Storyteller optional — note at checkout or WhatsApp" },
      { label: "Meet point", value: "Dashashwamedh — boat stand near Raja Ghat lane" },
      { label: "Included", value: "Licensed boats · life jackets · bottled water on select partners" },
    ],
    mapPickup: {
      lat: 25.3065,
      lng: 83.0093,
      label: "Dashashwamedh Ghat — boat stand (meet detail sent after booking)",
    },
    mapDrop: {
      lat: 25.2836,
      lng: 83.0059,
      label: "Assi Ghat — broad steps",
    },
    defaultMapZoom: 15,
  },
  {
    id: "ganga-aarti",
    slug: "ganga-aarti",
    title: "Ganga Aarti — Riverside Ceremony",
    tagline: "Arrive by boat as lamps meet the sky — the most electric hour on the river.",
    duration: "3 hours · includes positioning for Aarti",
    capacity: "1–5 guests · premium viewing angles",
    priceFrom: 4499,
    currency: "INR",
    billingNote: "per group · festival dates may differ",
    highlights: [
      "Timed departure for optimal river approach",
      "Extended cushion seating on select partners",
      "Post‑ceremony slow glide under lit ghats",
    ],
    category: "aarti",
    imageSrc:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
    imageAlt: "Evening lamps and reflections on water",
    boatSampleCaption:
      "Sample vessel: forward seating for Aarti approach · premium cushioned decks on request.",
    pickupPoint: "Shivala Ghat — partner pontoon (evening slot)",
    dropPoint: "Dashashwamedh Ghat — after Aarti dispersal point",
    popular: true,
    longDescription:
      "Evening on the Ganga is theatre — brass lamps, chanting, and hundreds of small fires mirrored in black water. We time your approach so you are on the river as the energy builds, not stuck in the crush on the steps. Afterward, a slow row under lit ghats lets the noise settle into memory.",
    aboutTour: [
      "Your evening begins at Shivala Ghat’s partner pontoon, where staff help you step aboard without negotiating the chaos upstream alone. We move into position with respect for other boats and for the ceremony — this is a devotional hour for the city, and we treat it that way.",
      "When the main Aarti concludes, we drift toward Dashashwamedh for dispersal with enough time for photos and a last look at the lamps on the water. Timing can shift on festival nights; we confirm your slot by message on the day.",
    ],
    whatYouWillSee: [
      "The river silvering at dusk, then filling with boats and light",
      "The choreographed Aarti from a foreground on the water (angle varies)",
      "Post-ceremony glow of ghats and strings of bulbs along the bank",
      "Dashashwamedh’s steps emptying as the night deepens",
    ],
    whatYouWillExperience: [
      "Planned departure so you reach the ceremony window smoothly",
      "Forward or cushioned seating on premium partner boats where booked",
      "Concierge WhatsApp for last-minute ghat changes on crowded nights",
      "A quieter return glide once the peak crowd thins",
    ],
    basicDetails: [
      { label: "Duration", value: "About 3 hours including approach and exit" },
      { label: "Group size", value: "1–5 guests · private group pricing" },
      { label: "Peak nights", value: "Festivals may adjust timing — we message you" },
      { label: "Dress", value: "Modest layers; evenings can be cool on the water" },
      { label: "Included", value: "Positioning for ceremony · licensed crew · life jackets on request" },
    ],
    mapPickup: {
      lat: 25.2995,
      lng: 83.0078,
      label: "Shivala Ghat — evening pontoon (exact pin after booking)",
    },
    mapDrop: {
      lat: 25.3065,
      lng: 83.0093,
      label: "Dashashwamedh Ghat — post-Aarti dispersal",
    },
    defaultMapZoom: 16,
  },
  {
    id: "sunset-private",
    slug: "sunset-private",
    title: "Sunset Charter",
    tagline: "Champagne hour on the water — for couples, families, and small circles.",
    duration: "2 hours · flexible start within window",
    capacity: "Up to 8 guests · larger bajra on request",
    priceFrom: 5999,
    currency: "INR",
    billingNote: "from · includes soft beverages on select boats",
    highlights: [
      "Private boat class matched to party size",
      "Photography pause points",
      "Upgrade: live classical instrumentalist",
    ],
    category: "private",
    imageSrc:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    imageAlt: "Sunset colors over calm open water",
    boatSampleCaption:
      "Sample vessel: wider private deck for couples & families; larger bajra for 6+.",
    pickupPoint: "Ravidas Ghat — marked rowboats bay",
    dropPoint: "Same ghat unless you request Dashashwamedh end",
    longDescription:
      "Golden light on the water, a private deck, and room to breathe — this charter is for small celebrations, anniversaries, or families who want the river without a fixed script. Start time flexes within a sunset window so you can align flights and tea at the hotel.",
    aboutTour: [
      "We meet at Ravidas Ghat’s marked bay where wider private boats can load cleanly. Your vessel class scales with headcount: intimate rowboat for two, broader deck for families, or a larger bajra for six to eight with advance notice.",
      "The route favors open water and west-facing sky for photographs. You can ask to end at the same ghat for a short ashore walk or continue toward Dashashwamedh for a livelier disembark — note your preference when booking.",
    ],
    whatYouWillSee: [
      "Long western exposures over the Ganga as the sun lowers",
      "A quieter stretch of ghats away from the densest evening press",
      "Optional slow approach toward the lit centre if you choose that ending",
    ],
    whatYouWillExperience: [
      "Private boat matched to your party size",
      "Soft beverages on select partners — confirm dietary needs",
      "Deliberate pause points for portraits",
      "Optional upgrade: live classical instrumentalist (subject to artist availability)",
    ],
    basicDetails: [
      { label: "Duration", value: "2 hours on water · start window agreed by message" },
      { label: "Group size", value: "Up to 8 · larger bajra on request" },
      { label: "Default meet", value: "Ravidas Ghat — rowboats bay" },
      { label: "End point", value: "Same ghat by default · Dashashwamedh on request" },
      { label: "Included", value: "Private hire · crew · life jackets · drinks where noted on quote" },
    ],
    mapPickup: {
      lat: 25.2775,
      lng: 83.0024,
      label: "Ravidas Ghat — marked rowboats bay",
    },
    mapDrop: {
      lat: 25.3065,
      lng: 83.0093,
      label: "Dashashwamedh Ghat — optional alternate end",
    },
    defaultMapZoom: 15,
  },
  {
    id: "full-evening",
    slug: "full-evening",
    title: "Full Evening Immersion",
    tagline: "From gold light to full night — dinner ashore can be arranged.",
    duration: "4+ hours · bespoke",
    capacity: "Tailored · concierge planning",
    priceFrom: 12999,
    currency: "INR",
    billingNote: "from · itinerary quoted after brief",
    highlights: [
      "Multi‑stop route & timing with your host",
      "Priority partner allocation during peak nights",
      "Direct WhatsApp line the evening of your cruise",
    ],
    category: "private",
    imageSrc:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    imageAlt: "Deep twilight over a wide river horizon",
    boatSampleCaption:
      "Sample vessel: premium deck class — final boat matched to your bespoke route.",
    pickupPoint: "Confirmed with concierge (typical: Dashashwamedh or Assi)",
    dropPoint: "Confirmed with concierge — aligned to your evening plan",
    longDescription:
      "This is not a fixed tour — it is an evening built around you: sunset on the water, a chosen disembark for dinner or a temple visit, perhaps a second leg under full darkness. A concierge locks the route, boat class, and timings after a short brief so every hour feels intentional.",
    aboutTour: [
      "You share priorities — photography, spirituality, food, family pacing, or surprise — and we return a suggested timeline with meet point (usually Dashashwamedh or Assi depending on traffic and your hotel). On peak nights we reserve partner capacity early so you are not negotiating boats at the last minute.",
      "A direct WhatsApp line connects you to the duty host for the night. If you add dinner ashore, we coordinate landing times and a safe path back to vehicles or your stay.",
    ],
    whatYouWillSee: [
      "Sunset, blue hour, and fully lit ghats in one flowing arc",
      "Whatever combination your route includes — heritage strip, quieter south, or Aarti zone",
      "Optional second boarding or walk through lanes between river legs",
    ],
    whatYouWillExperience: [
      "Concierge-planned multi-stop evening with one accountable host",
      "Premium boat class once headcount and route are known",
      "Priority allocation with core partners during crowded dates",
      "Flexible pacing — built for celebration, not checklist tourism",
    ],
    basicDetails: [
      { label: "Duration", value: "4+ hours · exact span in your written quote" },
      { label: "Planning", value: "Brief by form / call → itinerary & price within one business day" },
      { label: "Typical meet", value: "Dashashwamedh or Assi — confirmed in writing" },
      { label: "Communication", value: "WhatsApp host on the evening of your cruise" },
      { label: "Add-ons", value: "Dinner reservations, guides, music — itemised in quote" },
    ],
    mapPickup: {
      lat: 25.3065,
      lng: 83.0093,
      label: "Typical start: Dashashwamedh area — final pin from concierge",
    },
    mapDrop: {
      lat: 25.2836,
      lng: 83.0059,
      label: "Possible end: Assi or return — per your plan",
    },
    defaultMapZoom: 14,
  },
];

export type AddOn = {
  id: string;
  label: string;
  description: string;
  price: number;
};

export const addOns: AddOn[] = [
  {
    id: "guide-pro",
    label: "Senior cultural guide",
    description: "Deep heritage narrative for your party only.",
    price: 1500,
  },
  {
    id: "flowers-offering",
    label: "Flowers & offerings kit",
    description: "Prepared for river offerings — respectful & local.",
    price: 499,
  },
  {
    id: "photo-stop",
    label: "Extended photo stops",
    description: "+30 minutes anchored for portraits.",
    price: 999,
  },
];

export function getExperienceById(id: string | undefined) {
  if (!id) return undefined;
  return experiences.find((e) => e.id === id);
}

export function getExperienceBySlug(slug: string | undefined) {
  if (!slug) return undefined;
  return experiences.find((e) => e.slug === slug);
}
