"use client"

import { useState } from "react";
import { Manrope } from "next/font/google";
import Image from "next/image";
import {
  ShieldCheck,
  Cpu,
  HardHat,
  Factory,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

interface Capability {
  category: string;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  image: string;
  icon: typeof Factory;
}

const CAPABILITIES: Capability[] = [
  {
    category: "HEAVY INDUSTRIAL CAPACITY",
    title: "Large-scale plant execution capability",
    description:
      "Expansive industrial facility equipped with heavy-tonnage overhead EOT cranes and extensive floor area capable of executing simultaneous large-scale plant projects and heavy structural runs.",
    statLabel: "Capacity Rating:",
    statValue: "High-Volume Structural Plant",
    image: "/capabilites/cnc-machining.png",
    icon: Factory,
  },
  {
    category: "MODERN MACHINERY",
    title: "Advanced fabrication setup",
    description:
      "State-of-the-art multi-axis CNC machining, high-capacity fiber laser cutting beds, synchronized CNC hydraulic press brakes, and automated submerged arc welding stations.",
    statLabel: "Machinery Setup:",
    statValue: "CNC & High-Wattage Fiber Laser",
    image: "/capabilites/laser-cutting.png",
    icon: Cpu,
  },
  {
    category: "HUMAN EXPERTISE",
    title: "Skilled & experienced workforce",
    description:
      "Seasoned structural engineers, AWS-certified welders, skilled CNC programmers, and dedicated on-site erection specialists committed to zero-defect manufacturing standards.",
    statLabel: "Workforce Team:",
    statValue: "Certified Technical Specialists",
    image: "/capabilites/cnc-machining.png",
    icon: HardHat,
  },
];

function CapabilityCard({ item }: { item: Capability }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image — 240px */}
      <div className="relative h-[230px] w-full overflow-hidden bg-slate-900">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3
            className={`${manrope.className} text-[19px] font-bold text-[#0B1C30]`}
          >
            {item.title}
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
            {item.description}
          </p>
        </div>

        <div className="mt-6 border-t border-[#EDF0F5] pt-4">
          <p className="text-sm">
            <span className="font-semibold text-gray-500">
              {item.statLabel}
            </span>{" "}
            <span className="font-bold text-[#00355F]">{item.statValue}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ManufacturingInfrastructure() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? CAPABILITIES.length - 1 : prev - 1));

  const goNext = () =>
    setActiveIndex((prev) => (prev === CAPABILITIES.length - 1 ? 0 : prev + 1));

  return (
    <section className="bg-[#EFF4FF] px-4 md:px-6 py-20">
      <div className="mx-auto max-w-[95%]">
        {/* ================= HEADING ================= */}
        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h2
              className={`${manrope.className} text-3xl font-bold tracking-tight text-[#0B1C30] sm:text-4xl lg:text-[42px]`}
            >
              Manufacturing Infrastructure
            </h2>

            <p className="mt-3 text-[16px] font-medium text-[#00355F]">
              Built for performance, durability &amp; safety
            </p>

            <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
              Spread across our heavy industrial compound, equipped with
              heavy-duty overhead cranes, automated laser systems, precision CNC
              equipment, and calibrated inspection bays.
            </p>
          </div>
        </div>

        {/* ================= DESKTOP GRID (sm and up) — unchanged ================= */}
        <div className="hidden sm:grid grid-cols-2 gap-6 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <CapabilityCard key={item.title} item={item} />
          ))}
        </div>

        {/* ================= MOBILE CAROUSEL (below sm) ================= */}
        <div className="relative sm:hidden">
          {/* Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {CAPABILITIES.map((item) => (
                <div key={item.title} className="w-full shrink-0 px-1">
                  <CapabilityCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Side arrows */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous capability"
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00355F] shadow-md active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next capability"
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00355F] shadow-md active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots indicator */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {CAPABILITIES.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-[#00355F]"
                    : "w-2 bg-[#B9CBE4]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
