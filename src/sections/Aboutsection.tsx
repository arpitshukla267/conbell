"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Manrope, Inter } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Scroll-reveal hook — adds a class once the element enters the viewport.
 * Respects prefers-reduced-motion (returns true immediately in that case).
 */
function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ---------------------------------------------------------------------- */
/* Icons — outline style matching the reference design                     */
/* ---------------------------------------------------------------------- */

type IconProps = { className?: string };

function WrenchIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L2 19l3 3 7.3-7.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CompassIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

type Feature = {
  Icon: (props: IconProps) => React.ReactNode;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    Icon: WrenchIcon,
    title: "Advanced Fabrication",
    description:
      "Fiber laser cutting, CNC multi-axis milling, and automated welding lines.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Stringent QC Protocol",
    description:
      "Coordinate measuring machine (CMM) reports and strict zero-defect policies.",
  },
  {
    Icon: CompassIcon,
    title: "Custom Engineering",
    description:
      "Fabrication directly from customer 3D CAD/STEP blueprints and OEM specs.",
  },
  {
    Icon: ClockIcon,
    title: "Responsive Timelines",
    description:
      "Rapid prototyping cycles, agile scheduling, and tracked dispatch coordination.",
  },
];

function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { Icon } = feature;

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
      className={`rounded-xl border border-slate-200 bg-white p-3 md:p-4 transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h3
        className={`${manrope.className} mb-2 flex flex-col md:flex-row md:items-center gap-2.5 text-[15.5px] font-semibold text-slate-900`}
      >
        <Icon className="h-4 w-4 flex-shrink-0 text-[#12324f]" />
        {feature.title}
      </h3>
      <p className={`${inter.className} text-xs md:text-sm leading-relaxed text-slate-500`}>
        {feature.description}
      </p>
    </div>
  );
}

export default function AboutSection() {
  const media = useInView<HTMLDivElement>();
  const eyebrow = useInView<HTMLDivElement>();
  const title = useInView<HTMLHeadingElement>();
  const lede = useInView<HTMLParagraphElement>();
  const body = useInView<HTMLParagraphElement>();
  const cta = useInView<HTMLDivElement>();

  const revealClass = (inView: boolean) =>
    `transition-all duration-700 ease-out ${
      inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;

  return (
    <section className="mx-auto grid max-w-full grid-cols-1 items-stretch gap-9 bg-white px-5 py-12 md:grid-cols-2 md:gap-16 md:px-16 md:py-28">
      {/* Image */}
      <div
        ref={media.ref}
        className="relative order-first aspect-[16/11] h-[40vh] md:h-[80vh] w-full overflow-hidden rounded-2xl bg-slate-200 md:order-none md:aspect-[549/609]"
      >
        <Image
          src="/about.png"
          alt="Conbell Engineering fabrication floor with CNC laser cutting and press brake machinery"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={`object-cover transition-transform duration-[1200ms] ease-out ${
            media.inView ? "scale-100" : "scale-[1.06]"
          }`}
          priority
        />
      </div>

      {/* Copy — stretched to match the image's height, content distributed within it */}
      <div className="flex h-full min-w-0 flex-col justify-center">
        <div
          ref={eyebrow.ref}
          className={`${manrope.className} mb-4 flex items-center gap-2.5 text-[12.5px] font-semibold tracking-wide text-[#12324f] ${revealClass(
            eyebrow.inView,
          )}`}
        >
          <span className="block h-0.5 w-5.5 bg-[#12324f]" />
          ABOUT Conbell Engineering
        </div>

        <h1
          ref={title.ref}
          className={`${manrope.className} mb-5 text-[26px] font-semibold leading-[1.18] tracking-tight text-slate-900 sm:text-3xl md:text-[40px] ${revealClass(
            title.inView,
          )}`}
        >
          Transforming Raw Steel into High-Tolerance Industrial Solutions
        </h1>

        <p
          ref={lede.ref}
          className={`${inter.className} mb-4 max-w-[60ch] text-sm leading-relaxed text-slate-600 ${revealClass(
            lede.inView,
          )}`}
        >
          Conbell Engineering is a premier Indian metal manufacturing enterprise
          specializing in precision fabrication, CNC components, and turnkey
          structural assemblies for critical engineering applications.
        </p>

        <p
          ref={body.ref}
          className={`${inter.className} mb-6 max-w-[60ch] text-xs leading-relaxed text-slate-500 ${revealClass(
            body.inView,
          )}`}
        >
          Operating from our state-of-the-art manufacturing plant, we combine
          rigorous metallurgic testing, automated CAD/CAM integration, and
          seasoned metallurgical expertise. Serving Tier-1 automotive brands,
          defense contractors, power generation utilities, and heavy
          infrastructure developers nationwide.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 90} />
          ))}
        </div>

        {/* <div
          ref={cta.ref}
          className={`mt-4 flex flex-wrap items-center gap-7 ${revealClass(
            cta.inView,
          )}`}
        >
          <a
            href="#"
            className={`${manrope.className} inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#0d2438] px-5.5 py-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#0a1c2c] sm:w-auto`}
          >
            Request Facility Profile
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </a>

          <div
            className={`${inter.className} flex items-center gap-2.5 text-sm text-slate-700`}
          >
            <span className="flex h-7.5 w-7.5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
              <PhoneIcon className="h-3.5 w-3.5 text-[#12324f]" />
            </span>
            <span>
              Technical Helpline:{" "}
              <strong className="font-semibold"> +91 95866 10281</strong>
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
}