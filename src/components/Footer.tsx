"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Manrope, Inter } from "next/font/google";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products & Capabilities", href: "/products" },
  { label: "Our Presence", href: "/our-presence" },
  { label: "Client", href: "/client" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`${manrope.variable} ${inter.variable} relative overflow-hidden bg-[#0B1C30]`}
    >
      <div className="mx-auto max-w-[95%] px-6 pb-10 pt-12 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.2fr]">
          {/* Company blurb */}
          <div>
            <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-white">
              CONBELL ENGINEERING
            </h2>
            <p className="mt-4 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#AEB7C7]">
              A trusted engineering partner delivering precision fabrication
              and industrial solutions across automotive, defense, power, and
              infrastructure sectors.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-xs font-bold tracking-wide text-white transition-colors hover:text-[#7FB2E5]"
            >
              VIEW MORE
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-white">
              QUICK LINKS
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-start gap-1.5 font-[family-name:var(--font-inter)] text-sm text-[#AEB7C7] transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#0F4C81]"
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-white">
              CONTACT US
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0F4C81]"
                  aria-hidden="true"
                />
                <p className="font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#AEB7C7]">
                  <span className="font-semibold text-white">Factory – </span>
                  Survey No. 298/A, Vadavswami-Ambapura Road, Village:
                  Vadavswami, Ta.: Kalol (N.G) – 382740, Gujarat.
                </p>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone
                  className="h-4 w-4 flex-shrink-0 text-[#0F4C81]"
                  aria-hidden="true"
                />
                <a
                  href="tel:+919586610281"
                  className="font-[family-name:var(--font-inter)] text-sm text-[#AEB7C7] transition-colors hover:text-white"
                >
                  +91-95866 10281
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail
                  className="h-4 w-4 flex-shrink-0 text-[#0F4C81]"
                  aria-hidden="true"
                />
                <a
                  href="mailto:info@conbellengineering.com"
                  className="font-[family-name:var(--font-inter)] text-sm text-[#AEB7C7] transition-colors hover:text-white"
                >
                  info@conbellengineering.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[95%] flex-col items-center gap-2 px-6 py-5 text-center md:px-10 lg:px-16">
          <p className="font-[family-name:var(--font-inter)] text-sm text-[#AEB7C7]">
            Copyright © ConBell Engineering Pvt Ltd 2024–2025. All Rights
            Reserved.
          </p>
        </div>

        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() =>
            typeof window !== "undefined" &&
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="absolute right-6 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md bg-[#1B2E45] text-white transition-colors hover:bg-[#0F4C81] md:right-10 lg:right-16"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Full-width logo, slides up into view the first time the footer is scrolled into frame */}
      <div className="relative h-20 w-full overflow-hidden sm:h-28 md:h-36 lg:h-56">
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <Image
            src="/logo.png"
            alt="ConBell Engineering"
            fill
            className="object-fit object-bottom opacity-40 grayscale"
            sizes="100vw"
          />
        </div>
      </div>
    </footer>
  );
}