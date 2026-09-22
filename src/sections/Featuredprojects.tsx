"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
});

interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  filter: "heavy-fabrication" | "automotive" | "conveyor-systems";
}

const PROJECTS: Project[] = [
  {
    id: "1",
    category: "Infrastructure",
    title: "Overhead Heavy Beam Gantry",
    description: "Automotive assembly line plant retrofit",
    image: "/capabilites/cnc-machining.png",
    filter: "automotive",
  },
  {
    id: "2",
    category: "High-Precision CNC",
    title: "High-Pressure Hydraulic Couplers",
    description: "SS316 turned parts with 0.008mm runout",
    image: "/capabilites/cnc-machining.png",
    filter: "heavy-fabrication",
  },
  {
    id: "3",
    category: "Sheet Metal",
    title: "IP65 Automation Enclosures",
    description: "Modular industrial control room panels",
    image: "/capabilites/cnc-machining.png",
    filter: "heavy-fabrication",
  },
  {
    id: "4",
    category: "Handling Systems",
    title: "Continuous Roller Conveyor Track",
    description: "Heavy logistics sortation system frames",
    image: "/capabilites/cnc-machining.png",
    filter: "conveyor-systems",
  },
];

const FILTERS = [
  { label: "All Projects", value: "all" },
  { label: "Heavy Fabrication", value: "heavy-fabrication" },
  { label: "Automotive", value: "automotive" },
  { label: "Conveyor Systems", value: "conveyor-systems" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

function CardSkeleton() {
  return (
    <div className="relative h-[350px] w-full overflow-hidden rounded-2xl bg-gray-200">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 space-y-2 p-5">
        <div className="h-3 w-20 rounded bg-gray-300" />
        <div className="h-5 w-3/4 rounded bg-gray-300" />
        <div className="h-3 w-1/2 rounded bg-gray-300" />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative h-[350px] w-full overflow-hidden rounded-2xl">
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 25vw"
      />

      {/* Gradient overlay: #213145 — 90% opacity at bottom (0%), 20% at 50%, 0% at top (100%) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(33,49,69,0.9) 0%, rgba(33,49,69,0.2) 50%, rgba(33,49,69,0) 100%)",
        }}
      />
      {/* gradient is baked into the source image */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[13px] font-medium text-white/80">
          {project.category}
        </p>
        <h3
          className={`${manrope.className} mt-1 text-lg font-bold text-white`}
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-[#D3E4FE]">{project.description}</p>
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const activeEl = filterRefs.current[activeFilter];
    if (activeEl) {
      setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    }
  }, [activeFilter]);

  useEffect(() => {
    setIsLoading(true);
    setActiveIndex(0);
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, [activeFilter]);

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.filter === activeFilter);

  const goPrev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? filteredProjects.length - 1 : prev - 1,
    );

  const goNext = () =>
    setActiveIndex((prev) =>
      prev === filteredProjects.length - 1 ? 0 : prev + 1,
    );

  return (
    <section className="bg-[#F8F9FF] px-6 py-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Header row */}
        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="text-[13px] font-semibold tracking-wider text-[#0F4C81]">
              FABRICATION PORTFOLIO
            </p>
            <h2
              className={`${manrope.className} mt-2 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
            >
              Featured Projects &amp; Applications
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
              Visual documentation of recent components, industrial framework
              installations, and custom engineering projects delivered to
              clients across India.
            </p>
          </div>

          {/* Sliding filter pills */}
          <div
            className={`hidden md:block
              w-full
              overflow-x-auto
              rounded-2xl
              border
              border-blue-100
              bg-[#E5EEFF]
              p-1.5
              backdrop-blur-sm
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              justify-self-end
            `}
          >
            <div className="relative hidden md:flex min-w-max items-center">
              {/* Sliding active background */}
              <div
                className={`
                  pointer-events-none
                  absolute
                  top-0
                  bottom-0
                  rounded-xl
                  bg-[#0F4C81]
                  shadow-[0_4px_14px_rgba(15,23,42,0.12)]
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                `}
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
                      px-3
                      py-3
                      text-[13px]
                      font-semibold
                      transition-colors
                      duration-300
                      sm:px-5
                      sm:text-sm
                      ${
                        isActive
                          ? "text-white"
                          : " text-[#5B5E67] hover:text-[#0B1C30]"
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

        {/* ================= DESKTOP GRID (sm and up) — unchanged ================= */}
        <div className="hidden sm:grid grid-cols-2 gap-6 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
        </div>

        {/* ================= MOBILE CAROUSEL (below sm) ================= */}
        <div className="relative sm:hidden">
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <>
              {/* Track */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="w-full shrink-0 px-1">
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Side arrows */}
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous project"
                className="absolute left-0 top-[165px] -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F4C81] shadow-md active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next project"
                className="absolute right-0 top-[165px] translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F4C81] shadow-md active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dots indicator */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {filteredProjects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-6 bg-[#0F4C81]"
                        : "w-2 bg-[#C6D7F2]"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
