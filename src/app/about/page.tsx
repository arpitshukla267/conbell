"use client";

import Image from "next/image";
import Link from "next/link";
import { Manrope, Inter } from "next/font/google";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  ChevronRight,
  Factory,
  Eye,
  Flag,
  ShieldCheck,
  Award,
  HeartHandshake,
  Users,
  Lightbulb,
  Handshake,
  Target,
  User,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

// Single source of truth for the heading blue used across every
// section — matches the "About Conbell Engineering" hero heading.
const HEADING_COLOR = "text-[#00355F]";

/* ============================================================
   ANIMATION HELPERS
   ============================================================ */

const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.02,
    },
  },
};

const wordItem: Variants = {
  hidden: { opacity: 0, y: "0.55em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedHeading({
  text,
  as: Tag = "h2",
  className = "",
  viewportAmount = 0.6,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  viewportAmount?: number;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={className}
      variants={wordContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordItem}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  as?: "div" | "section";
}) {
  const MotionTag = as === "section" ? motion.section : motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function StaggerGrid({
  children,
  className = "",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   DATA
   ============================================================ */

const MISSION_POINTS = [
  "Deliver high-quality fabrication and engineering solutions that meet and exceed customer expectations.",
  "Maintain precision, safety, and reliability in every project we execute.",
  "Build long-term relationships through integrity, transparency, and consistent performance.",
  "Continuously improve through technology adoption, skilled manpower, and process excellence.",
  "Contribute to industrial growth by providing on-time, cost-effective, and engineered solutions.",
];

// Extracted verbatim (topic + description) from the Conbell Engineering
// Core Values document.
const CORE_VALUES = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "We are committed to delivering precision-engineered and durable solutions, ensuring quality in materials, workmanship, and processes at every stage.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Ethics",
    description:
      "We conduct our business with honesty, transparency, and accountability, building trust with clients, partners, and employees.",
  },
  {
    icon: Target,
    title: "Safety Commitment",
    description:
      "We prioritize health, safety, and environmental responsibility, ensuring a safe workplace and compliance with all statutory and safety standards.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Focus",
    description:
      "We listen, understand, and respond proactively to customer needs, delivering reliable solutions on time and within agreed parameters.",
  },
  {
    icon: Lightbulb,
    title: "Engineering Excellence",
    description:
      "We believe in technical competence, innovation, and continuous improvement to deliver efficient and value-driven engineering solutions.",
  },
  {
    icon: Users,
    title: "Teamwork & Respect",
    description:
      "We foster a culture of collaboration, mutual respect, and skill development, recognizing people as our strongest asset.",
  },
  {
    icon: Handshake,
    title: "Commitment & Ownership",
    description:
      "We take full ownership of our work, standing by our commitments and delivering results with responsibility and pride.",
  },
];

// Leadership fields are intentionally left as placeholders — designation,
// photo, and message to be provided by the client. No details invented.
const FOUNDERS = [
  { name: "Nirav Patel", designation: "", image: "", message: "" },
  { name: "Dipika Patel", designation: "", image: "", message: "" },
  { name: "Bhavina Patel", designation: "", image: "", message: "" },
  { name: "Heena Patel", designation: "", image: "", message: "" },
];

export default function AboutPage() {
  return (
    <main className={inter.className}>
      {/* ============ HERO ============ */}
      <section className="bg-[#EFF4FF] px-6 pb-10 pt-8">
        <div className="mx-auto max-w-[95%] py-4">
          <Reveal>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#5B5E67]">
              <span>HOME</span>
              <ChevronRight size={13} />
              <span className={`font-semibold ${HEADING_COLOR}`}>ABOUT US</span>
            </div>
          </Reveal>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <Reveal>
                <p className="text-[12px] font-semibold tracking-wider text-[#5B5E67]">
                  ENGINEERING PARTNER YOU CAN TRUST
                </p>
              </Reveal>
              <AnimatedHeading
                as="h1"
                text="About Conbell Engineering"
                className={`${manrope.className} mt-1 text-3xl font-bold ${HEADING_COLOR} sm:text-4xl`}
              />
            </div>
            <Reveal delay={0.15}>
              <p className="text-[15px] leading-relaxed text-[#5B5E67] lg:pt-6">
                A trusted and leading engineering partner in the industrial and
                infrastructure sector, delivering robust, precise, and
                innovative engineering solutions that create long-term value for
                our clients, employees, and stakeholders.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SECTION 1: OUR STORY ============ */}
      <section className="bg-[#F8F9FF] px-6 py-16">
        <div className="mx-auto grid max-w-[95%] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* Single image — stretches to match the content column's height */}
          <Reveal className="relative min-h-[280px] w-full overflow-hidden rounded-2xl bg-gray-200 lg:h-full lg:min-h-0">
            <Image
              src="/about/facility-unit-1.jpg"
              alt="Conbell Engineering Manufacturing Facility"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/60 px-4 py-2.5 text-white">
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <Factory size={14} />
                MANUFACTURING FACILITY
              </span>
            </div>
          </Reveal>

          {/* Content — vertically centered so it visually fills the
              same height as the image */}
          <Reveal delay={0.1} className="flex flex-col justify-center">
            <p className="text-[12px] font-semibold tracking-wider text-[#5B5E67]">
              OUR STORY
            </p>
            <AnimatedHeading
              as="h2"
              text="Engineering Solutions Built on Precision and Trust"
              className={`${manrope.className} max-w-md mt-1 text-2xl font-extrabold leading-snug ${HEADING_COLOR} sm:text-3xl`}
            />
            <p className="mt-4 text-md leading-relaxed text-[#5B5E67]">
              At Conbell Engineering, we are committed to delivering
              high-quality engineering, fabrication, and industrial solutions
              that consistently meet customer requirements, statutory
              obligations, and applicable standards. Every project we undertake
              reflects our discipline in process, our respect for our people,
              and our accountability to the clients who trust us with their most
              demanding industrial challenges. At Conbell Engineering, we are
              committed to delivering high-quality engineering, fabrication, and
              industrial solutions that consistently meet customer requirements,
              statutory obligations, and applicable standards. Every project we
              undertake reflects our discipline in process, our respect for our
              people, and our accountability to the clients who trust us with
              their most demanding industrial challenges.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 2: FOUNDERS ============ */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[95%]">
          <div className="text-center">
            <Reveal>
              <p className="text-[12px] font-semibold tracking-wider text-[#5B5E67]">
                LEADERSHIP
              </p>
            </Reveal>
            <AnimatedHeading
              as="h2"
              text="Meet Our Founders"
              className={`${manrope.className} mt-1 text-3xl font-extrabold ${HEADING_COLOR} sm:text-4xl`}
              viewportAmount={0.6}
            />
          </div>

          <div className="mt-12 flex flex-col gap-16">
            {FOUNDERS.map((person, index) => {
              const imageFirst = index % 2 !== 0; // alternate on desktop: row1 content-left, row2 image-left, ...
              return (
                <div
                  key={person.name}
                  className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  {/* Text block — always after the image on mobile;
                      alternates left/right on desktop */}
                  <Reveal
                    delay={0.1}
                    className={`order-2 text-center lg:text-left ${
                      imageFirst ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <p className="text-[13px] font-semibold tracking-wider text-[#5B5E67]">
                      FOUNDER
                    </p>
                    <p className="mt-4 text-[15px] leading-relaxed text-[#5B5E67]">
                      {person.message || "Founder message to be added."}
                    </p>
                    <h3
                      className={`${manrope.className} mt-6 text-2xl font-bold ${HEADING_COLOR}`}
                    >
                      {person.name}
                    </h3>
                    <p className="mt-1 text-[13px] font-semibold tracking-wide text-[#B5741A]">
                      {(
                        person.designation || "DESIGNATION TO BE ADDED"
                      ).toUpperCase()}
                    </p>

                    <Link
                      href="#contact"
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-[13px] font-semibold text-[#0B1C30] transition-colors hover:bg-[#EFF4FF]"
                    >
                      Get in touch
                      <ArrowUpRight size={14} />
                    </Link>
                  </Reveal>

                  {/* Image block — always first on mobile; alternates
                      left/right on desktop */}
                  <Reveal
                    className={`order-1 relative mx-auto h-[280px] w-full max-w-[420px] overflow-hidden rounded-2xl bg-[#EFF4FF] sm:h-[340px] lg:mx-0 lg:h-[380px] lg:max-w-none ${
                      imageFirst ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User size={48} className="text-[#0F4C81]" />
                      </div>
                    )}
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: VISION & MISSION ============ */}
      {/* Side-by-side, top-aligned — heights are NOT forced to match, so
          Mission's longer list and Vision's single paragraph both sit
          naturally without an artificial equal-height stretch. */}
      <section className="bg-[#F8F9FF] px-6 py-16">
        <div className="mx-auto max-w-[95%]">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <Reveal className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <p
                className={`${manrope.className} flex items-center gap-2 text-[15px] font-bold ${HEADING_COLOR}`}
              >
                <Eye size={18} className="text-[#0F4C81]" />
                Our Vision
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5B5E67]">
                To become a trusted and leading engineering partner in the
                industrial and infrastructure sector by delivering robust,
                precise, and innovative engineering solutions that create
                long-term value for our clients, employees, and stakeholders.
              </p>
            </Reveal>

            <Reveal
              delay={0.1}
              className="rounded-2xl bg-[#0B2A4A] p-6 text-white sm:p-8"
            >
              <p
                className={`${manrope.className} flex items-center gap-2 text-[15px] font-bold`}
              >
                <Flag size={18} className="text-[#7FB2E5]" />
                Our Mission
              </p>
              <motion.ul
                className="mt-4 space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
              >
                {MISSION_POINTS.map((point) => (
                  <motion.li
                    key={point}
                    variants={staggerItem}
                    className="flex items-start gap-2 text-[14px] leading-relaxed text-white/90"
                  >
                    <CheckCircle2
                      size={15}
                      className="mt-0.5 shrink-0 text-[#7FB2E5]"
                    />
                    {point}
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: CORE VALUES ============ */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[100%]">
          <div className="text-center">
            <Reveal>
              <p className="text-[12px] font-semibold tracking-wider text-[#5B5E67]">
                WHAT WE STAND FOR
              </p>
            </Reveal>
            <AnimatedHeading
              as="h2"
              text="Core Values"
              className={`${manrope.className} mt-1 text-2xl font-extrabold ${HEADING_COLOR} sm:text-3xl`}
            />
          </div>

          {/* 2 columns on mobile (instead of 1) keeps this section from
              running long on small screens; sm/lg breakpoints unchanged. */}
          <StaggerGrid className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={staggerItem}
                  className="rounded-xl bg-[#F8F9FF] p-3.5 shadow-sm sm:p-5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF4FF] sm:h-9 sm:w-9">
                    <Icon
                      size={16}
                      className="text-[#0F4C81] sm:h-[17px] sm:w-[17px]"
                    />
                  </div>
                  <h3
                    className={`${manrope.className} mt-3 text-[13px] font-bold ${HEADING_COLOR} sm:mt-4 sm:text-[15px]`}
                  >
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#5B5E67] sm:mt-2 sm:text-[13px]">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </StaggerGrid>
        </div>
      </section>
    </main>
  );
}
