// ---------- Types ----------
// Single source of truth for industries data. Use INDUSTRIES /
// getIndustryBySlug in the homepage section, /our-presence, and
// /our-presence/[slug] so all three read from the same place.

export interface Industry {
  slug: string; // used as the URL segment: /our-presence/[slug]
  name: string;
  description: string; // short, shown on the card
  longDescription: string; // fuller paragraph for the detail page
  image: string;
}

// ---------- Data ----------
// Replace each `image` path with a real asset once available
// (e.g. /industries/automobile-industry.jpg).

export const INDUSTRIES: Industry[] = [
  {
    slug: "automobile-industry",
    name: "Automobile Industry",
    description:
      "Precision-fabricated structures and components built for automotive assembly and production lines.",
    longDescription:
      "We support automotive manufacturers and their suppliers with precision-engineered structures, conveyor systems, and fabricated components built for continuous, high-volume production. From assembly line frameworks to material handling systems, every build is designed around the tight tolerances and uptime demands of automotive manufacturing.",
    image: "/industries/automobile.webp",
  },
  {
    slug: "engineering-industry",
    name: "Engineering Industry",
    description:
      "Structural and fabrication solutions engineered for heavy industrial and infrastructure projects.",
    longDescription:
      "For engineering and infrastructure projects, we deliver heavy structural fabrication, platforms, and custom steelwork built to exact specifications. Our team works alongside EPC contractors and engineering firms to execute projects from design through installation, meeting demanding structural and safety standards.",
    image: "/industries/engineering.webp",
  },
  {
    slug: "machine-industry",
    name: "Machine Industry",
    description:
      "Custom tooling, fixtures, and fabricated parts built for machine builders and equipment manufacturers.",
    longDescription:
      "Machine builders rely on us for custom tooling, fixtures, enclosures, and fabricated components that meet precise mechanical and dimensional requirements. We work closely with engineering teams to turn designs into production-ready parts, supporting both prototype runs and ongoing volume manufacturing.",
    image: "/industries/machine.webp",
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}
