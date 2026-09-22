"use client";

import {
  Gauge,
  Users,
  Clock,
  ShieldCheck,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Manrope } from "next/font/google";
import { motion, type Variants } from "framer-motion";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const STRENGTHS = [
  {
    icon: Gauge,
    title: "Precision Fabrication",
    description:
      "State-of-the-art CNC machining, high-accuracy fiber laser cutting, and certified structural welding delivering micron-level tolerances and dependable structural integrity.",
  },
  {
    icon: Users,
    title: "Strong Engineering Team",
    description:
      "Experienced CAD/CAM design engineers, structural analysts, and fabrication specialists dedicated to optimizing designs for manufacturability and performance.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "Disciplined production planning, real-time milestone monitoring, and dependable logistics ensure critical project dispatches arrive precisely on schedule.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "Rigorous quality control protocols, certified raw materials, certified non-destructive weld testing (NDT), and calibrated dimensional verification.",
  },
  {
    icon: Globe,
    title: "Pan-India Project Capability",
    description:
      "Proven capability to execute, supply, and support installation for large-scale conveyor and heavy industrial structural projects across India.",
  },
];

const HEADING_LINES = ["Why", "Choose", "Us?"];

// Circle color rhythm: alternating light / navy, with a gold accent
// reserved for the final point as a closing highlight.
function getCircleStyle(index: number, isLast: boolean) {
  if (isLast) {
    return {
      bg: "bg-[#C9A227]",
      ring: "border-white",
      text: "text-white",
    };
  }
  if (index % 2 === 0) {
    return {
      bg: "bg-[#EEF4FF]",
      ring: "border-[#00355F]",
      text: "text-[#00355F]",
    };
  }
  return {
    bg: "bg-[#00355F]",
    ring: "border-white",
    text: "text-white",
  };
}

const lineVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
  },
};

const headingContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const circleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
  },
};

export default function CoreStrengthsSection() {
  return (
    <section className="bg-white lg:overflow-visible overflow-hidden">
      <div className="mx-auto grid max-w-[100%] grid-cols-1 lg:grid-cols-[660px_minmax(0,1fr)]">
        {/* ================= LEFT DARK PANEL ================= */}
        <div className="flex flex-col justify-between bg-[#00355F] px-8 py-16 sm:px-14 sm:py-20 lg:px-14 lg:py-16">
          <div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={headingContainerVariants}
              className={`${manrope.className} text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[54px] lg:text-[58px]`}
            >
              {HEADING_LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span variants={lineVariants} className="block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUpVariants}
              className="mt-6 max-w-[320px] text-[16px] font-normal leading-[1.6] text-[#B9C7D6]"
            >
              Engineering excellence and precision fabrication you can build a
              project timeline around.
            </motion.p>
          </div>

          <motion.a
            href="#contact"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUpVariants}
            className="group mt-14 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 lg:mt-0"
          >
            Get In Touch
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2.4}
            />
          </motion.a>
        </div>

        {/* ================= RIGHT LIST PANEL ================= */}
        <div className="flex flex-col justify-center gap-8 bg-white px-4 py-16 sm:px-14 sm:py-20 lg:gap-14 lg:px-16 lg:py-16 xl:px-20">
          {STRENGTHS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === STRENGTHS.length - 1;
            const circle = getCircleStyle(index, isLast);

            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={itemVariants}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-6 sm:gap-8"
              >
                {/* Numbered Circle — shifted left at lg+ so it sits half in
                    the navy panel, half in the white panel, on the seam.
                    transform (not margin) is used so it doesn't drag the
                    text block along with it. Mobile flow is untouched. */}
                <motion.div
                  variants={circleVariants}
                  className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-4 shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:h-[80px] sm:w-[80px] lg:relative lg:z-10 lg:-translate-x-[104px] xl:-translate-x-[120px] ${circle.bg} ${circle.ring}`}
                >
                  <Icon
                    className={`h-7 w-7 sm:h-8 sm:w-8 ${circle.text}`}
                    strokeWidth={2.2}
                  />
                </motion.div>

                {/* Text */}
                <div className="pt-1">
                  <h3
                    className={`${manrope.className} mb-2 text-[19px] font-bold leading-[1.3] text-[#10243E] sm:text-[21px]`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] font-normal leading-[1.65] text-[#6B7280] self-start text-left">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
