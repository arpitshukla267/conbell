"use client";

import Image from "next/image";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import { INDUSTRIES, type Industry } from "../data/industries";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
});

// Exported so /our-presence can reuse the exact same card.
export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/our-presence/${industry.slug}`}
      className="group relative block h-[350px] w-full overflow-hidden rounded-2xl"
    >
      <Image
        src={industry.image}
        alt={industry.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {/* Dark overlay anchored to the bottom, fading out toward the top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(33,49,69,0.9) 0%, rgba(33,49,69,0.2) 50%, rgba(33,49,69,0) 100%)",
        }}
      />

      {/* Bottom row: description on the left (~80% width), arrow badge on the right */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div className="w-4/5">
          <h3 className={`${manrope.className} text-lg font-bold text-white`}>
            {industry.name}
          </h3>
          <p className="mt-1 text-sm text-[#D3E4FE]">{industry.description}</p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0F4C81] shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}

export default function IndustriesWeServe() {
  return (
    <section className="bg-[#F8F9FF] px-6 py-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 max-w-2xl">
          <p className="text-[13px] font-semibold tracking-wider text-[#0F4C81]">
            WHO WE WORK WITH
          </p>
          <h2
            className={`${manrope.className} mt-2 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
          >
            Industries We Serve
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </div>
    </section>
  );
}
