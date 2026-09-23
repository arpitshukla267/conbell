import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Scale,
  Building2,
  Calendar,
  ChevronRight,
  Truck,
  Wrench,
  AlertCircle,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Conbell Engineering Private Limited",
  description:
    "Standard commercial and engineering terms and conditions for Conbell Engineering Private Limited. Outlining fabrication contracts, quotations, deliveries, and quality standards.",
};

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance & Contract Formation",
    content: `These Terms & Conditions ("Terms") govern all quotations, purchase orders, engineering contracts, and delivery of industrial fabrication, conveyor structures, assembly lines, walkways, and custom equipment provided by Conbell Engineering Private Limited ("Company", "we", "us", or "our") to the client or purchaser ("Customer" or "Buyer").

Any purchase order (PO), letter of intent (LOI), or verbal/written instruction to proceed from the Customer constitutes unconditional acceptance of these Terms, superseding any contrary conditions contained in Customer purchase documentation unless specifically agreed to in writing by an authorized director of the Company.`,
  },
  {
    id: "drawings",
    title: "2. Blueprints, CAD Specifications & Technical Scope",
    content: `All fabrication work is executed strictly in accordance with approved 2D/3D CAD blueprints, engineering bill of materials (BOM), and agreed technical data sheets.
    
The Customer is solely responsible for ensuring the adequacy, structural suitability, and accuracy of all drawings, dimensions, load profiles, and site parameters provided. Any modifications, change orders, or engineering deviations requested after commencement of raw material procurement or fabrication will be subject to revised pricing and timeline adjustments.`,
  },
  {
    id: "quotations",
    title: "3. Quotations, Pricing & Payment Terms",
    content: `Unless expressly stated otherwise:
• All written quotations remain valid for thirty (30) calendar days from the date of issue and are subject to raw steel market price index adjustments thereafter.
• Prices are exclusive of statutory GST, customs duties, transport insurance, freight, and local levies, which shall be borne by the Customer.
• Commercial terms require payment in accordance with milestone stages (e.g., advance mobilization deposit, progressive fabrication milestones, and balance against inspection/prior to dispatch).
• In the event of payment delays exceeding agreed credit periods, the Company reserves the right to suspend ongoing fabrication or withhold dispatch without liability.`,
  },
  {
    id: "quality",
    title: "4. Quality Standards, Welding & Inspection",
    content: `Conbell Engineering adheres to internationally recognized structural and welding standards, including IS 800 (Structural Steel Code), AWS D1.1 (Structural Welding Code – Steel), and AISC 360 benchmarks.
    
Customer pre-dispatch inspections (PDI) may be conducted at our manufacturing facility (Kalol, Gujarat) upon mutual scheduling. Non-Destructive Testing (NDT), ultrasonic flaw detection, and third-party inspection (TPI) agency fees are included only if expressly stated in the commercial quotation. Signing of the PDI clearance report constitutes final acceptance of dimensional and visual tolerances.`,
  },
  {
    id: "delivery",
    title: "5. Dispatch, Freight & Delivery Terms",
    content: `Dispatch timelines communicated in proposals are calculated from the date of drawing approval and advance realization.
    
Unless agreed otherwise under Incoterms (e.g., Ex-Works Kalol Plant), risk of loss passes to the Customer upon handover of goods to the primary freight carrier. The Company is not liable for transport delays caused by logistical restrictions, road permits (E-Way bills), octroi check-posts, or handling accidents during transit.`,
  },
  {
    id: "installation",
    title: "6. Site Readiness & On-Site Erection",
    content: `Where on-site structural assembly, erection, or conveyor commissioning is contracted:
• The Customer must provide clear, unhindered site access, level foundations, adequate crane clearance, civil anchoring points, three-phase electric power, and water supply free of charge.
• The Customer is responsible for securing local plant clearances, work permits, and hot-work permits in accordance with factory inspectorate guidelines.
• Site idle time or standby charges incurred due to Customer unpreparedness will be billed at standard daily engineering rates.`,
  },
  {
    id: "warranty",
    title: "7. Warranty & Defect Liability",
    content: `The Company warrants all fabricated structural components against defects in manufacturing workmanship and weld integrity for a period of twelve (12) months from the date of supply or eighteen (18) months from delivery, whichever occurs earlier.
    
This warranty expressly excludes:
• Normal wear and tear, cosmetic surface oxidation, or chemical erosion under corrosive operating environments.
• Deficiencies caused by operating structures beyond rated payload limits, unauthorized structural alterations, or improper maintenance.
• Proprietary electrical, drive motors, pneumatic, or third-party bought-out components, which carry the respective OEM warranties.`,
  },
  {
    id: "ip",
    title: "8. Intellectual Property & Confidentiality",
    content: `All design calculations, manufacturing methodologies, tooling jigs, shop fabrication drawings, and proprietary engineering improvements developed by Conbell Engineering remain our exclusive intellectual property. Both parties agree to maintain strict confidentiality regarding proprietary commercial drawings, technical pricing formulas, and business specifications.`,
  },
  {
    id: "force-majeure",
    title: "9. Force Majeure",
    content: `Neither party shall be held liable for failure or delay in performance caused by circumstances beyond reasonable control, including but not limited to acts of God, extreme weather, floods, earthquakes, regional power grid failures, governmental export/import bans, steel mill supply allocations, strikes, lockouts, or civil disturbances.`,
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    content: `To the maximum extent permitted by applicable Indian law, Conbell Engineering's total cumulative liability for any claim arising out of or related to an order, whether in contract, warranty, tort (including negligence), or otherwise, shall not exceed the total net value actually received by the Company for that specific order. Under no circumstances shall the Company be liable for loss of production, indirect, incidental, or consequential damages.`,
  },
  {
    id: "jurisdiction",
    title: "11. Governing Law & Dispute Resolution",
    content: `These Terms and all commercial contracts shall be governed by and construed in accordance with the laws of the Republic of India. In the event of any dispute or controversy that cannot be resolved amicably through mutual executive consultation, the courts located in Kalol / Ahmedabad, Gujarat, India, shall have exclusive jurisdiction.`,
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ----------------- Breadcrumb & Hero Header ----------------- */}
      <section className="border-b border-blue-100 bg-[#EFF4FF] px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <Link href="/" className="transition-colors hover:text-[#00355F]">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-bold text-[#00355F]">Terms &amp; Conditions</span>
          </nav>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00355F] shadow-sm">
                <Scale size={14} className="text-[#00355F]" />
                Commercial &amp; Legal Framework
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Terms &amp; Conditions
              </h1>
              <p className="mt-2 text-base text-slate-600 sm:text-lg">
                Conbell Engineering Private Limited • Engineering &amp; Fabrication Services
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Clock size={14} />
              <span>Effective Date: 2024–2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Main Content ----------------- */}
      <section className="px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            {/* Table of contents sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contents
                </p>
                <nav className="mt-3 space-y-1.5 text-xs">
                  {SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block rounded-lg px-2.5 py-1.5 font-medium text-slate-600 transition-colors hover:bg-[#EFF4FF] hover:text-[#00355F]"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-[11px] text-slate-500">
                    Have questions regarding contracts or custom NDAs?
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 inline-block text-xs font-bold text-[#00355F] hover:underline"
                  >
                    Contact Legal Desk &rarr;
                  </Link>
                </div>
              </div>
            </aside>

            {/* Articles */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  Please read these Terms &amp; Conditions carefully before issuing purchase orders
                  or confirming engineering contracts with Conbell Engineering Private Limited.
                  These terms define our mutual rights, fabrication warranties, payment milestones,
                  and operational guidelines.
                </p>
              </div>

              {SECTIONS.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {section.content}
                  </div>
                </div>
              ))}

              {/* Corporate Contact Box */}
              <div className="rounded-2xl border border-blue-200 bg-[#EFF4FF] p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00355F] text-white">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Corporate Notice &amp; Legal Inquiries
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      For formal contractual notices, master service agreements (MSA), or customer-specific vendor registrations, reach out to our corporate office:
                    </p>
                    <div className="mt-4 text-xs font-medium text-slate-700 space-y-1">
                      <p>
                        <strong>Conbell Engineering Private Limited</strong>
                      </p>
                      <p>
                        Survey No. 298/A, Vadavswami-Ambapura Road, Village: Vadavswami, Ta.: Kalol(N.G)-382740, Gujarat, India.
                      </p>
                      <p>
                        E-Mail:{" "}
                        <a
                          href="mailto:info@conbellengineering.com"
                          className="font-bold text-[#00355F] hover:underline"
                        >
                          info@conbellengineering.com
                        </a>{" "}
                        | Phone: +91-95866 10281
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
