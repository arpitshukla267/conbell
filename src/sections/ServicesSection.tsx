"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// ---------- Types ----------
import { SERVICES, type Service, type Category, type Spec } from "../data/services";

// ---------- Scroll-in-view hook ----------
// Fires once when the element enters the viewport, then disconnects.

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the element is already on-screen on mount, just show it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

// ---------- Handwriting-style reveal ----------
// Splits text into characters (or words) and fades/settles each one in with
// its own delay, so the text appears to be written stroke by stroke instead
// of flashing in all at once.

function AnimatedReveal({
  text,
  inView,
  splitBy = "char",
  baseDelay = 0,
  stepDelay = 55,
  duration = 750,
  className = "",
  style,
}: {
  text: string;
  inView: boolean;
  splitBy?: "char" | "word";
  baseDelay?: number;
  stepDelay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const units = splitBy === "char" ? Array.from(text) : text.split(/(\s+)/);

  return (
    <span className={className} style={style} aria-label={text}>
      {units.map((unit, i) => {
        const isSpace = unit.trim() === "";
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? "translateY(0) rotate(0deg)"
                : "translateY(12px) rotate(-3deg)",
              filter: inView ? "blur(0px)" : "blur(2.5px)",
              whiteSpace: isSpace ? "pre" : undefined,
              transitionProperty: "opacity, transform, filter",
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
              transitionDelay: `${baseDelay + i * stepDelay}ms`,
            }}
          >
            {unit}
          </span>
        );
      })}
    </span>
  );
}

// ---------- Data ----------

const FILTERS: { label: string; value: Category }[] = [
  { label: "All Services", value: "all" },
  { label: "Conveyor Structures", value: "conveyor" },
  { label: "Assembly Lines", value: "assembly" },
  { label: "Platforms & Walkways", value: "platform" },
  { label: "Heavy Fabrication", value: "fabrication" },
];


// ---------- Service Card ----------
// Each card watches its own viewport entry, so on a grid/stack layout every
// card's text rises up from the bottom independently as it comes into view.

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [cardRef, cardInView] = useInView<HTMLElement>({ threshold: 0.25 });

  return (
    <article
      ref={cardRef}
      data-card
      className="
        flex
        h-[520px]
        w-full
        shrink-0
        snap-start
        flex-col
        overflow-hidden
        rounded-[16px]
        bg-white
        shadow-[0_1px_2px_rgba(15,42,74,0.05),0_10px_30px_rgba(15,42,74,0.06)]
        transition-transform
        duration-300
        hover:-translate-y-1
        sm:w-[calc(50%-10px)]
        lg:w-[calc(33.333%-14px)]
        xl:w-[calc(33.333%-14px)]
      "
    >
      {/* Image — 45% */}
      <div className="relative h-[45%] shrink-0 overflow-hidden bg-slate-800">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="
            (max-width: 640px) 90vw,
            (max-width: 1024px) 45vw,
            33vw
          "
          className="
            object-cover
            transition-transform
            duration-700
            ease-out
            hover:scale-[1.04]
          "
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        {/* Badge */}
        {/* <span
          className="
            absolute
            left-4
            top-4
            rounded-lg
            bg-white/90
            px-3
            py-1.5
            text-[11px]
            font-semibold
            text-[#00355F]
            shadow-sm
            backdrop-blur-md
          "
        >
          {service.badge}
        </span> */}
      </div>

      {/* Content — 55% — text rises bottom to top as this card enters the viewport */}
      <div
        className={`
          flex h-[55%] min-h-0 flex-col p-5
          transition-all duration-[900ms] ease-out
          ${cardInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        style={{ transitionDelay: `${index * 90}ms` }}
      >
        <h3
          className={`
            mb-2 text-[18px] font-bold leading-[1.3] tracking-[-0.015em] text-slate-900
            transition-all duration-700 ease-out
            ${cardInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
          `}
          style={{ transitionDelay: `${index * 90 + 60}ms` }}
        >
          {service.title}
        </h3>

        <p
          className={`
            mb-4 line-clamp-2 text-[13px] font-normal leading-6 text-slate-600
            transition-all duration-700 ease-out
            ${cardInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
          `}
          style={{ transitionDelay: `${index * 90 + 140}ms` }}
        >
          {service.description}
        </p>

        {/* Specs */}
        <dl
          className={`
            mb-4 flex-1 overflow-hidden rounded-md bg-[#EFF4FF] px-4 py-1
            transition-all duration-700 ease-out
            ${cardInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
          `}
          style={{ transitionDelay: `${index * 90 + 220}ms` }}
        >
          {service.specs.map((spec) => (
            <div
              key={spec.label}
              className="
                border-b
                border-blue-100/70
                py-1.5
                text-[12px]
                leading-5
                last:border-b-0
              "
            >
              <dt className="inline font-semibold text-slate-800">
                {spec.label}:{" "}
              </dt>
              <dd className="inline font-normal text-slate-600">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Buttons */}
        <div
          className={`
            flex gap-2.5
            transition-all duration-700 ease-out
            ${cardInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
          `}
          style={{ transitionDelay: `${index * 90 + 300}ms` }}
        >
          <Link
            href={`/our-expertise/${service.id}`}
            className="
              flex-1
              rounded-md
              border
              border-[#00355F]
              px-3
              py-2.5
              text-center
              text-[12.5px]
              font-semibold
              text-[#00355F]
              transition-colors
              hover:bg-[#00355F]
              hover:text-white
            "
          >
            Learn More
          </Link>
          <Link
            href="/contact"
            className="
              flex-1
              rounded-md
              bg-[#00355F]
              px-3
              py-2.5
              text-center
              text-[12.5px]
              font-semibold
              text-white
              transition-colors
              hover:bg-[#0b2640]
            "
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </article>
  );
}

// ---------- Skeleton ----------

function ServiceSkeleton() {
  return (
    <div
      className="
        flex
        h-[520px]
        w-full
        shrink-0
        flex-col
        overflow-hidden
        rounded-[20px]
        bg-white
        shadow-[0_1px_2px_rgba(15,42,74,0.05),0_10px_30px_rgba(15,42,74,0.06)]
      "
    >
      {/* Image skeleton - 45% */}
      <div className="relative h-[45%] shrink-0 overflow-hidden bg-slate-200">
        <div className="shimmer absolute inset-0" />
        <div className="absolute left-4 top-4 h-6 w-28 rounded-md bg-slate-300" />
      </div>

      {/* Content skeleton - 55% */}
      <div className="flex h-[55%] flex-col p-5">
        <div className="relative mb-3 h-6 w-[78%] overflow-hidden rounded-md bg-slate-200">
          <div className="shimmer absolute inset-0" />
        </div>

        <div className="relative mb-2 h-4 w-full overflow-hidden rounded bg-slate-100">
          <div className="shimmer absolute inset-0" />
        </div>

        <div className="relative mb-5 h-4 w-[85%] overflow-hidden rounded bg-slate-100">
          <div className="shimmer absolute inset-0" />
        </div>

        <div className="relative mb-5 flex-1 overflow-hidden rounded-xl bg-blue-50">
          <div className="shimmer absolute inset-0" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-[80%] rounded bg-blue-100" />
            <div className="h-3 w-[90%] rounded bg-blue-100" />
            <div className="h-3 w-[70%] rounded bg-blue-100" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative h-11 flex-1 overflow-hidden rounded-lg bg-slate-100">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="relative h-11 flex-1 overflow-hidden rounded-lg bg-slate-200">
            <div className="shimmer absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Component ----------

export default function ServicesSection() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [displayServices, setDisplayServices] = useState<Service[]>(SERVICES);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
  });

  // Viewport-triggered animation hooks
  const [headerRef, headerInView] = useInView<HTMLDivElement>();

  // ---------- Filter indicator position ----------

  const updateFilterIndicator = () => {
    const activeButton = filterRefs.current[activeFilter];
    if (!activeButton) return;

    setIndicator({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  };

  useEffect(() => {
    updateFilterIndicator();

    const handleResize = () => {
      updateFilterIndicator();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeFilter]);

  // ---------- Initial loading ----------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDisplayServices(SERVICES);
      setIsLoading(false);
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // ---------- Filter change ----------

  useEffect(() => {
    if (activeFilter === "all" && !isLoading) {
      setDisplayServices(SERVICES);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setActiveIndex(0);

    const timer = window.setTimeout(() => {
      const filtered =
        activeFilter === "all"
          ? SERVICES
          : SERVICES.filter((service) => service.category === activeFilter);

      setDisplayServices(filtered);
      setIsLoading(false);

      requestAnimationFrame(() => {
        trackRef.current?.scrollTo({
          left: 0,
          behavior: "instant",
        });
        updateScrollState();
      });
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeFilter]);

  // ---------- Carousel ----------

  const getCardStep = () => {
    const track = trackRef.current;
    if (!track) return 0;

    const card = track.querySelector<HTMLElement>("[data-card]");
    if (!card) return 0;

    const gap = parseFloat(getComputedStyle(track).columnGap || "24");
    return card.getBoundingClientRect().width + gap;
  };

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    setCanScrollPrev(track.scrollLeft > 2);
    setCanScrollNext(track.scrollLeft < maxScroll);

    const step = getCardStep();
    if (step > 0) {
      setActiveIndex(Math.round(track.scrollLeft / step));
    }
  };

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const step = getCardStep();
    if (!step) return;

    track.scrollBy({
      left: dir * step,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const step = getCardStep();
    if (!step) return;

    track.scrollTo({
      left: index * step,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        updateScrollState();
      });
    };

    const onResize = () => {
      updateScrollState();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    updateScrollState();

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [displayServices, isLoading]);

  // ---------- Render ----------

  return (
    <section className={`${manrope.className} bg-[#EFF4FF] py-16 sm:py-20`}>
      <div className="mx-auto w-[90%] max-w-[1440px]">
        <div className="grid grid-cols-1 items-end gap-6 mb-12 lg:grid-cols-[6fr_4fr]">
          {/* Header */}
          <div ref={headerRef}>
            <div
              className={`
                mb-2 inline-flex items-center gap-2 rounded-full bg-[#DCE9FF] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00355F]
                transition-all duration-700 ease-out
                ${headerInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
              `}
              style={{ transitionDelay: "0ms" }}
            >
              <span>Core Capabilities</span>
            </div>

            <h2 className="max-w-2xl text-3xl font-bold leading-[1.15] tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-[44px]">
              <AnimatedReveal
                text="Our Expertise"
                inView={headerInView}
                splitBy="char"
                baseDelay={20}
                stepDelay={10}
                duration={100}
              />
            </h2>

            <p className="mt-3 max-w-2xl text-[14.5px] font-normal leading-7 text-slate-600 sm:text-[15.5px]">
              <AnimatedReveal
                text="Comprehensive conveyor support structures, overhead systems, assembly lines, walkways, and custom heavy fabrication engineered for superior performance and durability."
                inView={headerInView}
                splitBy="word"
                baseDelay={200}
                stepDelay={20}
                duration={100}
              />
            </p>
          </div>

          {/* Filter Bar */}
          <div
            className="
              w-full
              overflow-x-auto
              rounded-2xl
              border
              border-blue-100
              bg-white/80
              p-1.5
              backdrop-blur-sm
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              lg:justify-self-end
            "
          >
            <div className="relative flex min-w-max items-center">
              {/* Sliding active background */}
              <div
                className="
                  pointer-events-none
                  absolute
                  top-0
                  bottom-0
                  rounded-xl
                  bg-[#00355F]
                  shadow-[0_4px_14px_rgba(0,53,95,0.2)]
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                "
                style={{
                  left: indicator.left,
                  width: indicator.width,
                }}
              />

              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    ref={(element) => {
                      filterRefs.current[filter.value] = element;
                    }}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`
                      relative
                      z-10
                      whitespace-nowrap
                      rounded-xl
                      px-3.5
                      py-2.5
                      text-[13px]
                      font-medium
                      transition-colors
                      duration-300
                      sm:px-4
                      sm:text-sm
                      ${
                        isActive
                          ? "text-white"
                          : "text-slate-600 hover:text-slate-900"
                      }
                    `}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================
            SERVICES CAROUSEL
        ====================================================== */}

        <div className="relative">
          {/* Previous Button */}
          <button
            type="button"
            aria-label="Previous services"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev || isLoading}
            className="
              absolute
              left-0
              top-1/2
              z-20
              flex
              h-11
              w-11
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              shadow-lg
              shadow-slate-900/10
              transition-all
              hover:scale-105
              disabled:pointer-events-none
              disabled:opacity-30
              sm:-left-5
            "
          >
            <ChevronLeft className="h-[18px] w-[18px] text-slate-700" />
          </button>

          {/* Track */}
          <div
            ref={trackRef}
            className="
              flex
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              scroll-smooth
              pb-4
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {isLoading ? (
              <>
                <div className="w-full shrink-0 sm:hidden">
                  <ServiceSkeleton />
                </div>
                <div className="hidden w-full shrink-0 gap-5 sm:flex">
                  <div className="w-[calc(50%-10px)] shrink-0">
                    <ServiceSkeleton />
                  </div>
                  <div className="w-[calc(50%-10px)] shrink-0">
                    <ServiceSkeleton />
                  </div>
                </div>
                <div className="hidden w-full shrink-0 gap-5 lg:flex">
                  <div className="w-[calc(33.333%-14px)] shrink-0">
                    <ServiceSkeleton />
                  </div>
                  <div className="w-[calc(33.333%-14px)] shrink-0">
                    <ServiceSkeleton />
                  </div>
                  <div className="w-[calc(33.333%-14px)] shrink-0">
                    <ServiceSkeleton />
                  </div>
                </div>
              </>
            ) : (
              displayServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            aria-label="Next services"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext || isLoading}
            className="
              absolute
              right-0
              top-1/2
              z-20
              flex
              h-11
              w-11
              translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              shadow-lg
              shadow-slate-900/10
              transition-all
              hover:scale-105
              disabled:pointer-events-none
              disabled:opacity-30
              sm:-right-5
            "
          >
            <ChevronRight className="h-[18px] w-[18px] text-slate-700" />
          </button>
        </div>

        {/* Mobile dots */}
        {!isLoading && (
          <div className="mt-5 flex justify-center gap-1.5 sm:hidden">
            {displayServices.map((service, index) => (
              <button
                key={service.id}
                type="button"
                aria-label={`Go to service ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === activeIndex
                      ? "w-6 bg-[#00355F]"
                      : "w-1.5 bg-slate-300"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
