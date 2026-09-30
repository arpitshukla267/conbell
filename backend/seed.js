require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Hero = require('./models/Hero');
const Product = require('./models/Product');
const Service = require('./models/Service');
const ProcessStep = require('./models/ProcessStep');
const QualityPoint = require('./models/QualityPoint');
const SiteConfig = require('./models/SiteConfig');
const Faq = require('./models/Faq');
const Client = require('./models/Client');
const Job = require('./models/Job');

const HERO_SLIDES = [
  {
    heading: "Precision Metal Manufacturing.",
    accentHeading: "Engineered for Industrial Excellence.",
    subtext: "Delivering end-to-end heavy fabrication, precision CNC machining, and specialized metal structures with strict dimensional tolerance control, certified metallurgy, and reliable turnkey project deployment.",
    imageDesktop: "/hero/hero1.webp",
    imageMobile: "/hero/hero1-mobile.webp",
    order: 1,
    isActive: true,
  },
  {
    heading: "Certified Quality Systems.",
    accentHeading: "ISO-Compliant From Start to Finish.",
    subtext: "Every component passes through rigorous inspection, full material traceability, and documented quality control to meet the strictest industrial standards.",
    imageDesktop: "/hero/hero2.webp",
    imageMobile: "/hero/hero2-mobile.webp",
    order: 2,
    isActive: true,
  },
  {
    heading: "Turnkey Project Deployment.",
    accentHeading: "From Blueprint to Installed Structure.",
    subtext: "Our teams manage design review, fabrication, finishing, and on-site installation, so your project moves forward without coordination gaps.",
    imageDesktop: "/hero/hero3.webp",
    imageMobile: "/hero/hero3-mobile.webp",
    order: 3,
    isActive: true,
  },
];

const PRODUCTS = [
  {
    slug: "conveyor-structure",
    title: "Conveyor Structure",
    category: "conveyor",
    badge: "Conveyor",
    description: "Heavy-duty support structures engineered to carry conveyor lines across your facility with long-term stability.",
    longDescription: "Our conveyor structures are designed and fabricated to support material handling lines of any length or load, from single straight runs to complex multi-level layouts. Every structure is engineered around the specific belt width, load, and span of the project, then fabricated and finished for a long service life in demanding plant environments.",
    features: [
      "Engineered for site-specific span and load",
      "Bolted or welded assembly options",
      "Painted or hot-dip galvanized finish",
      "Compatible with overhead and ground-mounted runs"
    ],
    image: "/products/conveyor-structure.webp",
    gallery: [
      "/products/conveyor-structure-1.webp",
      "/products/conveyor-structure-2.webp"
    ],
    specs: [
      { label: "Material", value: "MS / GI structural steel" },
      { label: "Finish", value: "Painted or galvanized" },
      { label: "Design", value: "Custom span & load rating" }
    ],
    order: 1,
    isActive: true
  },
  {
    slug: "mezzanine-floor",
    title: "Mezzanine Floor",
    category: "structural",
    badge: "Structural",
    description: "Multi-level steel mezzanine floors that add usable working or storage area without expanding your building footprint.",
    longDescription: "Mezzanine floors are a fast way to add working, storage, or office area within your existing building height. We design modular, bolted steel structures sized to your column grid and load requirements, with flooring, staircases, and handrailing supplied as a complete package.",
    features: [
      "Modular, bolted assembly for fast installation",
      "Chequered plate or grating floor options",
      "Integrated staircases and handrails available",
      "Designed to your load and layout requirements"
    ],
    image: "/products/mezzanine-floor.webp",
    gallery: [
      "/products/mezzanine-floor-1.webp",
      "/products/mezzanine-floor-2.webp"
    ],
    specs: [
      { label: "Load Capacity", value: "Up to project spec" },
      { label: "Flooring", value: "Chequered plate / grating" },
      { label: "Design", value: "Modular, bolted assembly" }
    ],
    order: 2,
    isActive: true
  },
  {
    slug: "safety-rail-toe-guard",
    title: "Safety Rail & Toe Guard",
    category: "safety",
    badge: "Safety",
    description: "Handrails and toe guards fabricated to industrial safety standards, protecting personnel on elevated walkways and platforms.",
    longDescription: "Safety rails and toe guards are fabricated to fit any platform, catwalk, or staircase edge, keeping personnel and equipment protected on elevated work areas. Every run is measured and fabricated to the site layout, with consistent finish and mounting across the full installation.",
    features: [
      "Fits platforms, catwalks, and staircases",
      "Site-measured for an exact fit",
      "Consistent height and mounting throughout",
      "Painted or galvanized finish options"
    ],
    image: "/products/safety-rail-toe-guard.webp",
    gallery: [
      "/products/safety-rail-toe-guard-1.webp",
      "/products/safety-rail-toe-guard-2.webp"
    ],
    specs: [
      { label: "Standard", value: "Industrial safety compliant" },
      { label: "Material", value: "MS pipe / angle" },
      { label: "Application", value: "Platforms, catwalks, stairs" }
    ],
    order: 3,
    isActive: true
  },
  {
    slug: "catwalk-structure-support",
    title: "Catwalk Structure with Support",
    category: "structural",
    badge: "Structural",
    description: "Elevated catwalk structures with engineered support columns, built for safe access and inspection routes.",
    longDescription: "Catwalk structures provide safe, elevated access for inspection and maintenance routes across plant equipment. Each structure is engineered with its own support columns and bracketry, so the walkway can be routed exactly where your process needs it.",
    features: [
      "Engineered support columns and brackets",
      "Routed to your process layout",
      "Ladder or staircase access points",
      "Handrail and toe guard ready"
    ],
    image: "/products/catwalk-structure-support.webp",
    gallery: [
      "/products/catwalk-structure-support-1.webp",
      "/products/catwalk-structure-support-2.webp"
    ],
    specs: [
      { label: "Access", value: "Ladders / staircases integrated" },
      { label: "Support", value: "Column & bracket system" },
      { label: "Design", value: "Site-specific layout" }
    ],
    order: 4,
    isActive: true
  },
  {
    slug: "screen-guard-hanger-support-rail",
    title: "Screen Guard & Hanger, Support, Rail",
    category: "safety",
    badge: "Safety",
    description: "Protective screen guards along with hangers, supports, and rails, fabricated to shield equipment and walkways.",
    longDescription: "This package covers screen guards, hangers, supports, and rails supplied together as a single protective system. It's fabricated to shield equipment, conveyor lines, and walkways from debris and material spillage, with all components matched for a clean, consistent installation.",
    features: [
      "Screen, hanger, support, and rail supplied together",
      "Shields equipment and walkways from debris",
      "Matched components for a consistent finish",
      "MS or wire mesh options"
    ],
    image: "/products/screen-guard-hanger-support-rail.png",
    gallery: [
      "/products/screen-guard-hanger-support-rail-1.webp",
      "/products/screen-guard-hanger-support-rail-2.webp"
    ],
    specs: [
      { label: "Components", value: "Screen, hanger, support, rail" },
      { label: "Material", value: "MS / wire mesh" },
      { label: "Use", value: "Equipment & walkway protection" }
    ],
    order: 5,
    isActive: true
  },
  {
    slug: "rail-guide",
    title: "Rail Guide",
    category: "structural",
    badge: "Structural",
    description: "Precision-fabricated rail guides that keep moving loads and equipment tracking accurately along their path.",
    longDescription: "Rail guides keep moving loads, trolleys, and equipment tracking accurately along a fixed path. We fabricate them to close tolerances in wear-resistant steel, so alignment holds up under repeated use.",
    features: [
      "Close-tolerance fabrication",
      "Wear-resistant steel options",
      "Straight and curved runs available",
      "Matched to your trolley or load system"
    ],
    image: "/products/rail-guide.webp",
    gallery: [
      "/products/rail-guide-1.webp",
      "/products/rail-guide-2.webp"
    ],
    specs: [
      { label: "Material", value: "MS / wear-resistant steel" },
      { label: "Tolerance", value: "Close-tolerance machining" },
      { label: "Application", value: "Guided load movement" }
    ],
    order: 6,
    isActive: true
  },
  {
    slug: "special-fabrication-job",
    title: "Special Fabrication Job",
    category: "fabrication",
    badge: "Fabrication",
    description: "Custom fabrication covering foundation work, EPC projects, and civil projects, tailored to specific project requirements.",
    longDescription: "Beyond standard structures, we take on custom fabrication work covering foundation work, EPC scopes, and civil projects. Each job is scoped around the specific project requirement and delivered end-to-end, from design through execution.",
    features: [
      "Foundation, EPC, and civil work",
      "Custom, project-based scoping",
      "End-to-end execution",
      "Coordinated with your project timeline"
    ],
    image: "/products/special-fabrication-job.webp",
    gallery: [
      "/products/special-fabrication-job-1.webp",
      "/products/special-fabrication-job-2.webp"
    ],
    specs: [
      { label: "Scope", value: "Foundation, EPC, civil work" },
      { label: "Approach", value: "Custom, project-based" },
      { label: "Delivery", value: "End-to-end execution" }
    ],
    order: 7,
    isActive: true
  },
  {
    slug: "heavy-structure",
    title: "Heavy Structure",
    category: "structural",
    badge: "Structural",
    description: "Heavy steel structures fabricated and erected for high-load industrial applications and large equipment support.",
    longDescription: "Heavy structures form the backbone of large industrial installations — supporting major equipment, process units, and building frames. We handle the full scope from design and fabrication through to site erection, built to carry high, sustained loads.",
    features: [
      "High-load structural design",
      "Fabrication through to site erection",
      "Suited to process units and building frames",
      "Quality-checked welds and joints"
    ],
    image: "/products/heavy-structure.webp",
    gallery: [
      "/products/heavy-structure-1.webp",
      "/products/heavy-structure-2.webp"
    ],
    specs: [
      { label: "Material", value: "Structural steel (MS)" },
      { label: "Application", value: "Equipment & building support" },
      { label: "Delivery", value: "Fabrication + erection" }
    ],
    order: 8,
    isActive: true
  },
  {
    slug: "tanks",
    title: "Tanks",
    category: "fabrication",
    badge: "Fabrication",
    description: "Fabricated storage and process tanks built to your capacity, pressure, and material handling requirements.",
    longDescription: "We fabricate storage and process tanks to the capacity, pressure, and material specification your process calls for. Each tank is built and tested to hold its rated volume safely, with mounting and access fittings arranged for your site layout.",
    features: [
      "Custom capacity and dimensions",
      "MS / SS material options",
      "Access ladders, nozzles, and fittings",
      "Tested before dispatch"
    ],
    image: "/products/tanks.png",
    gallery: ["/products/tanks-1.webp", "/products/tanks-2.webp"],
    specs: [
      { label: "Material", value: "MS / SS" },
      { label: "Capacity", value: "Built to project spec" },
      { label: "Testing", value: "Pressure / leak tested" }
    ],
    order: 9,
    isActive: true
  },
  {
    slug: "handrails",
    title: "Handrails",
    category: "safety",
    badge: "Safety",
    description: "Sturdy handrails fabricated for staircases, platforms, and walkways, sized and finished to match your site.",
    longDescription: "Handrails are fabricated to fit staircases, platforms, and walkways of any layout, giving personnel a secure grip point along elevated or high-traffic areas. Runs are measured on site and finished to match the rest of your structure.",
    features: [
      "Fits staircases, platforms, and walkways",
      "Site-measured for an exact fit",
      "Painted or galvanized finish",
      "Matched to existing structure finish"
    ],
    image: "/products/handrails.webp",
    gallery: [
      "/products/handrails-1.webp",
      "/products/handrails-2.webp"
    ],
    specs: [
      { label: "Material", value: "MS pipe / angle" },
      { label: "Finish", value: "Painted or galvanized" },
      { label: "Application", value: "Stairs, platforms, walkways" }
    ],
    order: 10,
    isActive: true
  },
  {
    slug: "platforms",
    title: "Platforms",
    category: "structural",
    badge: "Structural",
    description: "Elevated steel platforms built for equipment access, operation, and maintenance at height.",
    longDescription: "Elevated platforms give operators and maintenance crews safe access to equipment at height. Each platform is engineered for its load and footprint, complete with flooring, access points, and railing to match the rest of your site's structures.",
    features: [
      "Engineered for load and footprint",
      "Chequered plate or grating flooring",
      "Integrated access and railing",
      "Fixed or modular designs"
    ],
    image: "/products/platforms.webp",
    gallery: [
      "/products/platforms-1.webp",
      "/products/platforms-2.webp"
    ],
    specs: [
      { label: "Flooring", value: "Chequered plate / grating" },
      { label: "Design", value: "Fixed or modular" },
      { label: "Application", value: "Equipment access & maintenance" }
    ],
    order: 11,
    isActive: true
  },
  {
    slug: "paint-booth",
    title: "Paint Booth",
    category: "fabrication",
    badge: "Fabrication",
    description: "Fabricated paint booths designed for controlled, efficient, and safe spray-painting operations.",
    longDescription: "Our paint booths are fabricated to contain overspray and maintain controlled airflow for consistent, safe spray-painting operations. Sizing and ventilation are matched to the parts you're finishing and your facility's throughput.",
    features: [
      "Controlled airflow and overspray containment",
      "Sized to your part range and throughput",
      "Lighting and access points included",
      "Panel or modular construction"
    ],
    image: "/products/paint-booth.webp",
    gallery: [
      "/products/paint-booth-1.webp",
      "/products/paint-booth-2.webp"
    ],
    specs: [
      { label: "Construction", value: "Panel / modular steel" },
      { label: "Airflow", value: "Controlled ventilation" },
      { label: "Design", value: "Sized to part range" }
    ],
    order: 12,
    isActive: true
  },
  {
    slug: "trolley",
    title: "Trolley",
    category: "conveyor",
    badge: "Conveyor",
    description: "Material handling trolleys built for smooth, reliable movement of loads along rail or floor-mounted tracks.",
    longDescription: "Trolleys are fabricated for smooth, repeatable movement of loads along rail or floor-mounted tracks, matched to your rail guide and load specification. Wheel and bearing selection is sized to the duty cycle and load your operation runs.",
    features: [
      "Matched to rail guide and load spec",
      "Wheel and bearing selection for duty cycle",
      "Manual or motorized options",
      "Load-rated to project requirement"
    ],
    image: "/products/trolley.webp",
    gallery: [
      "/products/trolley-1.webp",
      "/products/trolley-2.webp"
    ],
    specs: [
      { label: "Drive", value: "Manual or motorized" },
      { label: "Load Rating", value: "Per project requirement" },
      { label: "Application", value: "Rail / floor-mounted movement" }
    ],
    order: 13,
    isActive: true
  },
  {
    slug: "conveyor-hangars",
    title: "Conveyor Hangars",
    category: "conveyor",
    badge: "Conveyor",
    description: "Overhead hangar supports that suspend conveyor lines cleanly from ceilings and steelwork.",
    longDescription: "Conveyor hangars suspend conveyor runs from overhead steelwork or ceiling structures, keeping floor space clear beneath the line. Each hangar is engineered for the load and spacing of the conveyor it supports.",
    features: [
      "Engineered for conveyor load and spacing",
      "Suspends from ceiling or overhead steelwork",
      "Keeps floor space clear beneath the line",
      "Painted or galvanized finish"
    ],
    image: "/products/conveyor-hangars.webp",
    gallery: [
      "/products/conveyor-hangars-1.webp",
      "/products/conveyor-hangars-2.webp"
    ],
    specs: [
      { label: "Mounting", value: "Overhead / ceiling suspended" },
      { label: "Finish", value: "Painted or galvanized" },
      { label: "Design", value: "Load & spacing engineered" }
    ],
    order: 14,
    isActive: true
  },
  {
    slug: "turnkey-projects",
    title: "Turnkey Projects",
    category: "project",
    badge: "Turnkey",
    description: "End-to-end project delivery, from design and fabrication through installation and handover.",
    longDescription: "For larger scopes, we take full turnkey responsibility — design, fabrication, site installation, and handover — coordinated under a single point of contact. This covers everything above delivered as one managed project rather than separate line items.",
    features: [
      "Single point of contact from design to handover",
      "Design, fabrication, and installation included",
      "Coordinated project timeline",
      "Suited to multi-structure or plant-wide scopes"
    ],
    image: "/products/turnkey-projects.webp",
    gallery: [
      "/products/turnkey-projects-1.webp",
      "/products/turnkey-projects-2.webp"
    ],
    specs: [
      { label: "Scope", value: "Design, fabrication, installation" },
      { label: "Management", value: "Single point of contact" },
      { label: "Delivery", value: "Full turnkey handover" }
    ],
    order: 15,
    isActive: true
  }
];

const SERVICES = [
  {
    slug: "conveyor-support-structures",
    category: "conveyor",
    badge: "Heavy Duty",
    title: "Conveyor Support Structures",
    shortTitle: "Conveyor Structures",
    description: "Engineered structural support frames, bents, and elevated frameworks built for continuous high-load industrial material transfer lines.",
    contribution: "At Conbell Engineering, we specialize in delivering high-integrity conveyor support structures tailored for intensive industrial logistics and automated material movement. Our engineering team designs, fabricates, and qualifies heavy structural frames, multi-tier bents, transfer towers, and elevated gantry supports capable of absorbing extreme dynamic loads and cyclic vibration. Every assembly adheres rigorously to IS 800 and AISC 360 structural codes, utilizing automated submerged arc welding, precise CNC hole patterns for rapid on-site bolting, and Sa 2.5 shot-blasted anti-corrosion protective coatings. From automotive assembly lines to bulk material handling plants, our contribution ensures structural longevity, zero operational downtime, and seamless integration with complex drive and idler assemblies.",
    specs: [
      { label: "Applications", value: "Belt, Roller & Slat Conveyors" },
      { label: "Standards", value: "IS 800 / AISC 360 Structural Code" },
      { label: "Finishes", value: "Sa 2.5 Shot Blasting + Epoxy / HDG" },
      { label: "Load Capacity", value: "Engineered for Multi-Ton Continuous Load" }
    ],
    image: "/services/conveyor.webp",
    order: 1,
    isActive: true
  },
  {
    slug: "overhead-conveyor-systems",
    category: "conveyor",
    badge: "Overhead Systems",
    title: "Overhead Conveyor Systems",
    shortTitle: "Overhead Systems",
    description: "Specialized suspension structures, monorails, and power & free track systems engineered for automated assembly and continuous material handling.",
    contribution: "Conbell Engineering leads the market in precision-engineered overhead conveyor frameworks that maximize floor space and optimize production logistics. Our contribution spans the turnkey fabrication of roof-truss suspension assemblies, floor-supported structural gantries, continuous I-beam monorails, and enclosed track power & free loops. Engineered to strict deflection and torsional limits, our overhead systems maintain laser-calibrated alignment even across multi-curve elevation paths. By integrating high-strength alloy hangers, robotic weld verification, and vibration-dampening mounting brackets, we empower manufacturing plants to transport heavy components through automated pretreatment tunnels, paint baking ovens, and assembly cells with unmatched reliability.",
    specs: [
      { label: "Systems", value: "Monorails & Power & Free Tracks" },
      { label: "Mounting", value: "Roof-Truss / Floor-Supported Gantries" },
      { label: "Tolerances", value: "Precision Laser Track Alignment" },
      { label: "Environment", value: "High Temperature & Paint Line Qualified" }
    ],
    image: "/services/overhead.webp",
    order: 2,
    isActive: true
  },
  {
    slug: "assembly-line-structures",
    category: "assembly",
    badge: "Plant Automation",
    title: "Assembly Line Structures",
    shortTitle: "Assembly Lines",
    description: "Modular production line frames, ergonomic operator workstations, conveyor integration skids, and automated line-side staging structures.",
    contribution: "Our contribution in assembly line infrastructure centers on driving manufacturing speed, structural rigidity, and operator ergonomics. Conbell Engineering manufactures modular heavy-gauge tubular frames, integrated tool-balancer gantries, automated line-side buffer racks, and conveyor skids engineered to meet lean assembly paradigms. Each structure is fabricated with built-in channels for pneumatic piping, electrical busways, and sensor conduits, enabling turnkey plug-and-play installation on modern factory floors. By pairing precision robotic welding with strict geometric tolerances, we supply Tier-1 automotive and industrial manufacturers with rock-solid, reconfigurable production lines that accelerate throughput and reduce assembly cycle times.",
    specs: [
      { label: "Design", value: "Modular & Ergonomic Integration" },
      { label: "Features", value: "Integrated Tooling & Wiring Runs" },
      { label: "Material", value: "Heavy Industrial Hollow Sections" },
      { label: "Compliance", value: "Lean 5S & Industrial Ergonomics Standards" }
    ],
    image: "/services/assembly-line.webp",
    order: 3,
    isActive: true
  },
  {
    slug: "industrial-platform-walkways",
    category: "platform",
    badge: "Safety Standard",
    title: "Industrial Platform & Walkways",
    shortTitle: "Platforms & Walkways",
    description: "Heavy-duty industrial mezzanines, inspection walkways, access stair towers, and OSHA-compliant safety handrails with anti-slip grating.",
    contribution: "Safety, regulatory compliance, and rugged access are at the heart of Conbell Engineering's industrial platforms and elevated walkways. We engineer custom multi-tier mezzanines, maintenance crossovers, perimeter cat-walks, stair towers, and safety handrail systems certified to OSHA and IS structural benchmarks. Built with high-strength structural steel beams, hot-dip galvanized finishes, and serrated anti-slip steel gratings, our walkway systems withstand corrosive operating environments, high pedestrian volumes, and heavy maintenance machinery loads. Conbell provides end-to-end design, modular pre-fabrication, and test-assembled structural kits that guarantee effortless on-site assembly with zero disruption to active plant operations.",
    specs: [
      { label: "Compliance", value: "OSHA & IS Safety Standards" },
      { label: "Flooring", value: "Serrated Anti-Slip Grating" },
      { label: "Assembly", value: "Modular Bolted / Welded Systems" },
      { label: "Protection", value: "Heavy-Duty Galvanized / Epoxy Coatings" }
    ],
    image: "/services/industrial-platform-walkways.webp",
    order: 4,
    isActive: true
  },
  {
    slug: "custom-heavy-fabrication",
    category: "fabrication",
    badge: "Bespoke Heavy",
    title: "Custom Heavy Fabrication",
    shortTitle: "Heavy Fabrication",
    description: "Large-tonnage machine frames, industrial skids, gantry structures, and bespoke heavy steel fabrications engineered to client 3D CAD blueprints.",
    contribution: "Conbell Engineering delivers elite custom heavy fabrication capabilities, transforming intricate engineering blueprints into massive, millimetre-accurate industrial assemblies. Handling structural weldments up to 20 metric tons in a single lift, our heavy fabrication bay features certified AWS D1.1 submerged arc (SAW) and flux-cored (FCAW) welding systems, complemented by high-tonnage CNC hydraulic press brakes and automated shot blasting. We manufacture heavy machine bases, vibratory screen frames, furnace hoods, gantry girders, and chemical process skids with 100% non-destructive testing (NDT), ultrasonic inspection, and post-weld stress relieving. Our contribution gives global OEMs and heavy industries complete confidence in mission-critical structural reliability under extreme fatigue and thermal stress.",
    specs: [
      { label: "Capacity", value: "Up to 20 Ton Single Assemblies" },
      { label: "Welding", value: "AWS D1.1 Certified GMAW / SAW" },
      { label: "Testing", value: "100% Ultrasonic & MPI Tested" },
      { label: "Machining", value: "Post-Fabrication Precision CNC Milling" }
    ],
    image: "/services/custom-heavy-fabrication.webp",
    order: 5,
    isActive: true
  }
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Design",
    description: "Comprehensive 3D CAD modeling, structural engineering analysis, and conveyor layout optimization tailored to plant requirements.",
    highlights: ["3D CAD Modeling", "Structural Analysis", "Custom Engineering"],
    order: 1,
    isActive: true,
  },
  {
    number: "02",
    title: "Manufacturing",
    description: "High-precision fabrication, multi-axis CNC machining, high-wattage fiber laser cutting, and certified structural welding.",
    highlights: ["Laser Cutting", "CNC Machining", "Certified Welding"],
    order: 2,
    isActive: true,
  },
  {
    number: "03",
    title: "Supply",
    description: "Reliable pan-India dispatch coordination, protective transit packaging, and on-schedule delivery directly to project sites.",
    highlights: ["Pan-India Logistics", "On-Time Dispatch", "Material Tracking"],
    order: 3,
    isActive: true,
  },
  {
    number: "04",
    title: "Installation",
    description: "Turnkey on-site erection, precision alignment, safety protocol compliance, and seamless operational handover.",
    highlights: ["On-Site Erection", "Laser Alignment", "Safety Handover"],
    order: 4,
    isActive: true,
  },
];

const QUALITY_POINTS = [
  {
    number: "01",
    title: "Precision, Reliability & Durability",
    description: "Ensuring precision, reliability, and durability in all our products and services.",
    order: 1,
    isActive: true,
  },
  {
    number: "02",
    title: "Process-Driven Quality System",
    description: "Adopting a process-driven Quality Management System in line with ISO standards.",
    order: 2,
    isActive: true,
  },
  {
    number: "03",
    title: "Strict Quality Control",
    description: "Maintaining strict quality control from material procurement to final delivery.",
    order: 3,
    isActive: true,
  },
  {
    number: "04",
    title: "On-Time & Defect-Free Execution",
    description: "Enhancing customer satisfaction through on-time delivery and defect-free execution.",
    order: 4,
    isActive: true,
  },
  {
    number: "05",
    title: "Continuous Improvement",
    description: "Continuously improving our processes, systems, and skills through training, innovation, and performance monitoring.",
    order: 5,
    isActive: true,
  },
  {
    number: "06",
    title: "Quality Culture & Teamwork",
    description: "Promoting a culture of quality awareness, responsibility, and teamwork across all levels of the organization.",
    order: 6,
    isActive: true,
  },
];

const SITE_CONFIGS = [
  {
    key: "contact",
    value: {
      companyName: "Conbell Engineering Private Limited",
      brandName: "Conbell Engineering",
      tagline: "A trusted engineering partner delivering precision fabrication and industrial solutions",
      email: "info@conbellengineering.com",
      phone: "+919586610281",
      phoneDisplay: "+91-95866 10281",
      addressLines: [
        "Survey No. 298/A, Vadavswami-Ambapura Road",
        "Village: Vadavswami, Ta.: Kalol (N.G) – 382740, Gujarat."
      ],
      social: { facebook: "", instagram: "", linkedin: "", whatsapp: "919586610281" },
      copyrightTagline: "Copyright © ConBell Engineering Pvt Ltd 2026-27"
    }
  }
];

const FAQS = [
  {
    question: "What types of metals and alloy grades do you manufacture & fabricate?",
    answer: "We fabricate across Stainless Steel (SS304, SS316, SS316L), Mild Steel (IS 2062 Grade E250/E350), Carbon Steels (EN8, EN9, EN24, EN31), Aluminum Alloys (6061-T6, 5052), Brass, and Copper alloys. All materials arrive with mill test certificates (MTC).",
    order: 1,
    isActive: true
  },
  {
    question: "Do you manufacture custom parts directly from client 2D and 3D CAD files?",
    answer: "Yes — our application engineering desk works directly from client-supplied DXF, STEP, IGES, and native CAD files, with design-for-manufacturability feedback provided before production begins.",
    order: 2,
    isActive: true
  },
  {
    question: "What are your standard tolerances for CNC machining and sheet metal work?",
    answer: "CNC machining holds tolerances as tight as ±0.01mm on critical features, while sheet metal laser cutting and bending typically holds ±0.1mm depending on material thickness and part geometry.",
    order: 3,
    isActive: true
  },
  {
    question: "What is your typical lead time for initial prototypes versus bulk production?",
    answer: "Prototypes are typically delivered in 5-7 business days. Bulk production lead times range from 2-4 weeks depending on order volume, material availability, and finishing requirements.",
    order: 4,
    isActive: true
  },
  {
    question: "Do you provide material test certificates and quality inspection reports?",
    answer: "Every batch ships with EN 10204 3.1 material test certificates, dimensional CMM inspection reports, and NDT test records where applicable.",
    order: 5,
    isActive: true
  },
  {
    question: "Can Conbell Engineering handle turnkey site delivery and installation across India?",
    answer: "Yes, we manage end-to-end logistics including packaging, freight, on-site installation, and commissioning support for structural and heavy fabrication projects pan-India.",
    order: 6,
    isActive: true
  }
];

const CLIENTS = [
  { name: "Combat Engineering India Pvt Ltd", logo: "/clients/logos/1.png", order: 1, isActive: true },
  { name: "Maruti Suzuki India Ltd", logo: "/clients/logos/2.jpg", order: 2, isActive: true },
  { name: "M & B Engineering Ltd", logo: "/clients/logos/3.jpg", order: 3, isActive: true },
  { name: "Takenaka", logo: "/clients/logos/3.png", order: 4, isActive: true },
  { name: "Agrawal Metal Works Pvt Ltd", logo: "/clients/logos/4.png", order: 5, isActive: true },
  { name: "NKC", logo: "/clients/logos/5.png", order: 6, isActive: true },
  { name: "Daifuku", logo: "/clients/logos/6.png", order: 7, isActive: true },
  { name: "Suroj Buildcon Pvt Ltd", logo: "/clients/logos/7.webp", order: 8, isActive: true },
  { name: "KEI", logo: "/clients/logos/8.png", order: 9, isActive: true },
  { name: "Durr", logo: "/clients/logos/9.png", order: 10, isActive: true },
  { name: "Honda Motors", logo: "/clients/logos/10.png", order: 11, isActive: true },
];

const JOBS = [
  {
    title: "Senior Structural Design Engineer",
    department: "Engineering & CAD/CAM",
    location: "Kalol, Gujarat (On-site)",
    type: "Full-time",
    experience: "4-7 Years",
    description: "Lead 3D modeling, stress analysis, and fabrication drawing release for heavy industrial structures and automated conveyor systems.",
    requirements: [
      "Degree in Mechanical / Civil / Structural Engineering",
      "Proficiency in SolidWorks, AutoCAD, and Tekla / STAAD Pro",
      "In-depth knowledge of IS 800 and AISC structural steel design codes",
      "Experience interfacing with fabrication floor teams"
    ],
    responsibilities: [
      "Translate client RFQ blueprints into manufacturable 3D CAD/STEP models",
      "Perform load calculation and static structural analysis for conveyor gantries and platforms",
      "Collaborate with production team for weldment fixtures and assembly tolerance checks"
    ],
    order: 1,
    isActive: true
  },
  {
    title: "CNC Machine Programmer & Operator",
    department: "Manufacturing Operations",
    location: "Kalol, Gujarat (On-site)",
    type: "Full-time",
    experience: "3-5 Years",
    description: "Program and operate multi-axis CNC milling, turning, and high-wattage fiber laser cutting beds to tight micron-level tolerances.",
    requirements: [
      "Diploma in Mechanical Engineering or certified ITI machinist",
      "Expertise in G-code / M-code programming and Siemens / Fanuc controllers",
      "Hands-on experience with coordinate measuring machines (CMM) and digital verniers",
      "Strong understanding of cutting tools, feeds, and metallurgical speeds"
    ],
    responsibilities: [
      "Set up cutting parameters for laser cutting and CNC press brakes",
      "Perform first-piece inspection and continuous dimensional QC verification",
      "Maintain preventative maintenance logs and equipment calibration"
    ],
    order: 2,
    isActive: true
  },
  {
    title: "Quality Assurance (QA/QC) Engineer",
    department: "Quality & Compliance",
    location: "Kalol, Gujarat (On-site)",
    type: "Full-time",
    experience: "2-5 Years",
    description: "Oversee material inspection, welding NDT procedures, and ISO 9001:2015 quality management compliance.",
    requirements: [
      "Degree/Diploma in Mechanical or Metallurgical Engineering",
      "ASNT Level II certification in NDT (UT, MPT, DPT) preferred",
      "Familiarity with ISO 9001 QMS documentation and mill test certificates (MTC)",
      "Strong attention to detail and zero-defect quality mindset"
    ],
    responsibilities: [
      "Perform raw material inward inspection and cross-check supplier MTCs",
      "Conduct in-process weld inspection and final dimensional checks against CAD drawings",
      "Prepare customer quality dispatch dossiers and CMM inspection certificates"
    ],
    order: 3,
    isActive: true
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await Hero.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    await ProcessStep.deleteMany({});
    await QualityPoint.deleteMany({});
    await SiteConfig.deleteMany({});
    await Faq.deleteMany({});
    await Client.deleteMany({});
    await Job.deleteMany({});

    // Seed
    await Hero.insertMany(HERO_SLIDES);
    console.log(`Seeded ${HERO_SLIDES.length} Hero slides`);

    await Product.insertMany(PRODUCTS);
    console.log(`Seeded ${PRODUCTS.length} Products`);

    await Service.insertMany(SERVICES);
    console.log(`Seeded ${SERVICES.length} Services`);

    await ProcessStep.insertMany(PROCESS_STEPS);
    console.log(`Seeded ${PROCESS_STEPS.length} Process Steps`);

    await QualityPoint.insertMany(QUALITY_POINTS);
    console.log(`Seeded ${QUALITY_POINTS.length} Quality Points`);

    await Faq.insertMany(FAQS);
    console.log(`Seeded ${FAQS.length} FAQs`);

    await Client.insertMany(CLIENTS);
    console.log(`Seeded ${CLIENTS.length} Clients`);

    await Job.insertMany(JOBS);
    console.log(`Seeded ${JOBS.length} Jobs`);

    for (const conf of SITE_CONFIGS) {
      await SiteConfig.create(conf);
    }
    console.log(`Seeded ${SITE_CONFIGS.length} Site Configs`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
