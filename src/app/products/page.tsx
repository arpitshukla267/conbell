"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Manrope, Inter } from "next/font/google";
import {
  FileText,
  Download,
  ChevronRight,
  ShieldCheck,
  Lock,
  Clock,
  ClipboardCheck,
  Truck,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

/* ---------------------------------- Data ---------------------------------- */

const STATS = [
  {
    label: "TOLERANCES STANDARD",
    value: "±0.005 mm",
    caption: "Calibrated Zeiss CMM inspected",
  },
  {
    label: "HEAVY STRUCTURE SINGLE LIFT",
    value: "20 Metric Tons",
    caption: "AWS D1.1 certified submerged arc",
  },
  {
    label: "LASER CUTTING ENVELOPE",
    value: "0.8 mm – 25 mm",
    caption: "Fiber laser table 4000 x 2000 mm",
  },
  {
    label: "ANNUAL STEEL PROCESSING",
    value: "18,500+ MT",
    caption: "Serving automotive, defense, power",
  },
];

type Category =
  | "All Solutions"
  | "Precision CNC Machining"
  | "Heavy Industrial Fabrication"
  | "Sheet Metal Enclosures"
  | "Custom Tooling & Fixtures";

const FILTERS: Category[] = [
  "All Solutions",
  "Precision CNC Machining",
  "Heavy Industrial Fabrication",
  "Sheet Metal Enclosures",
  "Custom Tooling & Fixtures",
];

interface Product {
  category: Exclude<Category, "All Solutions">;
  tag: string;
  tagColor: string;
  cornerBadge: string;
  image: string;
  title: string;
  description: string;
  specs: { label: string; value: string }[];
}

const PRODUCTS: Product[] = [
  {
    category: "Precision CNC Machining",
    tag: "MACHINING • 5-AXIS",
    tagColor: "bg-[#0F4C81]",
    cornerBadge: "Tol: ±0.010 mm",
    image: "/images/products/cnc-machined-components.jpg",
    title: "Precision CNC Machined Components",
    description:
      "Complex geometric parts turned and milled across high-speed multi-axis DMG MORI and Mazak centers with zero micro-burr finish.",
    specs: [
      { label: "Material Grades:", value: "SS304/316L, MS, EN24, 7075-T6" },
      { label: "Standard Compliance:", value: "ISO 2768-mK / ASME Y14.5" },
      { label: "Quality Assurance:", value: "100% CMM & Spectro Batch Tested" },
    ],
  },
  {
    category: "Heavy Industrial Fabrication",
    tag: "STRUCTURAL • HEAVY",
    tagColor: "bg-[#B9542B]",
    cornerBadge: "Max: 20 MT Unit",
    image: "/images/products/heavy-steel-structures.jpg",
    title: "Heavy Industrial Steel Structures",
    description:
      "Fabricated architectural skids, gantry frames, crane girders, and massive platform assemblies with submerged arc and FCAW welding.",
    specs: [
      {
        label: "Welding Certification:",
        value: "AWS D1.1 / EN 1090 Execution Class 3",
      },
      {
        label: "Testing Procedures:",
        value: "100% UT, MPI & Radiographic NDT",
      },
      {
        label: "Surface Treatment:",
        value: "Sa 2.5 Shot Blasting + Zinc Epoxy",
      },
    ],
  },
  {
    category: "Sheet Metal Enclosures",
    tag: "SHEET METAL • CNC",
    tagColor: "bg-[#0B1C30]",
    cornerBadge: "IP55 / IP65",
    image: "/images/products/sheet-metal-enclosures.jpg",
    title: "Sheet Metal Enclosures & Server Racks",
    description:
      "High-speed CNC punching, fiber laser cut panels, and multi-axis hydraulic bending for industrial power systems and control electronics.",
    specs: [
      { label: "Sheet Gauge Range:", value: "0.8 mm up to 12.0 mm" },
      {
        label: "Surface Coating:",
        value: "7-Tank Pre-treat + Electrostatic 80µm",
      },
      {
        label: "Ingress Protection:",
        value: "Certified IP65 / NEMA 4X options",
      },
    ],
  },
  {
    category: "Custom Tooling & Fixtures",
    tag: "TOOLING & JIGS",
    tagColor: "bg-[#0F4C81]",
    cornerBadge: "58-62 HRC",
    image: "/images/products/custom-tooling-fixtures.jpg",
    title: "Custom Industrial Tooling & Fixtures",
    description:
      "Robotic welding fixtures, automotive assembly jigs, stamping dies, and modular check gauges designed for continuous batch operations.",
    specs: [
      { label: "Hardening:", value: "Vacuum Quenched D2, H13, En31" },
      {
        label: "Clamping Method:",
        value: "Hydraulic / Pneumatic / Manual Toggle",
      },
      { label: "Repeatability:", value: "< 0.008 mm Gauge R&R Certified" },
    ],
  },
  {
    category: "Heavy Industrial Fabrication",
    tag: "HIGH PRESSURE",
    tagColor: "bg-[#B9542B]",
    cornerBadge: "Up to 600 Bar",
    image: "/images/products/forged-flanges-couplers.jpg",
    title: "Forged Flanges & Hydraulic Couplers",
    description:
      "Precision machined weld neck, slip-on, and blind flanges engineered for supercritical thermal power, oil & gas, and fluid handling.",
    specs: [
      { label: "Standards:", value: "ANSI B16.5, DIN 2633, BS 4504" },
      { label: "Rating Classes:", value: "Class 150 to Class 2500 Lbs" },
      { label: "NDT Level:", value: "Hydrostatic & Ultrasonic Certified" },
    ],
  },
  {
    category: "Custom Tooling & Fixtures",
    tag: "TURNKEY SYSTEMS",
    tagColor: "bg-[#0B1C30]",
    cornerBadge: "Continuous Duty",
    image: "/images/products/conveyor-assembly-systems.jpg",
    title: "Conveyor Lines & Assembly Systems",
    description:
      "End-to-end material handling infrastructure, motorized roller tracks, slat conveyors, and overhead transfer monorails.",
    specs: [
      { label: "Drive Systems:", value: "SEW / Bonfiglioli geared units" },
      { label: "Load Rating:", value: "Up to 3,500 kg per pallet section" },
      { label: "Integration:", value: "PLC automation & safety interlocks" },
    ],
  },
];

const TOLERANCE_MATRIX = [
  {
    process: "CNC 5-Axis Milling",
    fleet: "DMG MORI DMU 75, Mazak VCN-530C",
    envelope: "1050 x 530 x 510 mm",
    tolerance: "±0.005 mm",
    inspection: "Carl Zeiss CMM (Calypso System)",
  },
  {
    process: "CNC Turning & Mill-Turn",
    fleet: "Doosan Puma 2600Y / ACE Designers",
    envelope: "Ø 380 mm × Length 750 mm",
    tolerance: "±0.008 mm",
    inspection: "Mitutoyo Height Gauges & Bore Micrometers",
  },
  {
    process: "Fiber Laser Cutting",
    fleet: "Trumpf TruLaser 3030 (12kW Fiber)",
    envelope: "Sheet size: 4000 x 2000 mm",
    tolerance: "±0.050 mm",
    inspection: "Optical Profile Projector & Verniers",
  },
  {
    process: "CNC Hydraulic Press Brake",
    fleet: "Amada HFE3i 220-4 / Bystronic Xpert",
    envelope: "Bending length up to 4100 mm (220T)",
    tolerance: "±0.25° / ±0.15 mm",
    inspection: "Digital Protractor & Go/No-Go Template Jigs",
  },
  {
    process: "Heavy Structural Welding",
    fleet: "ESAB Submerged Arc / Fronius MIG-Pulse",
    envelope: "Structures up to 20 Tons / Bay length 60m",
    tolerance: "AWS D1.1 Table 6.1",
    inspection: "Ultrasonic (UT), Magnetic Particle (MPI), DP",
  },
  {
    process: "Electrostatic Powder Coating",
    fleet: "Nordson Automated Powder Booth + 7-Tank",
    envelope: "Component: 4000 x 1800 x 2000 mm",
    tolerance: "60 – 110 µm",
    inspection: "Elcometer DFT gauge & Cross-Hatch Adhesion",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "CAD/Print Submission",
    description:
      "Upload 2D drawings (PDF/DWG) and 3D CAD files (STEP, IGES, SolidWorks) along with material specs and target batch quantities.",
    icon: Lock,
    meta: "NDA Protected Workflow",
  },
  {
    number: "02",
    title: "DFM & Cost Analysis",
    description:
      "Our Senior Metallurgical & Tooling Engineers review Design-for-Manufacturability, optimize tooling paths, and issue a firm quote within 24 hours.",
    icon: Clock,
    meta: "Turnaround: 24-48 Hours",
  },
  {
    number: "03",
    title: "FAI & Pre-Production",
    description:
      "First Article Inspection (FAI) pilot units fabricated and measured against complete AS9102 / PPAP Level 3 documentation for client sign-off.",
    icon: ClipboardCheck,
    meta: "PPAP / FAI Reports",
  },
  {
    number: "04",
    title: "Batch Run & Logistics",
    description:
      "Full-scale volume runs under calibrated statistical process control (SPC), export VCI anti-corrosion packaging, and door-to-port dispatch.",
    icon: Truck,
    meta: "Domestic & Global Freight",
  },
];

/* ---------------------------------- Page ---------------------------------- */

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All Solutions");

  const filteredProducts =
    activeFilter === "All Solutions"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <main className={`${manrope.variable} ${inter.variable} bg-white`}>
      {/* ---------------------------- Hero / Header ---------------------------- */}
      <section className="border-b border-[#E4E9F2] px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-sm"
          >
            <Link
              href="/"
              className="text-[#5B5E67] transition-colors hover:text-[#0B1C30]"
            >
              Home
            </Link>
            <ChevronRight
              className="h-3.5 w-3.5 text-[#5B5E67]"
              aria-hidden="true"
            />
            <span className="font-medium text-[#0F4C81]">
              Products &amp; Capabilities
            </span>
          </nav>

          {/* Eyebrow */}
          <p className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold tracking-wide text-[#5B5E67]">
            INSTITUTIONAL TECHNICAL CATALOG • REVISION 2025.4
          </p>

          {/* Heading + actions */}
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="max-w-2xl">
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold leading-tight text-[#0B1C30] md:text-4xl">
                Engineered Metal Products &amp; Turnkey Manufacturing
                Capabilities
              </h1>
              <p className="mt-4 font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#5B5E67]">
                Standard and custom metallurgical solutions manufactured under
                ISO 9001:2015 and IATF 16949 standards. Micro-grade CNC
                components, heavy structural assemblies, and engineered sheet
                metal systems built to exact international tolerances.
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-[#EFF4FF] p-5">
                <p className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-wide text-[#5B5E67]">
                  {stat.label}
                </p>
                <p className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30]">
                  {stat.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-[#5B5E67]">
                  {stat.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Filter bar ------------------------------ */}
      <section
        className="px-6 py-6 md:px-10 lg:px-16"
        aria-label="Filter products by category"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              const count =
                filter === "All Solutions" ? PRODUCTS.length : undefined;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={isActive}
                  className={`rounded-md px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0F4C81] text-white"
                      : "bg-[#E5EEFF] text-[#5B5E67] hover:bg-[#D6E4FF]"
                  }`}
                >
                  {filter}
                  {count !== undefined ? ` (${count})` : ""}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ Product grid ----------------------------- */}
      <section
        className="px-6 pb-16 md:px-10 lg:px-16"
        aria-label="Product catalog"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.title}
              className="flex flex-col overflow-hidden rounded-lg border border-[#E4E9F2] bg-white"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span
                  className={`absolute left-3 top-3 rounded px-2 py-1 font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-wide text-white ${product.tagColor}`}
                >
                  {product.tag}
                </span>
                <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 font-[family-name:var(--font-inter)] text-[10px] font-medium text-white">
                  {product.cornerBadge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#0F4C81]">
                  {product.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#5B5E67]">
                  {product.description}
                </p>

                <dl className="mt-4 space-y-1.5 border-t border-[#E4E9F2] pt-4">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <dt className="font-[family-name:var(--font-inter)] text-[#5B5E67]">
                        {spec.label}
                      </dt>
                      <dd className="font-[family-name:var(--font-inter)] text-right font-medium text-[#0B1C30]">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-[#0B1C30] px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-[#0F4C81]"
                  >
                    Enquire / Get Quote
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-[#E5EEFF] px-4 py-2.5 font-[family-name:var(--font-inter)] text-sm font-semibold text-[#0F4C81] transition-colors hover:bg-[#D6E4FF]"
                  >
                    Specs
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------- Tolerance matrix ---------------------------- */}
      <section className="bg-[#F8F9FF] px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-xs font-semibold tracking-wide text-[#5B5E67]">
                INSTITUTIONAL ENGINEERING THRESHOLDS
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30] md:text-3xl">
                Manufacturing Process Tolerances &amp; Equipment Matrix
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-md bg-[#DCE9FF] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-[#0F4C81] lg:self-auto">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Standards: ISO 2768-mK / DIN EN ISO 9013 / ASME Y14.5
            </div>
          </div>

          <div className="mt-8 overflow-x-auto rounded-lg border border-[#E4E9F2] bg-white">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="bg-[#EFF4FF]">
                  {[
                    "Manufacturing Process",
                    "Installed Machinery Fleet",
                    "Dimensional Envelope",
                    "Achievable Tolerance",
                    "Quality Inspection Method",
                  ].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-5 py-3 font-[family-name:var(--font-inter)] text-xs font-semibold tracking-wide text-[#5B5E67]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOLERANCE_MATRIX.map((row, i) => (
                  <tr
                    key={row.process}
                    className={
                      i !== TOLERANCE_MATRIX.length - 1
                        ? "border-b border-[#E4E9F2]"
                        : ""
                    }
                  >
                    <td className="px-5 py-4 font-[family-name:var(--font-inter)] text-sm font-semibold text-[#0F4C81]">
                      {row.process}
                    </td>
                    <td className="px-5 py-4 font-[family-name:var(--font-inter)] text-sm text-[#0B1C30]">
                      {row.fleet}
                    </td>
                    <td className="px-5 py-4 font-[family-name:var(--font-inter)] text-sm text-[#0B1C30]">
                      {row.envelope}
                    </td>
                    <td className="px-5 py-4 font-[family-name:var(--font-inter)] text-sm font-bold text-[#0B1C30]">
                      {row.tolerance}
                    </td>
                    <td className="px-5 py-4 font-[family-name:var(--font-inter)] text-sm text-[#0B1C30]">
                      {row.inspection}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --------------------------- Process / workflow -------------------------- */}
      <section className="px-6 py-16 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-[family-name:var(--font-inter)] text-xs font-semibold tracking-wide text-[#5B5E67]">
              SEAMLESS INSTITUTIONAL PROCUREMENT
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30] md:text-3xl">
              From Blueprint to Serial Batch Dispatch
            </h2>
            <p className="mx-auto mt-3 max-w-2xl font-[family-name:var(--font-inter)] text-base text-[#5B5E67]">
              Rigorous engineering stage-gates guaranteeing zero geometric
              mismatch and complete metallurgical compliance.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="rounded-lg border border-[#E4E9F2] bg-white p-6"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#0B1C30] font-[family-name:var(--font-manrope)] text-sm font-bold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-base font-bold text-[#0B1C30]">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#5B5E67]">
                    {step.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-xs font-medium text-[#0F4C81]">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {step.meta}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
