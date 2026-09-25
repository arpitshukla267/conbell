"use client";

import { useEffect, useRef, useState } from "react";
import { Manrope, Inter } from "next/font/google";
import { ChevronDown, ArrowRight } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

/** Reveals children with a fade-up animation the first time they enter the viewport */
function useInView<T extends HTMLElement>(threshold = 0.15) {
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

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question:
      "What types of metals and alloy grades do you manufacture & fabricate?",
    answer:
      "We fabricate across Stainless Steel (SS304, SS316, SS316L), Mild Steel (IS 2062 Grade E250/E350), Carbon Steels (EN8, EN9, EN24, EN31), Aluminum Alloys (6061-T6, 5052), Brass, and Copper alloys. All materials arrive with mill test certificates (MTC).",
  },
  {
    question:
      "Do you manufacture custom parts directly from client 2D and 3D CAD files?",
    answer:
      "Yes — our application engineering desk works directly from client-supplied DXF, STEP, IGES, and native CAD files, with design-for-manufacturability feedback provided before production begins.",
  },
  {
    question:
      "What are your standard tolerances for CNC machining and sheet metal work?",
    answer:
      "CNC machining holds tolerances as tight as ±0.01mm on critical features, while sheet metal laser cutting and bending typically holds ±0.1mm depending on material thickness and part geometry.",
  },
  {
    question:
      "What is your typical lead time for initial prototypes versus bulk production?",
    answer:
      "Prototypes are typically delivered in 5-7 business days. Bulk production lead times range from 2-4 weeks depending on order volume, material availability, and finishing requirements.",
  },
  {
    question:
      "Do you provide material test certificates and quality inspection reports?",
    answer:
      "Every batch ships with EN 10204 3.1 material test certificates, dimensional CMM inspection reports, and NDT test records where applicable.",
  },
  {
    question:
      "Can Conbell Engineering handle turnkey site delivery and installation across India?",
    answer:
      "Yes, we manage end-to-end logistics including packaging, freight, on-site installation, and commissioning support for structural and heavy fabrication projects pan-India.",
  },
];

function FaqRow({
  item,
  index,
  isOpen,
  onToggle,
  isVisible,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
}) {
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
    >
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span
          className={`${manrope.className} text-[15px] font-bold text-[#0B1C30] sm:text-base`}
        >
          {index + 1}. {item.question}
        </span>
        <ChevronDown
          size={20}
          className={`mt-0.5 shrink-0 text-[#00355F] transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Grid-rows trick gives a smooth height animation without measuring content height */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-[400ms] ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-[#5B5E67]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: leftRef, isVisible: leftVisible } = useInView<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } =
    useInView<HTMLDivElement>();

  return (
    <section className={`${inter.className} bg-[#F8F9FF] px-6 py-16`}>
      <div className="mx-auto grid max-w-[95%] grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left column */}
        <div
          ref={leftRef}
          className={`transition-all duration-700 ease-out ${
            leftVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <h2
            className={`${manrope.className} mt-2 text-3xl font-bold leading-tight text-[#0B1C30] sm:text-4xl`}
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#5B5E67]">
            Clear answers regarding material grades, tolerance capabilities,
            drawing file formats, and dispatch schedules.
          </p>

          <div className="mt-8 rounded-2xl bg-[#EFF4FF] p-5">
            <h3
              className={`${manrope.className} text-base font-bold text-[#0B1C30]`}
            >
              Have custom drawing specifications?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5B5E67]">
              Our application engineering desk reviews 2D/3D CAD blueprints
              within 4 business hours.
            </p>
            <a
              href="#"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00355F] hover:underline"
            >
              Send Blueprint for Review
              <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* Right column — accordion */}
        <div ref={rightRef} className="flex flex-col gap-4">
          {FAQS.map((item, index) => (
            <FaqRow
              key={item.question}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
              isVisible={rightVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
