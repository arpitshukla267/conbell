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
  imageDesktop: string;
  imageMobile: string;
  heading: string;
  accentHeading: string;
  subtext: string;
}

const slides: Slide[] = [
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

// Set this to your actual navbar height (in px). If your navbar height
// differs between mobile and desktop, expose it as a CSS variable
// (e.g. `--navbar-height`) on your layout instead and it will be picked
// up automatically via the fallback below.
const NAVBAR_HEIGHT_PX = 80;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    handleResize();
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      aria-roledescription="carousel"
      aria-label="Company introduction slides"
    >
      {/* Progress bar keyframes */}
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

      {/* Sliding track */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-[900ms] ease-in-out"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative h-full flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            {isMobile ? (
              <Image
                src={slide.imageMobile}
                 alt=""
                 fill
                 priority={index === 0}
                 className="object-cover"
              />
            ) : (
            <Image
              src={slide.imageDesktop}
              alt=""
              fill
              priority={index === 0}
              className="object-cover"
            />
            )}
          </div>
        ))}
      </div>

      {/* Dots / progress bars — centered on the X axis */}
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
