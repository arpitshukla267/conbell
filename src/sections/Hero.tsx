"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

interface Slide {
  id: number;
  image: string;
  heading: string;
  accentHeading: string;
  subtext: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/hero/hero1.png",
    heading: "Precision Metal Manufacturing.",
    accentHeading: "Engineered for Industrial Excellence.",
    subtext:
      "Delivering end-to-end heavy fabrication, precision CNC machining, and specialized metal structures with strict dimensional tolerance control, certified metallurgy, and reliable turnkey project deployment.",
  },
  {
    id: 2,
    image: "/hero/hero1.png",
    heading: "Certified Quality Systems.",
    accentHeading: "ISO-Compliant From Start to Finish.",
    subtext:
      "Every component passes through rigorous inspection, full material traceability, and documented quality control to meet the strictest industrial standards.",
  },
  {
    id: 3,
    image: "/hero/hero1.png",
    heading: "Turnkey Project Deployment.",
    accentHeading: "From Blueprint to Installed Structure.",
    subtext:
      "Our teams manage design review, fabrication, finishing, and on-site installation, so your project moves forward without coordination gaps.",
  },
  {
    id: 4,
    image: "/hero/hero1.png",
    heading: "Trusted by Industry Leaders.",
    accentHeading: "Decades of Fabrication Expertise.",
    subtext:
      "Partnering with manufacturers across heavy industry, energy, and infrastructure to deliver components that perform under demanding conditions.",
  },
];

const AUTOPLAY_MS = 5000;

// Set this to your actual navbar height (in px). If your navbar height
// differs between mobile and desktop, expose it as a CSS variable
// (e.g. `--navbar-height`) on your layout instead and it will be picked
// up automatically via the fallback below.
const NAVBAR_HEIGHT_PX = 80;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  };

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDotClick = (index: number) => {
    goTo(index);
    startAutoplay();
  };

  return (
    <section
      className={`${manrope.className} relative w-full overflow-hidden bg-[#0a1420]`}
      style={{
        height: `calc(98vh - var(--navbar-height, ${NAVBAR_HEIGHT_PX}px))`,
        minHeight: "420px",
      }}
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      aria-roledescription="carousel"
      aria-label="Company introduction slides"
    >
      {/* Slides */}
      <div className="absolute inset-0 h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
            />

            {/* Content */}
            {/* <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col justify-center px-6 max-md:justify-start max-md:px-6 max-md:pb-24 max-md:pt-16 md:px-12">
              <h1 className="max-w-[820px] text-[28px] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[48px]">
                {slide.heading}
                <span className="block text-[#9cc4f5]">
                  {slide.accentHeading}
                </span>
              </h1>

              <p className="mt-5 max-w-[560px] text-sm font-semibold leading-relaxed text-[#d7dfe8] sm:text-base">
                {slide.subtext}
              </p>

              <div className="mt-8 flex flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-[#2f6fed] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2a5fd1] active:translate-y-px"
                >
                  Explore Products &amp; Capabilities
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 flex-shrink-0"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-[2px] transition-colors hover:bg-white/20 active:translate-y-px"
                >
                  Send Technical RFQ
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 flex-shrink-0"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </a>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Dots — centered on the X axis */}
      <div
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 max-md:bottom-[18px]"
        role="tablist"
        aria-label="Slide navigation"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === current}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
              index === current ? "w-7 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}