import { Manrope, Inter } from "next/font/google";
import {
  Car,
  Shield,
  Building2,
  Forklift,
  Zap,
  Settings,
  type LucideIcon,
} from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export interface IndustryCard {
  /** Icon component (lucide-react or any component accepting `size`/`className`) */
  icon: LucideIcon;
  /** Small pill label shown top-right of the card, e.g. "Tier-1 & OEM" */
  label: string;
  /** Card heading, e.g. "Automotive Sector" */
  title: string;
  /** Card description paragraph */
  description: string;
  /** Bold lead-in for the supplied line, e.g. "Supplied:" */
  suppliedLabel: string;
  /** Rest of the supplied line, e.g. "Suspension brackets, stamped subassemblies, fixtures" */
  suppliedText: string;
}

export interface ApplicationProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  cards?: IndustryCard[];
}

const DEFAULT_CARDS: IndustryCard[] = [
  {
    icon: Car,
    label: "Tier-1 & OEM",
    title: "Automotive Sector",
    description:
      "Precision chassis brackets, engine mounting brackets, high-tensile fasteners, and robotic assembly welding fixtures.",
    suppliedLabel: "Supplied:",
    suppliedText: "Suspension brackets, stamped subassemblies, fixtures",
  },
  {
    icon: Shield,
    label: "High Reliability",
    title: "Defense & Heavy Industry",
    description:
      "High-strength armor plating structures, precision machined housings, rugged mounts, and heavy vehicle undercarriage weldments.",
    suppliedLabel: "Supplied:",
    suppliedText: "Armored panels, structural cradles, precision housings",
  },
  {
    icon: Building2,
    label: "EPC & Structural",
    title: "Infrastructure & Construction",
    description:
      "Heavy structural steel framing, pre-engineered building (PEB) components, support gantries, and architectural assemblies.",
    suppliedLabel: "Supplied:",
    suppliedText: "Welded I-beams, gantry skids, seismic anchor plates",
  },
  {
    icon: Forklift,
    label: "Material Handling",
    title: "Logistics & Conveyors",
    description:
      "Overhead power & free conveyor rails, roller track frames, automated storage pallets, and sorting transfer structures.",
    suppliedLabel: "Supplied:",
    suppliedText: "Turn rails, conveyor trolleys, heavy storage racks",
  },
  {
    icon: Zap,
    label: "Utilities & Grid",
    title: "Energy & Power Sector",
    description:
      "Turbine mounting brackets, generator soundproof housings, high-voltage transformer frames, and substation switchyard hardware.",
    suppliedLabel: "Supplied:",
    suppliedText: "Transformer tanks, substation bus-bar brackets, panels",
  },
  {
    icon: Settings,
    label: "General Engineering",
    title: "General Engineering & OEMs",
    description:
      "Custom batch fabrication, machined manifolds, hydraulic flanges, and mechanical assembly wear components.",
    suppliedLabel: "Supplied:",
    suppliedText: "Flanges, spacers, pneumatic blocks, custom tooling",
  },
];

export default function Application({
  eyebrow = "APPLICATION HORIZONS",
  heading = "Industries We Serve",
  subheading = "Supporting leading OEM manufacturers, EPC contractors, and engineering leaders across diverse industrial sectors with bespoke metal solutions.",
  cards = DEFAULT_CARDS,
}: ApplicationProps) {
  return (
    <section
      aria-labelledby="industries-heading"
      className={`${inter.className} bg-[#EFF4FF] px-6 py-16`}
    >
      <div className="mx-auto max-w-[95%]">
        <div className="mx-auto max-w-[90vw] text-center">
          <p className="text-[13px] font-semibold tracking-wider text-[#00355F]">
            {eyebrow}
          </p>
          <h2
            id="industries-heading"
            className={`${manrope.className} mt-2 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
          >
            {heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5B5E67]">
            {subheading}
          </p>
        </div>

        <div className="max-w-full mx-auto mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            const headingId = `industry-card-${card.title
              .toLowerCase()
              .replace(/\s+/g, "-")}`;

            return (
              <article
                key={card.title}
                aria-labelledby={headingId}
                className="rounded-2xl bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DCE9FF]">
                    <Icon size={18} className="text-[#00355F]" />
                  </div>
                  <span className="rounded-full bg-[#DCE9FF] px-3 py-1 text-[11px] font-semibold text-[#00355F]">
                    {card.label}
                  </span>
                </div>

                <h3
                  id={headingId}
                  className={`${manrope.className} mt-4 text-lg font-bold text-[#0B1C30]`}
                >
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5B5E67]">
                  {card.description}
                </p>

                <p className="mt-4 text-sm leading-relaxed">
                  <span className="font-semibold text-[#00355F]">
                    &bull; {card.suppliedLabel}
                  </span>{" "}
                  <span className="text-[#42474F]">{card.suppliedText}</span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
