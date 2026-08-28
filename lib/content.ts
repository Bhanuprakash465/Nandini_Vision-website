import type {
  Collection,
  NavLink,
  Project,
  ServiceItem,
  StudioInfo,
  TeamMember,
  Testimonial,
} from "@/lib/types";

/**
 * ─────────────────────────────────────────────────────────────
 *  NANDINI VISION — CENTRALIZED CONTENT
 *  Single source of truth for studio information, navigation,
 *  services, projects, testimonials, collections and SEO copy.
 *  A future CMS reads/writes this same shape.
 * ─────────────────────────────────────────────────────────────
 */

export const studio: StudioInfo = {
  name: "Nandini Vision",
  brandStatement: "Photography for the beautifully lived.",
  supportingStatement: "The feeling between frames.",
  location: "Andhra Pradesh, India",
  serviceArea: "Worldwide",
  email: "hello@nandinistudio.demo",
  phone: "+91 98765 43210",
  phoneDisplay: "+91 98765 43210",
  phoneIntl: "919876543210",
  instagram: "https://instagram.com/nandinistudio.demo",
  instagramHandle: "@nandinistudio.demo",
  demoNotice:
    "Temporary imagery and demo contact information are used in this development version.",
};

export const navigation: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Availability", href: "/availability" },
  { label: "Contact", href: "/contact" },
  { label: "Book a Consultation", href: "/consultation", cta: true },
];

export const eventTypes = [
  "Wedding Photography",
  "Pre-Wedding & Couple Shoot",
  "Events & Celebrations",
  "Family & Portrait Photography",
  "Baby & Maternity Photography",
  "Fashion & Portfolio Photography",
  "Corporate & Product Photography",
  "Videography & Cinematic Films",
  "Drone Photography & Videography",
  "Other",
];

export const budgetRanges = [
  "Prefer not to say",
  "Under ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,00,000",
  "₹2,00,000 – ₹3,00,000",
  "₹3,00,000+",
  "Bespoke / Discuss",
];

export const durationOptions = [
  { value: 1, label: "1 day" },
  { value: 2, label: "2 days" },
  { value: 3, label: "3 days" },
  { value: 5, label: "5 days" },
  { value: 7, label: "1 week" },
];

export const filterCategories = [
  "All",
  "Weddings",
  "Pre-Wedding",
  "Events",
  "Family",
  "Baby & Maternity",
  "Fashion",
  "Corporate",
  "Videography",
  "Drone",
  "Other Events",
] as const;

export const services: ServiceItem[] = [
  {
    number: "01",
    title: "Wedding Photography",
    description:
      "Wedding-day photography across religions, communities and traditions — observed quietly, treasured forever.",
    image: {
      src: "/images/projects/a-red-thread-2.jpg",
      alt: "Bride in red leaving a candlelit temple corridor on her wedding day",
      aspect: "4 / 5",
    },
  },
  {
    number: "02",
    title: "Pre-Wedding & Couple Shoots",
    description:
      "Romantic, cinematic and editorial couple photography in the landscapes you love.",
    image: {
      src: "/images/projects/between-river-and-sky-3.jpg",
      alt: "Couple on a hilltop at sunset with a flowing dress in the wind",
      aspect: "4 / 5",
    },
  },
  {
    number: "03",
    title: "Events & Celebrations",
    description:
      "Birthdays, anniversaries, launches, parties and intimate gatherings — documented like stories, not schedules.",
    image: {
      src: "/images/projects/a-red-thread-4.jpg",
      alt: "Evening celebration with marigolds and warm string lights",
      aspect: "4 / 5",
    },
  },
  {
    number: "04",
    title: "Family & Portrait Photography",
    description:
      "Family portraits, lifestyle photography and personal portraits that feel like a quiet conversation.",
    image: {
      src: "/images/projects/a-little-more-life-1.jpg",
      alt: "Mother-to-be in a flowing gown beside a pond at golden hour",
      aspect: "4 / 5",
    },
  },
  {
    number: "05",
    title: "Baby & Maternity Photography",
    description:
      "Maternity, newborn and baby milestone photography — tender, unhurried and true to the light you live in.",
    image: {
      src: "/images/projects/a-little-more-life-2.jpg",
      alt: "Mother holding her sleeping newborn by a window",
      aspect: "4 / 5",
    },
  },
  {
    number: "06",
    title: "Fashion & Portfolio Photography",
    description:
      "Fashion editorials, model portfolios, creative portraits and personal branding.",
    image: {
      src: "/images/projects/fashion-look-1.jpg",
      alt: "Editorial studio portrait in rose-gold light",
      aspect: "4 / 5",
    },
  },
  {
    number: "07",
    title: "Corporate & Product Photography",
    description:
      "Corporate events, product photography, business branding and campaigns.",
    image: {
      src: "/images/projects/between-river-and-sky-2.jpg",
      alt: "Aerial view of a winding river through green hills",
      aspect: "4 / 5",
    },
  },
  {
    number: "08",
    title: "Videography & Cinematic Films",
    description:
      "Wedding films, event films, promotional videos and cinematic reels.",
    image: {
      src: "/images/projects/the-gold-hour-4.jpg",
      alt: "A long dress moving in the wind at golden hour",
      aspect: "4 / 5",
    },
  },
  {
    number: "09",
    title: "Drone Photography & Videography",
    description:
      "Aerial photography and cinematic drone coverage that gives a story its scale.",
    image: {
      src: "/images/projects/between-river-and-sky-1.jpg",
      alt: "Misty green mountain ridge above Araku Valley",
      aspect: "4 / 5",
    },
  },
  {
    number: "10",
    title: "Photo Editing & Retouching",
    description:
      "Professional retouching, colour grading and image enhancement — quiet craft behind every frame.",
    image: {
      src: "/images/projects/a-red-thread-1.jpg",
      alt: "Bride's hennaed hands and gold bangles resting on red silk",
      aspect: "4 / 5",
    },
  },
  {
    number: "11",
    title: "Albums & Photo Prints",
    description:
      "Premium albums, photo books and professional prints, made to be held for generations.",
    image: {
      src: "/images/projects/a-red-thread-3.jpg",
      alt: "Bride and groom in a quiet ritual moment with flower garlands",
      aspect: "4 / 5",
    },
  },
];

export const projects: Project[] = [
  {
    slug: "a-red-thread",
    title: "A Red Thread",
    location: "Vijayawada",
    year: "2024",
    category: "Weddings",
    categories: ["Weddings"],
    blurb:
      "Two families, one temple corridor, and the quiet moment a red thread ties everything together.",
    story: [
      "Some weddings arrive like monsoon — all at once. This one came softly, in the hush of a Vijayawada morning, when the temple corridor still smelled of old stone and fresh jasmine.",
      "We photographed the ritual the way it was lived: the henna drying on a bride's palm, the gold that had waited three generations, the mothers who watched from doorways, and the single red thread that, for one long second, held an entire future in place.",
      "No direction was given. We only noticed — and the frames kept the feeling between them.",
    ],
    hero: {
      src: "/images/projects/a-red-thread-1.jpg",
      alt: "Bride's hennaed hands and gold bangles resting on deep red Banarasi silk",
      aspect: "3 / 2",
    },
    gallery: [
      {
        src: "/images/projects/a-red-thread-1.jpg",
        alt: "Bride's hennaed hands and gold bangles resting on deep red Banarasi silk",
        aspect: "4 / 5",
      },
      {
        src: "/images/projects/a-red-thread-2.jpg",
        alt: "Bride in red walking through a candlelit ancient temple corridor",
        aspect: "3 / 4",
      },
      {
        src: "/images/projects/a-red-thread-3.jpg",
        alt: "Bride and groom close together during a wedding ritual, garlands of red flowers",
        aspect: "4 / 3",
      },
      {
        src: "/images/projects/a-red-thread-4.jpg",
        alt: "Wide view of an evening celebration with marigold garlands and string lights",
        aspect: "3 / 2",
      },
    ],
    meta: {
      eventType: "Wedding · 2 days",
      coverage: "Photography + films + drone",
      deliverables: ["250+ edited frames", "6-minute wedding film", "Signature album"],
    },
  },
  {
    slug: "between-river-and-sky",
    title: "Between River & Sky",
    location: "Araku Valley",
    year: "2024",
    category: "Pre-Wedding",
    categories: ["Pre-Wedding"],
    blurb:
      "A pre-wedding story shot above the clouds — where the river met the sky and the couple forgot the camera existed.",
    story: [
      "Araku does not pose. It rains without warning, and the valley disappears into fog you could hold in your hands. We planned for every forecast and photographed none of them — the hills decided.",
      "We walked the ridge line for a morning, waited for the river to catch the light, and let two people who were about to marry simply walk, laugh and be unsteady on wet stones.",
      "The frames that mattered are the ones between poses: the wind taking a veil, the sudden quiet when they forgot we were there.",
    ],
    hero: {
      src: "/images/projects/between-river-and-sky-1.jpg",
      alt: "Couple on a misty green ridge above Araku Valley at dawn",
      aspect: "3 / 2",
    },
    gallery: [
      {
        src: "/images/projects/between-river-and-sky-1.jpg",
        alt: "Couple standing on a misty green mountain ridge in Araku Valley",
        aspect: "4 / 5",
      },
      {
        src: "/images/projects/between-river-and-sky-2.jpg",
        alt: "Drone view of a winding river cutting through green hills at golden hour",
        aspect: "3 / 2",
      },
      {
        src: "/images/projects/between-river-and-sky-3.jpg",
        alt: "Couple at sunset on a hilltop, a long dress moving in the wind",
        aspect: "4 / 3",
      },
      {
        src: "/images/projects/between-river-and-sky-4.jpg",
        alt: "Black-and-white editorial portrait of a couple by stone architecture",
        aspect: "3 / 4",
      },
    ],
    meta: {
      eventType: "Pre-wedding · 1 day",
      coverage: "Photography + drone + film",
      deliverables: ["120+ edited frames", "3-minute film", "Sunset sequence"],
    },
  },
  {
    slug: "the-gold-hour",
    title: "The Gold Hour",
    location: "Rajahmundry",
    year: "2023",
    category: "Weddings",
    categories: ["Weddings"],
    blurb:
      "A river-city wedding filmed in the one hour when Rajahmundry turns entirely to amber.",
    story: [
      "In Rajahmundry, the Godavari keeps its own time. The wedding moved with it — puja at dawn, vows at noon, and everything golden by the hour the light leaned sideways over the ghats.",
      "We worked the banks like documentarians and the rooftops like filmmakers: hands touched with turmeric, garlands pressed into place, a nephew asleep on a grandfather's shoulder.",
      "The 'gold hour' turned out to be less a time of day and more a feeling — the whole city, and everyone in it, briefly lit like a blessing.",
    ],
    hero: {
      src: "/images/projects/the-gold-hour-1.jpg",
      alt: "Couple walking along the river ghats of Rajahmundry in golden light",
      aspect: "3 / 2",
    },
    gallery: [
      {
        src: "/images/projects/the-gold-hour-1.jpg",
        alt: "Couple walking along river ghats in warm golden hour light",
        aspect: "4 / 5",
      },
      {
        src: "/images/projects/the-gold-hour-2.jpg",
        alt: "Hands joined in ritual with gold jewellery and marigold petals",
        aspect: "3 / 4",
      },
      {
        src: "/images/projects/the-gold-hour-3.jpg",
        alt: "Ancient temple glowing in warm evening light with marigold offerings",
        aspect: "3 / 2",
      },
      {
        src: "/images/projects/the-gold-hour-4.jpg",
        alt: "A long dress moving in the wind at golden hour",
        aspect: "4 / 3",
      },
    ],
    meta: {
      eventType: "Wedding · 1 day + reception",
      coverage: "Photography + film",
      deliverables: ["300+ edited frames", "10-minute film", "2 albums"],
    },
  },
  {
    slug: "a-little-more-life",
    title: "A Little More Life",
    location: "Visakhapatnam",
    year: "2023",
    category: "Family",
    categories: ["Family", "Other Events"],
    blurb:
      "A family portrait session that became a small documentary — three generations, one afternoon, a little more life.",
    story: [
      "The brief was a family portrait: grandparents, parents, a new baby, one afternoon. The photograph we left with was something else — a record of a family being, unhurried, in their own light.",
      "There was no posing list. A grandmother retold a story, a baby fell asleep mid-sentence, and the sea breeze rearranged everyone's hair between frames.",
      "We stayed until the light went soft over the Bay of Bengal. Sometimes the assignment is simply to notice how much life a single afternoon holds.",
    ],
    hero: {
      src: "/images/projects/a-little-more-life-1.jpg",
      alt: "Mother-to-be in a flowing gown beside a pond at golden hour",
      aspect: "3 / 2",
    },
    gallery: [
      {
        src: "/images/projects/a-little-more-life-1.jpg",
        alt: "Mother-to-be in a flowing gown beside a pond at golden hour",
        aspect: "4 / 5",
      },
      {
        src: "/images/projects/a-little-more-life-2.jpg",
        alt: "Mother holding her newborn by the window, natural light",
        aspect: "3 / 4",
      },
      {
        src: "/images/projects/a-little-more-life-3.jpg",
        alt: "Close detail of a parent cradling a sleeping newborn",
        aspect: "4 / 3",
      },
      {
        src: "/images/projects/a-little-more-life-4.jpg",
        alt: "Wide golden-hour view of a maternity portrait beside a pond",
        aspect: "3 / 2",
      },
    ],
    meta: {
      eventType: "Family session · 1 day",
      coverage: "Photography only",
      deliverables: ["90+ edited frames", "Premium print set", "Keepsake album"],
    },
  },
];

export const collections: Collection[] = [
  {
    name: "Signature",
    tagline: "For intimate celebrations",
    description:
      "For intimate celebrations and carefully considered coverage. One photographer, one full day, every feeling between the frames kept.",
    cta: { label: "Request the collection", href: "/consultation" },
    features: ["Full-day photography", "One lead photographer", "200+ edited frames", "Fine-art print set"],
    image: {
      src: "/images/projects/a-red-thread-3.jpg",
      alt: "Intimate wedding ritual moment between a bride and groom",
      aspect: "3 / 4",
    },
  },
  {
    name: "Editorial",
    tagline: "For complete storytelling",
    description:
      "For complete wedding and event storytelling. A two-person team, cinematic film and album — the whole story, in sequence.",
    cta: { label: "Request the collection", href: "/consultation" },
    features: ["Full wedding coverage", "Photography + film team", "Cinematic highlight film", "Editorial album"],
    image: {
      src: "/images/projects/the-gold-hour-4.jpg",
      alt: "Couple celebrating at a rooftop reception at golden hour",
      aspect: "3 / 4",
    },
  },
  {
    name: "Bespoke",
    tagline: "For the extraordinary",
    description:
      "For multi-day celebrations, campaigns and custom productions. We design the coverage around the occasion, never the other way around.",
    cta: { label: "Discuss your vision", href: "/consultation" },
    features: ["Multi-day coverage", "Creative direction", "Drone + film unit", "Custom productions"],
    image: {
      src: "/images/projects/between-river-and-sky-1.jpg",
      alt: "Dramatic misty ridge above Araku Valley at first light",
      aspect: "3 / 4",
    },
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "We didn't pose for a single photograph. Nandini's team simply stood in the corners of our wedding and kept the moments we didn't know we were making.",
    client: "Ananya & Vikram",
    event: "Wedding",
    location: "Vijayawada",
  },
  {
    quote:
      "The film made my mother cry in the middle of the reception. That is the only review that matters.",
    client: "Sneha R.",
    event: "Wedding",
    location: "Visakhapatnam",
  },
  {
    quote:
      "They photographed three generations of us and somehow made everyone look like themselves — only more so. We frame the album like a gallery.",
    client: "The Rao Family",
    event: "Family Session",
    location: "Hyderabad",
  },
  {
    quote:
      "Araku in the rain was chaos. The photographs came back like paintings. We still can't explain it.",
    client: "Karthik & Meghana",
    event: "Pre-Wedding Shoot",
    location: "Araku Valley",
  },
  {
    quote:
      "Quiet, precise, and completely in love with the work. Our launch coverage looked like a film still, not a corporate event.",
    client: "Studio Verve",
    event: "Brand Campaign",
    location: "Bengaluru",
  },
];

export const team: TeamMember[] = [
  {
    name: "Nandini",
    role: "Founder & Lead Photographer",
    bio: "Nandini photographs the way people remember: softly, and in colour. She leads every story the studio takes on.",
    image: {
      src: "/images/projects/a-red-thread-1.jpg",
      alt: "Fine detail of a wedding day, photographed by the studio founder",
      aspect: "3 / 4",
    },
    demo: true,
  },
  {
    name: "Arjun",
    role: "Cinematographer & Drone Pilot",
    bio: "Arjun moves between handheld observation and wide aerial stillness — the two feelings a film needs.",
    image: {
      src: "/images/projects/between-river-and-sky-2.jpg",
      alt: "Aerial frame from the studio's cine-drone unit",
      aspect: "3 / 4",
    },
    demo: true,
  },
  {
    name: "Meera",
    role: "Retoucher & Album Editor",
    bio: "Meera keeps the colour true to the moment, and turns three thousand frames into one quiet album.",
    image: {
      src: "/images/projects/a-red-thread-3.jpg",
      alt: "Quiet editorial frame finished by the studio's retoucher",
      aspect: "3 / 4",
    },
    demo: true,
  },
];

export const instagramGrid = [
  { src: "/images/projects/a-red-thread-4.jpg", alt: "Evening celebration lights in marigold", aspect: "1 / 1" },
  { src: "/images/projects/between-river-and-sky-3.jpg", alt: "Golden hour silhouette on a hilltop", aspect: "1 / 1" },
  { src: "/images/projects/the-gold-hour-2.jpg", alt: "Hands in ritual with gold and marigold", aspect: "1 / 1" },
  { src: "/images/projects/a-little-more-life-2.jpg", alt: "A mother and newborn in window light", aspect: "1 / 1" },
  { src: "/images/projects/a-red-thread-2.jpg", alt: "Bride walking a candlelit corridor", aspect: "1 / 1" },
  { src: "/images/projects/the-gold-hour-1.jpg", alt: "River ghats glowing at golden hour", aspect: "1 / 1" },
];

export const showreel = {
  src: "/media/showreel.mp4",
  mobileSrc: "/media/showreel-mobile.mp4",
  poster: "/media/showreel-poster.jpg",
  label: "Temporary placeholder footage · generated for development",
};

export const whatsapp = {
  baseUrl: `https://wa.me/${studio.phoneIntl}`,
  demoNote: `Demo WhatsApp number: ${studio.phoneDisplay}. Replace with the studio's real number before launch.`,
};

/** Builds a pre-filled WhatsApp deep link for a consultation. */
export function buildWhatsAppUrl(payload: {
  name?: string;
  event?: string;
  date?: string;
  location?: string;
  ref?: string;
}): string {
  const parts: string[] = [`Hello ${studio.name}, I would like to discuss my`];
  if (payload.event) parts.push(`${payload.event.toLowerCase()} booking`);
  else parts.push("photography booking");
  if (payload.date) parts.push(`for ${payload.date}`);
  if (payload.location) parts.push(`in ${payload.location}`);
  if (payload.ref) parts.push(`. My enquiry reference is ${payload.ref}`);
  const text = parts.join(" ").replace(/\s+/g, " ").trim() + ".";
  return `${whatsapp.baseUrl}?text=${encodeURIComponent(text)}`;
}

export const seo = {
  siteName: "Nandini Vision",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nandinivision.demo",
  description:
    "Photography for the beautifully lived. Nandini Vision is a premium photography studio in Andhra Pradesh, India — weddings, editorial portraits, events and cinematic films, available worldwide.",
  ogImage: "/images/og/nandini-vision-social-preview.jpg",
  twitterHandle: "@nandinistudio.demo",
};
