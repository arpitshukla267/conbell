import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  HardHat,
  FileCheck2,
  GraduationCap,
  Users2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Printer,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & Health Policy | Conbell Engineering Private Limited",
  description:
    "Official Safety & Health Policy of Conbell Engineering Private Limited. Committed to zero harm, statutory safety compliance, and hazard prevention in heavy engineering and fabrication.",
};

const POLICY_PILLARS = [
  {
    icon: FileCheck2,
    number: "01",
    title: "Statutory Compliance",
    description:
      "Complying with all applicable statutory safety, health, and environmental regulations across all manufacturing, fabrication, and on-site operations.",
  },
  {
    icon: AlertTriangle,
    number: "02",
    title: "Hazard Identification & Risk Control",
    description:
      "Identifying hazards proactively and implementing effective risk control, hierarchy of controls, and preventive measures before executing any activity.",
  },
  {
    icon: HardHat,
    number: "03",
    title: "PPE & Safe Work Practices",
    description:
      "Ensuring 100% adherence to proper use of certified Personal Protective Equipment (PPE) and strict adherence to safe work procedures across all bays.",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Regular Safety Training",
    description:
      "Providing regular safety training, toolbox talks, equipment qualification, and awareness programs to all employees and contractor personnel.",
  },
  {
    icon: Users2,
    number: "05",
    title: "Shared Safety Culture",
    description:
      "Promoting an active safety culture where occupational health and personal safety are recognized as a shared, non-negotiable responsibility at all levels.",
  },
  {
    icon: ShieldCheck,
    number: "06",
    title: "Incident & Near-Miss Investigation",
    description:
      "Investigating all incidents, near-misses, and unsafe conditions promptly to identify root causes and implement corrective actions to prevent recurrence.",
  },
  {
    icon: TrendingUp,
    number: "07",
    title: "Continual Improvement & Audits",
    description:
      "Continuously improving safety performance through systematic monitoring, internal audits, safety inspections, and measurable corrective actions.",
  },
];

export default function SafetyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ----------------- Breadcrumb & Hero Header ----------------- */}
      <section className="border-b border-blue-100 bg-[#EFF4FF] px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <Link href="/" className="transition-colors hover:text-[#00355F]">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-bold text-[#00355F]">Safety &amp; Health Policy</span>
          </nav>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00355F] shadow-sm">
                <ShieldCheck size={14} className="text-[#00355F]" />
                Corporate Policy Document
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                SAFETY &amp; HEALTH POLICY
              </h1>
              <p className="mt-2 text-lg font-bold text-[#00355F]">
                Conbell Engineering Private Limited
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-600" />
                ISO / OSHA Benchmark Aligned
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Main Policy Document ----------------- */}
      <section className="px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {/* Official Policy Statement Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/[0.03]">
            {/* Header banner */}
            <div className="border-b border-slate-100 bg-[#0B1C30] px-8 py-6 text-white">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                    Occupational Health, Safety &amp; Environment
                  </p>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Conbell Engineering Private Limited
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                    Policy Code: CEPL-OHS-01
                  </span>
                </div>
              </div>
            </div>

            {/* Core Policy Text */}
            <div className="p-8 md:p-12">
              {/* Paramount Statement */}
              <div className="rounded-xl border-l-4 border-[#00355F] bg-[#EFF4FF] p-6 text-slate-800">
                <p className="text-base font-medium leading-relaxed sm:text-lg">
                  At{" "}
                  <strong className="font-bold text-slate-950">
                    Conbell Engineering Private Limited
                  </strong>
                  , the safety and health of our employees, contractors, visitors,
                  and stakeholders is of paramount importance. We are committed to
                  providing a safe, healthy, and hazard-free working environment
                  in all our engineering, fabrication, and project activities.
                </p>
              </div>

              {/* We achieve this by */}
              <div className="mt-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00355F] text-xs font-bold text-white">
                    ✓
                  </span>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900">
                    We achieve this by:
                  </h3>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {POLICY_PILLARS.map((pillar) => {
                    const IconComponent = pillar.icon;
                    return (
                      <div
                        key={pillar.number}
                        className="group flex gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all hover:border-blue-200 hover:bg-[#EFF4FF]/40 hover:shadow-sm"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-[#00355F] shadow-sm transition-colors group-hover:bg-[#00355F] group-hover:text-white">
                          <IconComponent size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">
                              {pillar.number}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              {pillar.title}
                            </h4>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Management Commitment */}
              <div className="mt-10 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
                      Management Commitment
                    </h4>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-emerald-900 sm:text-base">
                      Management is committed to consultation, participation,
                      and continual improvement in occupational health and safety
                      performance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Plant & Contact Information Footer */}
              <div className="mt-10 border-t border-slate-200 pt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registered Plant &amp; Communication Details
                </h4>

                <div className="mt-4 grid grid-cols-1 gap-6 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#00355F]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Address
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        Survey No. 298/A, Vadavswami-Ambapura Road, Village:
                        Vadavswami, Ta.: Kalol(N.G)-382740, Gujarat.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#00355F]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Official E-Mail
                      </p>
                      <a
                        href="mailto:info@conbellengineering.com"
                        className="mt-1 block text-xs font-medium text-slate-700 hover:text-[#00355F] hover:underline"
                      >
                        info@conbellengineering.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#00355F]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Safety &amp; Factory Desk
                      </p>
                      <a
                        href="tel:+919586610281"
                        className="mt-1 block text-xs font-medium text-slate-700 hover:text-[#00355F] hover:underline"
                      >
                        +91-95866 10281
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links to other policies */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Looking for other legal and compliance information?
              </p>
              <p className="text-xs text-slate-500">
                Review our terms of business and privacy protections.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/terms-and-conditions"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#00355F]"
              >
                Terms &amp; Conditions &rarr;
              </Link>
              <Link
                href="/privacy-policy"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#00355F]"
              >
                Privacy Policy &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
