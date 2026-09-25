// ---------- Types ----------
// This file is the single source of truth for product data.
// Use PRODUCTS / getProductById in the products section, the products
// listing page, and the product detail page so all three stay in sync.

export type Category =
  | "all"
  | "conveyor"
  | "structural"
  | "safety"
  | "fabrication"
  | "project";

export type Spec = {
  label: string;
  value: string;
};

export type Product = {
  id: string; // used as the URL slug, e.g. /our-products/[id]
  title: string;
  category: Category;
  badge: string;

  // Card / section copy
  description: string; // short, 1–2 lines, shown on the card

  // Detail page copy
  longDescription: string; // fuller paragraph for the detail page
  features: string[]; // bullet highlights for the detail page

  //
  image: string; // main / cover image (card + detail hero)
  gallery: string[]; // additional for the detail page

  specs: Spec[];
};

// ---------- Data ----------
// Replace every `image` / `gallery` path with real assets once available
// (e.g. /products/conveyor-structure.webp).

export const PRODUCTS: Product[] = [
  {
    id: "conveyor-structure",
    title: "Conveyor Structure",
    category: "conveyor",
    badge: "Conveyor",
    description:
      "Heavy-duty support structures engineered to carry conveyor lines across your facility with long-term stability.",
    longDescription:
      "Our conveyor structures are designed and fabricated to support material handling lines of any length or load, from single straight runs to complex multi-level layouts. Every structure is engineered around the specific belt width, load, and span of the project, then fabricated and finished for a long service life in demanding plant environments.",
    features: [
      "Engineered for site-specific span and load",
      "Bolted or welded assembly options",
      "Painted or hot-dip galvanized finish",
      "Compatible with overhead and ground-mounted runs",
    ],
    image: "/products/conveyor-structure.webp",
    gallery: [
      "/products/conveyor-structure-1.webp",
      "/products/conveyor-structure-2.webp",
    ],
    specs: [
      { label: "Material", value: "MS / GI structural steel" },
      { label: "Finish", value: "Painted or galvanized" },
      { label: "Design", value: "Custom span & load rating" },
    ],
  },
  {
    id: "mezzanine-floor",
    title: "Mezzanine Floor",
    category: "structural",
    badge: "Structural",
    description:
      "Multi-level steel mezzanine floors that add usable working or storage area without expanding your building footprint.",
    longDescription:
      "Mezzanine floors are a fast way to add working, storage, or office area within your existing building height. We design modular, bolted steel structures sized to your column grid and load requirements, with flooring, staircases, and handrailing supplied as a complete package.",
    features: [
      "Modular, bolted assembly for fast installation",
      "Chequered plate or grating floor options",
      "Integrated staircases and handrails available",
      "Designed to your load and layout requirements",
    ],
    image: "/products/mezzanine-floor.webp",
    gallery: [
      "/products/mezzanine-floor-1.webp",
      "/products/mezzanine-floor-2.webp",
    ],
    specs: [
      { label: "Load Capacity", value: "Up to project spec" },
      { label: "Flooring", value: "Chequered plate / grating" },
      { label: "Design", value: "Modular, bolted assembly" },
    ],
  },
  {
    id: "safety-rail-toe-guard",
    title: "Safety Rail & Toe Guard",
    category: "safety",
    badge: "Safety",
    description:
      "Handrails and toe guards fabricated to industrial safety standards, protecting personnel on elevated walkways and platforms.",
    longDescription:
      "Safety rails and toe guards are fabricated to fit any platform, catwalk, or staircase edge, keeping personnel and equipment protected on elevated work areas. Every run is measured and fabricated to the site layout, with consistent finish and mounting across the full installation.",
    features: [
      "Fits platforms, catwalks, and staircases",
      "Site-measured for an exact fit",
      "Consistent height and mounting throughout",
      "Painted or galvanized finish options",
    ],
    image: "/products/safety-rail-toe-guard.webp",
    gallery: [
      "/products/safety-rail-toe-guard-1.webp",
      "/products/safety-rail-toe-guard-2.webp",
    ],
    specs: [
      { label: "Standard", value: "Industrial safety compliant" },
      { label: "Material", value: "MS pipe / angle" },
      { label: "Application", value: "Platforms, catwalks, stairs" },
    ],
  },
  {
    id: "catwalk-structure-support",
    title: "Catwalk Structure with Support",
    category: "structural",
    badge: "Structural",
    description:
      "Elevated catwalk structures with engineered support columns, built for safe access and inspection routes.",
    longDescription:
      "Catwalk structures provide safe, elevated access for inspection and maintenance routes across plant equipment. Each structure is engineered with its own support columns and bracketry, so the walkway can be routed exactly where your process needs it.",
    features: [
      "Engineered support columns and brackets",
      "Routed to your process layout",
      "Ladder or staircase access points",
      "Handrail and toe guard ready",
    ],
    image: "/products/catwalk-structure-support.webp",
    gallery: [
      "/products/catwalk-structure-support-1.webp",
      "/products/catwalk-structure-support-2.webp",
    ],
    specs: [
      { label: "Access", value: "Ladders / staircases integrated" },
      { label: "Support", value: "Column & bracket system" },
      { label: "Design", value: "Site-specific layout" },
    ],
  },
  {
    id: "screen-guard-hanger-support-rail",
    title: "Screen Guard & Hanger, Support, Rail",
    category: "safety",
    badge: "Safety",
    description:
      "Protective screen guards along with hangers, supports, and rails, fabricated to shield equipment and walkways.",
    longDescription:
      "This package covers screen guards, hangers, supports, and rails supplied together as a single protective system. It's fabricated to shield equipment, conveyor lines, and walkways from debris and material spillage, with all components matched for a clean, consistent installation.",
    features: [
      "Screen, hanger, support, and rail supplied together",
      "Shields equipment and walkways from debris",
      "Matched components for a consistent finish",
      "MS or wire mesh options",
    ],
    image: "/products/screen-guard-hanger-support-rail.webp",
    gallery: [
      "/products/screen-guard-hanger-support-rail-1.webp",
      "/products/screen-guard-hanger-support-rail-2.webp",
    ],
    specs: [
      { label: "Components", value: "Screen, hanger, support, rail" },
      { label: "Material", value: "MS / wire mesh" },
      { label: "Use", value: "Equipment & walkway protection" },
    ],
  },
  {
    id: "rail-guide",
    title: "Rail Guide",
    category: "structural",
    badge: "Structural",
    description:
      "Precision-fabricated rail guides that keep moving loads and equipment tracking accurately along their path.",
    longDescription:
      "Rail guides keep moving loads, trolleys, and equipment tracking accurately along a fixed path. We fabricate them to close tolerances in wear-resistant steel, so alignment holds up under repeated use.",
    features: [
      "Close-tolerance fabrication",
      "Wear-resistant steel options",
      "Straight and curved runs available",
      "Matched to your trolley or load system",
    ],
    image: "/products/rail-guide.webp",
    gallery: [
      "/products/rail-guide-1.webp",
      "/products/rail-guide-2.webp",
    ],
    specs: [
      { label: "Material", value: "MS / wear-resistant steel" },
      { label: "Tolerance", value: "Close-tolerance machining" },
      { label: "Application", value: "Guided load movement" },
    ],
  },
  {
    id: "special-fabrication-job",
    title: "Special Fabrication Job",
    category: "fabrication",
    badge: "Fabrication",
    description:
      "Custom fabrication covering foundation work, EPC projects, and civil projects, tailored to specific project requirements.",
    longDescription:
      "Beyond standard structures, we take on custom fabrication work covering foundation work, EPC scopes, and civil projects. Each job is scoped around the specific project requirement and delivered end-to-end, from design through execution.",
    features: [
      "Foundation, EPC, and civil work",
      "Custom, project-based scoping",
      "End-to-end execution",
      "Coordinated with your project timeline",
    ],
    image: "/products/special-fabrication-job.webp",
    gallery: [
      "/products/special-fabrication-job-1.webp",
      "/products/special-fabrication-job-2.webp",
    ],
    specs: [
      { label: "Scope", value: "Foundation, EPC, civil work" },
      { label: "Approach", value: "Custom, project-based" },
      { label: "Delivery", value: "End-to-end execution" },
    ],
  },
  {
    id: "heavy-structure",
    title: "Heavy Structure",
    category: "structural",
    badge: "Structural",
    description:
      "Heavy steel structures fabricated and erected for high-load industrial applications and large equipment support.",
    longDescription:
      "Heavy structures form the backbone of large industrial installations — supporting major equipment, process units, and building frames. We handle the full scope from design and fabrication through to site erection, built to carry high, sustained loads.",
    features: [
      "High-load structural design",
      "Fabrication through to site erection",
      "Suited to process units and building frames",
      "Quality-checked welds and joints",
    ],
    image: "/products/heavy-structure.png",
    gallery: [
      "/products/heavy-structure-1.webp",
      "/products/heavy-structure-2.webp",
    ],
    specs: [
      { label: "Material", value: "Structural steel (MS)" },
      { label: "Application", value: "Equipment & building support" },
      { label: "Delivery", value: "Fabrication + erection" },
    ],
  },
  {
    id: "tanks",
    title: "Tanks",
    category: "fabrication",
    badge: "Fabrication",
    description:
      "Fabricated storage and process tanks built to your capacity, pressure, and material handling requirements.",
    longDescription:
      "We fabricate storage and process tanks to the capacity, pressure, and material specification your process calls for. Each tank is built and tested to hold its rated volume safely, with mounting and access fittings arranged for your site layout.",
    features: [
      "Custom capacity and dimensions",
      "MS / SS material options",
      "Access ladders, nozzles, and fittings",
      "Tested before dispatch",
    ],
    image: "/products/tanks.webp",
    gallery: ["/products/tanks-1.webp", "/products/tanks-2.webp"],
    specs: [
      { label: "Material", value: "MS / SS" },
      { label: "Capacity", value: "Built to project spec" },
      { label: "Testing", value: "Pressure / leak tested" },
    ],
  },
  {
    id: "handrails",
    title: "Handrails",
    category: "safety",
    badge: "Safety",
    description:
      "Sturdy handrails fabricated for staircases, platforms, and walkways, sized and finished to match your site.",
    longDescription:
      "Handrails are fabricated to fit staircases, platforms, and walkways of any layout, giving personnel a secure grip point along elevated or high-traffic areas. Runs are measured on site and finished to match the rest of your structure.",
    features: [
      "Fits staircases, platforms, and walkways",
      "Site-measured for an exact fit",
      "Painted or galvanized finish",
      "Matched to existing structure finish",
    ],
    image: "/products/handrails.webp",
    gallery: [
      "/products/handrails-1.webp",
      "/products/handrails-2.webp",
    ],
    specs: [
      { label: "Material", value: "MS pipe / angle" },
      { label: "Finish", value: "Painted or galvanized" },
      { label: "Application", value: "Stairs, platforms, walkways" },
    ],
  },
  {
    id: "platforms",
    title: "Platforms",
    category: "structural",
    badge: "Structural",
    description:
      "Elevated steel platforms built for equipment access, operation, and maintenance at height.",
    longDescription:
      "Elevated platforms give operators and maintenance crews safe access to equipment at height. Each platform is engineered for its load and footprint, complete with flooring, access points, and railing to match the rest of your site's structures.",
    features: [
      "Engineered for load and footprint",
      "Chequered plate or grating flooring",
      "Integrated access and railing",
      "Fixed or modular designs",
    ],
    image: "/products/platforms.webp",
    gallery: [
      "/products/platforms-1.webp",
      "/products/platforms-2.webp",
    ],
    specs: [
      { label: "Flooring", value: "Chequered plate / grating" },
      { label: "Design", value: "Fixed or modular" },
      { label: "Application", value: "Equipment access & maintenance" },
    ],
  },
  {
    id: "paint-booth",
    title: "Paint Booth",
    category: "fabrication",
    badge: "Fabrication",
    description:
      "Fabricated paint booths designed for controlled, efficient, and safe spray-painting operations.",
    longDescription:
      "Our paint booths are fabricated to contain overspray and maintain controlled airflow for consistent, safe spray-painting operations. Sizing and ventilation are matched to the parts you're finishing and your facility's throughput.",
    features: [
      "Controlled airflow and overspray containment",
      "Sized to your part range and throughput",
      "Lighting and access points included",
      "Panel or modular construction",
    ],
    image: "/products/paint-booth.webp",
    gallery: [
      "/products/paint-booth-1.webp",
      "/products/paint-booth-2.webp",
    ],
    specs: [
      { label: "Construction", value: "Panel / modular steel" },
      { label: "Airflow", value: "Controlled ventilation" },
      { label: "Design", value: "Sized to part range" },
    ],
  },
  {
    id: "trolley",
    title: "Trolley",
    category: "conveyor",
    badge: "Conveyor",
    description:
      "Material handling trolleys built for smooth, reliable movement of loads along rail or floor-mounted tracks.",
    longDescription:
      "Trolleys are fabricated for smooth, repeatable movement of loads along rail or floor-mounted tracks, matched to your rail guide and load specification. Wheel and bearing selection is sized to the duty cycle and load your operation runs.",
    features: [
      "Matched to rail guide and load spec",
      "Wheel and bearing selection for duty cycle",
      "Manual or motorized options",
      "Load-rated to project requirement",
    ],
    image: "/products/trolley.webp",
    gallery: [
      "/products/trolley-1.webp",
      "/products/trolley-2.webp",
    ],
    specs: [
      { label: "Drive", value: "Manual or motorized" },
      { label: "Load Rating", value: "Per project requirement" },
      { label: "Application", value: "Rail / floor-mounted movement" },
    ],
  },
  {
    id: "conveyor-hangars",
    title: "Conveyor Hangars",
    category: "conveyor",
    badge: "Conveyor",
    description:
      "Overhead hangar supports that suspend conveyor lines cleanly from ceilings and steelwork.",
    longDescription:
      "Conveyor hangars suspend conveyor runs from overhead steelwork or ceiling structures, keeping floor space clear beneath the line. Each hangar is engineered for the load and spacing of the conveyor it supports.",
    features: [
      "Engineered for conveyor load and spacing",
      "Suspends from ceiling or overhead steelwork",
      "Keeps floor space clear beneath the line",
      "Painted or galvanized finish",
    ],
    image: "/products/conveyor-hangars.webp",
    gallery: [
      "/products/conveyor-hangars-1.webp",
      "/products/conveyor-hangars-2.webp",
    ],
    specs: [
      { label: "Mounting", value: "Overhead / ceiling suspended" },
      { label: "Finish", value: "Painted or galvanized" },
      { label: "Design", value: "Load & spacing engineered" },
    ],
  },
  {
    id: "turnkey-projects",
    title: "Turnkey Projects",
    category: "project",
    badge: "Turnkey",
    description:
      "End-to-end project delivery, from design and fabrication through installation and handover.",
    longDescription:
      "For larger scopes, we take full turnkey responsibility — design, fabrication, site installation, and handover — coordinated under a single point of contact. This covers everything above delivered as one managed project rather than separate line items.",
    features: [
      "Single point of contact from design to handover",
      "Design, fabrication, and installation included",
      "Coordinated project timeline",
      "Suited to multi-structure or plant-wide scopes",
    ],
    image: "/products/turnkey-projects.webp",
    gallery: [
      "/products/turnkey-projects-1.webp",
      "/products/turnkey-projects-2.webp",
    ],
    specs: [
      { label: "Scope", value: "Design, fabrication, installation" },
      { label: "Management", value: "Single point of contact" },
      { label: "Delivery", value: "Full turnkey handover" },
    ],
  },
];

// ---------- Helpers ----------
// Use these anywhere product data is needed (section, listing page, detail page)
// so all views read from the same source.

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductsByCategory(category: Category): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
