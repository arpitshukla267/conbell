"use client";

import { useEffect, useRef, useState } from "react";
import { Manrope, Inter, Playfair_Display } from "next/font/google";
import { BadgeCheck } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700"],
});

/** Reveals children with a fade-up animation the first time they enter the viewport */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

interface CertBadge {
  label: string;
}

interface StandardCard {
  number: string;
  title: string;
  description: string;
}

const BADGES: CertBadge[] = [
  { label: "Customer-Focused Quality" },
  { label: "Process-Driven QMS" },
  { label: "Defect-Free Execution" },
];

const STANDARDS: StandardCard[] = [
  {
    number: "01",
    title: "Precision, Reliability & Durability",
    description:
      "Ensuring precision, reliability, and durability in all our products and services.",
  },
  {
    number: "02",
    title: "Process-Driven Quality System",
    description:
      "Adopting a process-driven Quality Management System in line with ISO standards.",
  },
  {
    number: "03",
    title: "Strict Quality Control",
    description:
      "Maintaining strict quality control from material procurement to final delivery.",
  },
  {
    number: "04",
    title: "On-Time & Defect-Free Execution",
    description:
      "Enhancing customer satisfaction through on-time delivery and defect-free execution.",
  },
  {
    number: "05",
    title: "Continuous Improvement",
    description:
      "Continuously improving our processes, systems, and skills through training, innovation, and performance monitoring.",
  },
  {
    number: "06",
    title: "Quality Culture & Teamwork",
    description:
      "Promoting a culture of quality awareness, responsibility, and teamwork across all levels of the organization.",
  },
];

export default function QualityStandards() {
  const { ref: leftRef, isVisible: leftVisible } = useInView<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } =
    useInView<HTMLDivElement>();

  return (
    <section className={`${inter.className} bg-[#F8F9FF] px-4 md:px-6 py-16`}>
      <div className="mx-auto max-w-[95vw] rounded-xl bg-white p-6 sm:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left column */}
          <div
            ref={leftRef}
            className={`transition-all duration-700 ease-out ${
              leftVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
          >
            <p className="text-[13px] font-semibold tracking-wider text-[#00355F]">
              QUALITY POLICY
            </p>
            <h2
              className={`${manrope.className} mt-2 text-3xl font-bold leading-tight text-[#0B1C30] sm:text-4xl`}
            >
              Quality Policy
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#5B5E67]">
              At Conbell Engineering Private Limited, we are committed to
              delivering high-quality engineering, fabrication, and industrial
              solutions that consistently meet customer requirements, statutory
              obligations, and applicable standards.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="flex items-center gap-1.5 rounded-md bg-[#EFF4FF] px-3.5 py-2 text-[13px] font-semibold text-[#00355F]"
                >
                  <BadgeCheck size={15} className="shrink-0" />
                  {badge.label}
                </span>
              ))}
            </div>

            <p className="mt-6 text-[13.5px] leading-relaxed text-[#8A8D96]">
              This Quality Policy is communicated, understood, implemented, and
              reviewed periodically to ensure its continued suitability and
              effectiveness.
            </p>
          </div>

          {/* Right column — 3x2 inner cards */}
          <div ref={rightRef} className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            {STANDARDS.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-lg bg-[#EFF4FF] p-5 transition-all duration-700 ease-out ${
                  rightVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{
                  transitionDelay: rightVisible ? `${index * 120}ms` : "0ms",
                }}
              >
                <div className="flex flex-col md:flex-row items-start gap-2">
                  <span
                    className={`${manrope.className} mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00355F] text-[11px] font-bold text-white`}
                  >
                    {index + 1}
                  </span>
                  <h3
                    className={`${manrope.className} text-[15px] font-bold leading-snug text-[#00355F]`}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-tight md:leading-relaxed text-[#5B5E67]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
