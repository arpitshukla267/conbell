"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, PhoneCall } from "lucide-react";
import type { Service } from "../data/services";

interface ServiceShowcaseProps {
  service: Service;
  allServices: Service[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.96, x: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServiceShowcase({
  service,
  allServices,
}: ServiceShowcaseProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[92%] max-w-[1400px]">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 text-sm text-slate-500"
        >
          <Link href="/" className="transition-colors hover:text-[#00355F]">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link
            href="/our-expertise"
            className="transition-colors hover:text-[#00355F]"
          >
            Our Expertise
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="font-medium text-slate-900">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT: Heading + Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col lg:col-span-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight"
            >
              {service.title}
            </motion.h1>

            <motion.div
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="md:hidden my-6 relative lg:col-span-6"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              {service.description}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-base leading-relaxed text-slate-600"
            >
              {service.contribution}
            </motion.p>

            {/* Specs */}
            <motion.div
              variants={itemVariants}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {service.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="border-l-2 border-slate-200 pl-4"
                >
                  <p className="text-sm text-slate-500">{spec.label}</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {spec.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00355F] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#08243e]"
              >
                <PhoneCall size={16} />
                Enquire For This Service
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                View Product Catalog
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT: Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="hidden md:block relative lg:col-span-6"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
