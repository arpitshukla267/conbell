import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Factory, ShieldCheck, ChevronRight } from "lucide-react";
import { SERVICES } from "../../data/services";

export const metadata: Metadata = {
  title: "Our Expertise & Engineering Services | Conbell Engineering",
  description:
    "Explore Conbell Engineering's expertise in conveyor support structures, overhead systems, assembly lines, walkways, and custom heavy fabrication.",
};

export default function OurPresenceOverviewPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FF] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[92%] max-w-[1400px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
          <Link href="/" className="hover:text-[#00355F] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="font-bold text-[#00355F]">Our Expertise</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our Expertise &amp; Engineering Services
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Discover our comprehensive engineering contribution across 5 core
            manufacturing sectors. Select any capability below to view our full
            engineering contribution, specifications, and project scope.
          </p>
        </div>

        {/* 5 Services Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#00355F]">
                  {service.title}
                </h2>
                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>

                <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4">
                  {service.specs.slice(0, 2).map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between text-xs text-slate-500"
                    >
                      <span className="font-semibold text-slate-700">
                        {spec.label}:
                      </span>
                      <span>{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    href={`/our-expertise/${service.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#EFF4FF] py-3 text-sm font-bold text-[#00355F] transition-colors group-hover:bg-[#00355F] group-hover:text-white"
                  >
                    <span>View Details</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
