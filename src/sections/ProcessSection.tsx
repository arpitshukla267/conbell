"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Manrope } from "next/font/google";
import {
  Compass,
  Factory,
  Truck,
  Wrench,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

interface ProcessStep {
  number: string;
  stepIdx: number;
  title: string;
  icon: typeof Compass;
  description: string;
  highlights: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    stepIdx: 0,
    title: "Design",
    icon: Compass,
    description:
      "Comprehensive 3D CAD modeling, structural engineering analysis, and conveyor layout optimization tailored to plant requirements.",
    highlights: [
      "3D CAD Modeling",
      "Structural Analysis",
      "Custom Engineering",
    ],
  },
  {
    number: "02",
    stepIdx: 1,
    title: "Manufacturing",
    icon: Factory,
    description:
      "High-precision fabrication, multi-axis CNC machining, high-wattage fiber laser cutting, and certified structural welding.",
    highlights: ["Laser Cutting", "CNC Machining", "Certified Welding"],
  },
  {
    number: "03",
    stepIdx: 2,
    title: "Supply",
    icon: Truck,
    description:
      "Reliable pan-India dispatch coordination, protective transit packaging, and on-schedule delivery directly to project sites.",
    highlights: [
      "Pan-India Logistics",
      "On-Time Dispatch",
      "Material Tracking",
    ],
  },
  {
    number: "04",
    stepIdx: 3,
    title: "Installation",
    icon: Wrench,
    description:
      "Turnkey on-site erection, precision alignment, safety protocol compliance, and seamless operational handover.",
    highlights: ["On-Site Erection", "Laser Alignment", "Safety Handover"],
  },
];

// The 4 step-points sit at the centers of 4 equal columns (12.5%, 37.5%,
// 62.5%, 87.5%) inside a track that itself spans 12.5%–87.5%. That places
// them at evenly spaced fractions — 0, 1/3, 2/3, 1 — along the track, which
// is exactly `index / (steps.length - 1)`. The connecting line fills at a
// constant (linear) rate, so multiplying that fraction by the line's total
// duration gives the exact moment the fill reaches each point — that's when
// its node + card are told to appear.

const LINE_START_DELAY = 0.15; // seconds, before the line starts filling
const LINE_DURATION = 1.8; // seconds, desktop horizontal line
const LINE_DURATION_MOBILE = 1.6; // seconds, mobile vertical line
const CARD_LAG = 0.15; // card appears slightly after its node/point

function pointDelay(index: number, total: number, lineDuration: number) {
  const progress = total > 1 ? index / (total - 1) : 0;
  return LINE_START_DELAY + lineDuration * progress;
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={containerRef}
      className="bg-white py-20 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto w-[90%] max-w-[1440px]">
        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${manrope.className} text-3xl font-bold leading-[1.18] tracking-[-0.03em] text-[#10243E] sm:text-4xl lg:text-[44px]`}
          >
            Our Process
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-2 max-w-xl text-[14.5px] leading-relaxed text-[#6B7280]"
          >
            From initial structural engineering and precision shop fabrication
            to nationwide delivery and turnkey on-site erection.
          </motion.p>
        </div>

        {/* ================= DESKTOP VIEW (Horizontal progressive line) ================= */}
        <div className="hidden lg:block relative">
          {/* Connecting Line Track across column centers (from 12.5% to 87.5%) */}
          <div className="absolute top-7 left-[12.5%] right-[12.5%] h-1 bg-[#E2E8F0] -z-0">
            {/* Animated Progressive Connecting Line — fills at a steady rate
                so each point's reveal can be timed to exactly when the fill
                reaches it. */}
            <motion.div
              className="h-full bg-gradient-to-r from-[#00355F] via-[#2563EB] to-[#00355F]"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                duration: LINE_DURATION,
                delay: LINE_START_DELAY,
                ease: "linear",
              }}
            />
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const nodeDelay = pointDelay(
                index,
                PROCESS_STEPS.length,
                LINE_DURATION,
              );
              const cardDelay = nodeDelay + CARD_LAG;

              return (
                <div key={step.title} className="flex flex-col items-center">
                  {/* Point / Node — pops in the instant the line reaches it */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 0.45,
                      delay: nodeDelay,
                      ease: "backOut",
                    }}
                    className="relative z-10 mb-8 flex flex-col items-center"
                  >
                    {/* Node circle */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00355F] text-white shadow-[0_8px_20px_rgba(0,53,95,0.25)] transition-transform duration-300 hover:scale-110">
                      <Icon className="h-6 w-6 text-white" strokeWidth={2.2} />
                    </div>

                    {/* Step number badge */}
                    <span className="mt-2 rounded-full bg-[#EEF4FF] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#00355F]">
                      STEP {step.number}
                    </span>
                  </motion.div>

                  {/* Step Card — rises in just after its point lights up */}
                  <motion.article
                    initial={{ opacity: 0, y: 35 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.55,
                      delay: cardDelay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`
                      flex
                      h-full
                      w-full
                      flex-col
                      justify-between
                      rounded-[18px]
                      border
                      border-[#E4E9F2]
                      bg-[#F9FBFF]
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1.5
                      hover:border-[#B2CDFA]
                      hover:bg-white
                      hover:shadow-[0_14px_35px_rgba(15,76,129,0.09)]
                    `}
                  >
                    <div>
                      {/* Step Title */}
                      <h3
                        className={`${manrope.className} mb-3 text-[21px] font-bold text-[#10243E]`}
                      >
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[14px] leading-relaxed text-[#6B7280]">
                        {step.description}
                      </p>
                    </div>

                    {/* Highlights list */}
                    <div className="mt-6 border-t border-[#E8EEF8] pt-4">
                      <ul className="space-y-2">
                        {step.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-[12.5px] font-medium text-[#4B5563]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#00355F]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MOBILE / TABLET VIEW (Vertical progressive line) ================= */}
        <div className="block lg:hidden relative pl-12 sm:pl-16">
          {/* Vertical Progressive Connecting Line */}
          <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-8 w-1 bg-[#E2E8F0] -z-0">
            <motion.div
              className="w-full bg-gradient-to-b from-[#00355F] via-[#2563EB] to-[#00355F]"
              style={{ transformOrigin: "top" }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{
                duration: LINE_DURATION_MOBILE,
                delay: LINE_START_DELAY,
                ease: "linear",
              }}
            />
          </div>

          <div className="space-y-8">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const nodeDelay = pointDelay(
                index,
                PROCESS_STEPS.length,
                LINE_DURATION_MOBILE,
              );
              const cardDelay = nodeDelay + CARD_LAG;

              return (
                <div key={step.title} className="relative">
                  {/* Point / Node on the vertical line — lights up as the
                      fill passes it */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 0.45,
                      delay: nodeDelay,
                      ease: "backOut",
                    }}
                    className="absolute -left-12 sm:-left-16 top-4 z-10"
                  >
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-4 border-white bg-[#00355F] text-white shadow-md">
                      <Icon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        strokeWidth={2.2}
                      />
                    </div>
                  </motion.div>

                  {/* Step Card */}
                  <motion.article
                    initial={{ opacity: 0, x: 25 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: cardDelay,
                      ease: "easeOut",
                    }}
                    className={`
                      rounded-[16px]
                      border
                      border-[#E4E9F2]
                      bg-[#F9FBFF]
                      p-5
                      sm:p-6
                      shadow-sm
                    `}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-[#EEF4FF] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#00355F]">
                        STEP {step.number}
                      </span>
                    </div>

                    <h3
                      className={`${manrope.className} mb-2 text-[19px] font-bold text-[#10243E]`}
                    >
                      {step.title}
                    </h3>

                    <p className="text-[14px] leading-relaxed text-[#6B7280]">
                      {step.description}
                    </p>

                    <div className="mt-4 border-t border-[#E8EEF8] pt-3">
                      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {step.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-1.5 text-[12px] font-medium text-[#4B5563]"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#00355F]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
