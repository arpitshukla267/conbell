"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

import { fetchFromBackend } from "../lib/api";

interface Slide {
  id: number;
  imageDesktop: string;
  imageMobile: string;
  heading: string;
  accentHeading: string;
  subtext: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    imageDesktop: "/hero/hero1.webp",
    imageMobile: "/hero/hero1-mobile.webp",
    heading: "Precision Metal Manufacturing.",
    accentHeading: "Engineered for Industrial Excellence.",
    subtext:
      "Delivering end-to-end heavy fabrication, precision CNC machining, and specialized metal structures with strict dimensional tolerance control, certified metallurgy, and reliable turnkey project deployment.",
  },
  {
    id: 2,
    imageDesktop: "/hero/hero2.webp",
    imageMobile: "/hero/hero2-mobile.webp",
    heading: "Certified Quality Systems.",
    accentHeading: "ISO-Compliant From Start to Finish.",
    subtext:
      "Every component passes through rigorous inspection, full material traceability, and documented quality control to meet the strictest industrial standards.",
  },
  {
    id: 3,
    imageDesktop: "/hero/hero3.webp",
    imageMobile: "/hero/hero3-mobile.webp",
    heading: "Turnkey Project Deployment.",
    accentHeading: "From Blueprint to Installed Structure.",
    subtext:
      "Our teams manage design review, fabrication, finishing, and on-site installation, so your project moves forward without coordination gaps.",
  },
];

const AUTOPLAY_MS = 3000;
const NAVBAR_HEIGHT_PX = 80;

// Renders a <picture> so the browser picks the right image via CSS media
// queries (no JS, no hydration swap, and only ONE image is downloaded).
function SlideImage({ slide }: { slide: Slide }) {
  const common = {
    alt: `${slide.heading} - ${slide.accentHeading}`,
    fill: true,
    sizes: "100vw",
    priority: true,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: slide.imageDesktop });

  const {
    props: { srcSet: mobileSrcSet, ...imgProps },
  } = getImageProps({ ...common, src: slide.imageMobile });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...imgProps}
        alt={`${slide.heading} - ${slide.accentHeading}`}
        className="object-cover md:object-fill"
      />
    </picture>
  );
}

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchFromBackend<any[]>("/api/hero/active", []).then((data) => {
      if (data && data.length > 0) {
        setSlides(
          data.map((item, idx) => ({
            id: idx + 1,
            imageDesktop: item.imageDesktop || "/hero/hero1.webp",
            imageMobile: item.imageMobile || item.imageDesktop || "/hero/hero1-mobile.webp",
            heading: item.heading || "",
            accentHeading: item.accentHeading || "",
            subtext: item.subtext || "",
          }))
        );
      }
    });
  }, []);

  const goTo = (index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

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
      aria-roledescription="carousel"
      aria-label="Company introduction slides"
    >
      <style jsx global>{`
        @keyframes heroProgressFill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>

      {/* Sliding track: 100% wide, each slide is 100% of it, so the translate
          is a clean multiple of 100% (no 33.333% rounding jitter). */}
      <div
        className="absolute inset-0 flex will-change-transform transition-transform duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-full w-full flex-shrink-0">
            <SlideImage slide={slide} />
          </div>
        ))}
      </div>

      {/* Dots / progress bars */}
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
            className={`relative h-2 overflow-hidden rounded-full bg-white/40 transition-[width] duration-300 ease-in-out ${
              index === current ? "w-10" : "w-2"
            }`}
          >
            {index === current && (
              <span
                key={current}
                className="absolute inset-0 origin-left rounded-full bg-white"
                style={{
                  animation: `heroProgressFill ${AUTOPLAY_MS}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
