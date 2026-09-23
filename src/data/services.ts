export type Category = "all" | "conveyor" | "assembly" | "platform" | "fabrication";

export interface Spec {
  label: string;
  value: string;
}

export interface Service {
  id: string;
  category: Exclude<Category, "all">;
  badge: string;
  title: string;
  shortTitle?: string;
  description: string;
  contribution: string;
  specs: Spec[];
  image: string;
}

export const SERVICES: Service[] = [
  {
    id: "conveyor-support-structures",
    category: "conveyor",
    badge: "Heavy Duty",
    title: "Conveyor Support Structures",
    shortTitle: "Conveyor Structures",
    description:
      "Engineered structural support frames, bents, and elevated frameworks built for continuous high-load industrial material transfer lines.",
    contribution:
      "At Conbell Engineering, we specialize in delivering high-integrity conveyor support structures tailored for intensive industrial logistics and automated material movement. Our engineering team designs, fabricates, and qualifies heavy structural frames, multi-tier bents, transfer towers, and elevated gantry supports capable of absorbing extreme dynamic loads and cyclic vibration. Every assembly adheres rigorously to IS 800 and AISC 360 structural codes, utilizing automated submerged arc welding, precise CNC hole patterns for rapid on-site bolting, and Sa 2.5 shot-blasted anti-corrosion protective coatings. From automotive assembly lines to bulk material handling plants, our contribution ensures structural longevity, zero operational downtime, and seamless integration with complex drive and idler assemblies.",
    specs: [
      { label: "Applications", value: "Belt, Roller & Slat Conveyors" },
      { label: "Standards", value: "IS 800 / AISC 360 Structural Code" },
      { label: "Finishes", value: "Sa 2.5 Shot Blasting + Epoxy / HDG" },
      { label: "Load Capacity", value: "Engineered for Multi-Ton Continuous Load" },
    ],
    image: "/services/conveyor.webp",
  },
  {
    id: "overhead-conveyor-systems",
    category: "conveyor",
    badge: "Overhead Systems",
    title: "Overhead Conveyor Systems",
    shortTitle: "Overhead Systems",
    description:
      "Specialized suspension structures, monorails, and power & free track systems engineered for automated assembly and continuous material handling.",
    contribution:
      "Conbell Engineering leads the market in precision-engineered overhead conveyor frameworks that maximize floor space and optimize production logistics. Our contribution spans the turnkey fabrication of roof-truss suspension assemblies, floor-supported structural gantries, continuous I-beam monorails, and enclosed track power & free loops. Engineered to strict deflection and torsional limits, our overhead systems maintain laser-calibrated alignment even across multi-curve elevation paths. By integrating high-strength alloy hangers, robotic weld verification, and vibration-dampening mounting brackets, we empower manufacturing plants to transport heavy components through automated pretreatment tunnels, paint baking ovens, and assembly cells with unmatched reliability.",
    specs: [
      { label: "Systems", value: "Monorails & Power & Free Tracks" },
      { label: "Mounting", value: "Roof-Truss / Floor-Supported Gantries" },
      { label: "Tolerances", value: "Precision Laser Track Alignment" },
      { label: "Environment", value: "High Temperature & Paint Line Qualified" },
    ],
    image: "/services/overhead.webp",
  },
  {
    id: "assembly-line-structures",
    category: "assembly",
    badge: "Plant Automation",
    title: "Assembly Line Structures",
    shortTitle: "Assembly Lines",
    description:
      "Modular production line frames, ergonomic operator workstations, conveyor integration skids, and automated line-side staging structures.",
    contribution:
      "Our contribution in assembly line infrastructure centers on driving manufacturing speed, structural rigidity, and operator ergonomics. Conbell Engineering manufactures modular heavy-gauge tubular frames, integrated tool-balancer gantries, automated line-side buffer racks, and conveyor skids engineered to meet lean assembly paradigms. Each structure is fabricated with built-in channels for pneumatic piping, electrical busways, and sensor conduits, enabling turnkey plug-and-play installation on modern factory floors. By pairing precision robotic welding with strict geometric tolerances, we supply Tier-1 automotive and industrial manufacturers with rock-solid, reconfigurable production lines that accelerate throughput and reduce assembly cycle times.",
    specs: [
      { label: "Design", value: "Modular & Ergonomic Integration" },
      { label: "Features", value: "Integrated Tooling & Wiring Runs" },
      { label: "Material", value: "Heavy Industrial Hollow Sections" },
      { label: "Compliance", value: "Lean 5S & Industrial Ergonomics Standards" },
    ],
    image: "/services/assembly-line.webp",
  },
  {
    id: "industrial-platform-walkways",
    category: "platform",
    badge: "Safety Standard",
    title: "Industrial Platform & Walkways",
    shortTitle: "Platforms & Walkways",
    description:
      "Heavy-duty industrial mezzanines, inspection walkways, access stair towers, and OSHA-compliant safety handrails with anti-slip grating.",
    contribution:
      "Safety, regulatory compliance, and rugged access are at the heart of Conbell Engineering's industrial platforms and elevated walkways. We engineer custom multi-tier mezzanines, maintenance crossovers, perimeter cat-walks, stair towers, and safety handrail systems certified to OSHA and IS structural benchmarks. Built with high-strength structural steel beams, hot-dip galvanized finishes, and serrated anti-slip steel gratings, our walkway systems withstand corrosive operating environments, high pedestrian volumes, and heavy maintenance machinery loads. Conbell provides end-to-end design, modular pre-fabrication, and test-assembled structural kits that guarantee effortless on-site assembly with zero disruption to active plant operations.",
    specs: [
      { label: "Compliance", value: "OSHA & IS Safety Standards" },
      { label: "Flooring", value: "Serrated Anti-Slip Grating" },
      { label: "Assembly", value: "Modular Bolted / Welded Systems" },
      { label: "Protection", value: "Heavy-Duty Galvanized / Epoxy Coatings" },
    ],
    image: "/services/industrial-platform-walkways.webp",
  },
  {
    id: "custom-heavy-fabrication",
    category: "fabrication",
    badge: "Bespoke Heavy",
    title: "Custom Heavy Fabrication",
    shortTitle: "Heavy Fabrication",
    description:
      "Large-tonnage machine frames, industrial skids, gantry structures, and bespoke heavy steel fabrications engineered to client 3D CAD blueprints.",
    contribution:
      "Conbell Engineering delivers elite custom heavy fabrication capabilities, transforming intricate engineering blueprints into massive, millimetre-accurate industrial assemblies. Handling structural weldments up to 20 metric tons in a single lift, our heavy fabrication bay features certified AWS D1.1 submerged arc (SAW) and flux-cored (FCAW) welding systems, complemented by high-tonnage CNC hydraulic press brakes and automated shot blasting. We manufacture heavy machine bases, vibratory screen frames, furnace hoods, gantry girders, and chemical process skids with 100% non-destructive testing (NDT), ultrasonic inspection, and post-weld stress relieving. Our contribution gives global OEMs and heavy industries complete confidence in mission-critical structural reliability under extreme fatigue and thermal stress.",
    specs: [
      { label: "Capacity", value: "Up to 20 Ton Single Assemblies" },
      { label: "Welding", value: "AWS D1.1 Certified GMAW / SAW" },
      { label: "Testing", value: "100% Ultrasonic & MPI Tested" },
      { label: "Machining", value: "Post-Fabrication Precision CNC Milling" },
    ],
    image: "/services/custom-heavy-fabrication.webp",
  },
];

export function getServiceById(id: string): Service | undefined {
  if (!id) return undefined;
  const cleanId = decodeURIComponent(id).trim().toLowerCase().replace(/\/+$/, "");
  return SERVICES.find((service) => service.id.toLowerCase() === cleanId);
}

export function getAllServiceIds(): string[] {
  return SERVICES.map((service) => service.id);
}
