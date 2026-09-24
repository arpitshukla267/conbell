"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { SERVICES } from "../data/services";
import { INDUSTRIES } from "../data/industries";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Our Presence", href: "/our-presence" },
  { label: "Our Expertise", href: "/our-expertise" },
  { label: "Clients", href: "/clients" },
  { label: "Contact Us", href: "/contact" },
];

/** True when `href` matches the current route (exact match for "/", prefix match otherwise). */
function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Tracks whether the page has been scrolled past a small threshold. */
function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function NavbarContent({
  menuOpen,
  setMenuOpen,
  scrolled,
}: {
  menuOpen: boolean;
  setMenuOpen: (updater: (open: boolean) => boolean) => void;
  scrolled: boolean;
}) {
  const pathname = usePathname();

  // "Our Expertise" dropdown (SERVICES)
  const [expertiseDropdownOpen, setExpertiseDropdownOpen] = useState(false);
  const [mobileExpertiseOpen, setMobileExpertiseOpen] = useState(false);
  const expertiseDropdownRef = useRef<HTMLLIElement>(null);

  // "Our Presence" dropdown (INDUSTRIES)
  const [presenceDropdownOpen, setPresenceDropdownOpen] = useState(false);
  const [mobilePresenceOpen, setMobilePresenceOpen] = useState(false);
  const presenceDropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        expertiseDropdownRef.current &&
        !expertiseDropdownRef.current.contains(e.target as Node)
      ) {
        setExpertiseDropdownOpen(false);
      }
      if (
        presenceDropdownRef.current &&
        !presenceDropdownRef.current.contains(e.target as Node)
      ) {
        setPresenceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setExpertiseDropdownOpen(false);
    setMobileExpertiseOpen(false);
    setPresenceDropdownOpen(false);
    setMobilePresenceOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top info bar — always visible, regardless of scroll */}
      <div className="bg-[#0e2a4a] text-white text-[13px]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-6 py-2">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-200">
              <Phone size={14} className="shrink-0" />
              <span> +91 95866 10281</span>
            </div>
            <div className="hidden items-center gap-1.5 whitespace-nowrap text-slate-200 md:flex">
              <Mail size={14} className="shrink-0" />
              <span> info@conbellengineering.com</span>
            </div>
            {/* <div className="hidden items-center gap-1.5 whitespace-nowrap text-slate-200 lg:flex">
              <Clock size={14} className="shrink-0" />
              <span>Mon - Sat: 8:30 AM - 7:00 PM</span>
            </div> */}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="hidden items-center gap-1.5 whitespace-nowrap text-slate-200 md:flex">
              <MapPin size={14} className="shrink-0" />
              <span>Industrial Area, India</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap text-slate-200">
              <MessageCircle size={14} className="shrink-0" />
              <span>WhatsApp Desk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar — transparent over the hero until scrolled, then
          solid white with a shadow; padding and logo shrink slightly
          on scroll for a tighter, more compact bar. */}
      <nav
        className={`border-b backdrop-blur-sm transition-all duration-300 ease-out ${
          scrolled
            ? "border-gray-200 bg-white shadow-md"
            : "border-transparent bg-black"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-2 pr-2 transition-all duration-300 ease-out  ${
            scrolled ? "py-2" : "py-3"
          }`}
        >
          {/* Brand — logo image */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="Conbell Engineering"
              width={190}
              height={48}
              priority
              className={`w-auto object-contain transition-all duration-300 ease-out ${
                scrolled ? "h-10 md:h-14" : "h-12 md:h-20"
              }`}
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 xl:flex">
            {NAV_LINKS.map((link) => {
              const isExpertise = link.label === "Our Expertise";
              const isPresence = link.label === "Our Presence";
              const active = isActivePath(pathname, link.href);

              if (isExpertise) {
                return (
                  <li
                    key={link.href}
                    ref={expertiseDropdownRef}
                    className="relative"
                    onMouseEnter={() => setExpertiseDropdownOpen(true)}
                    onMouseLeave={() => setExpertiseDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setExpertiseDropdownOpen((prev) => !prev)}
                      aria-expanded={expertiseDropdownOpen}
                      className={`relative flex items-center gap-1 pb-0 hover:pb-1 text-[15px] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                        scrolled
                          ? active
                            ? "text-[#00355F] after:w-full after:bg-[#00355F]"
                            : "text-gray-600 after:w-0 hover:text-[#00355F] hover:after:w-full hover:after:bg-[#00355F]"
                          : active
                            ? "text-white pb-1 after:w-full after:bg-white"
                            : "text-[#c6cbd2] after:w-0 hover:text-white hover:after:w-full hover:after:bg-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          expertiseDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200 ease-out ${
                        expertiseDropdownOpen
                          ? "pointer-events-auto visible translate-y-0 opacity-100"
                          : "pointer-events-none invisible -translate-y-2 opacity-0"
                      }`}
                      style={{ width: "380px" }}
                    >
                      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-2.5 shadow-[0_12px_40px_rgba(0,35,95,0.15)] ring-1 ring-black/5">
                        <div className="mt-1.5 space-y-1">
                          {SERVICES.map((service) => (
                            <Link
                              key={service.id}
                              href={`/our-expertise/${service.id}`}
                              onClick={() => setExpertiseDropdownOpen(false)}
                              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#EFF4FF]"
                            >
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                <Image
                                  src={service.image}
                                  alt={service.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="truncate text-[13px] font-semibold text-slate-800 transition-colors group-hover:text-[#00355F]">
                                    {service.title}
                                  </p>
                                  <ChevronRight
                                    size={14}
                                    className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00355F]"
                                  />
                                </div>
                                <p className="truncate text-[11px] text-slate-500">
                                  {service.badge} • {service.specs[0]?.value}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-1.5 border-t border-gray-100 px-2 pt-1.5">
                          <Link
                            href="/our-expertise"
                            onClick={() => setExpertiseDropdownOpen(false)}
                            className="block py-1 text-center text-[12px] font-semibold text-[#00355F] transition-colors hover:underline"
                          >
                            Explore All Services Overview &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              if (isPresence) {
                return (
                  <li
                    key={link.href}
                    ref={presenceDropdownRef}
                    className="relative"
                    onMouseEnter={() => setPresenceDropdownOpen(true)}
                    onMouseLeave={() => setPresenceDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setPresenceDropdownOpen((prev) => !prev)}
                      aria-expanded={presenceDropdownOpen}
                      className={`relative flex items-center gap-1 pb-0 hover:pb-1 text-[15px] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                        scrolled
                          ? active
                            ? "text-[#00355F] after:w-full after:bg-[#00355F]"
                            : "text-gray-600 after:w-0 hover:text-[#00355F] hover:after:w-full hover:after:bg-[#00355F]"
                          : active
                            ? "text-white pb-1 after:w-full after:bg-white"
                            : "text-[#c6cbd2] after:w-0 hover:text-white hover:after:w-full hover:after:bg-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          presenceDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200 ease-out ${
                        presenceDropdownOpen
                          ? "pointer-events-auto visible translate-y-0 opacity-100"
                          : "pointer-events-none invisible -translate-y-2 opacity-0"
                      }`}
                      style={{ width: "360px" }}
                    >
                      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-2.5 shadow-[0_12px_40px_rgba(0,35,95,0.15)] ring-1 ring-black/5">
                        <div className="mt-1.5 space-y-1">
                          {INDUSTRIES.map((industry) => (
                            <Link
                              key={industry.slug}
                              href={`/our-presence/${industry.slug}`}
                              onClick={() => setPresenceDropdownOpen(false)}
                              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#EFF4FF]"
                            >
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                <Image
                                  src={industry.image}
                                  alt={industry.name}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="truncate text-[13px] font-semibold text-slate-800 transition-colors group-hover:text-[#00355F]">
                                    {industry.name}
                                  </p>
                                  <ChevronRight
                                    size={14}
                                    className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00355F]"
                                  />
                                </div>
                                <p className="truncate text-[11px] text-slate-500">
                                  {industry.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-1.5 border-t border-gray-100 px-2 pt-1.5">
                          <Link
                            href="/our-presence"
                            onClick={() => setPresenceDropdownOpen(false)}
                            className="block py-1 text-center text-[12px] font-semibold text-[#00355F] transition-colors hover:underline"
                          >
                            Explore All Industries Overview &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative pb-1.5 text-[15px] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                      scrolled
                        ? active
                          ? "text-[#00355F] after:w-full after:bg-[#00355F]"
                          : "text-gray-600 after:w-0 hover:text-[#00355F] hover:after:w-full hover:after:bg-[#00355F]"
                        : active
                          ? "text-white after:w-full after:bg-white"
                          : "text-[#c6cbd2] after:w-0 hover:text-white hover:after:w-full hover:after:bg-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 xl:flex">
            <Link
              href="/catalogue"
              className={`whitespace-nowrap rounded-md border px-4.5 py-2 text-md font-semibold transition-colors duration-300 ${
                scrolled
                  ? "border-gray-200 text-[#00355F] hover:bg-gray-50"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              Catalogue
            </Link>
          </div>

          {/* Hamburger (mobile/tablet) */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center justify-center p-2 xl:hidden"
          >
            {menuOpen ? (
              <X
                size={24}
                className={
                  scrolled || menuOpen ? "text-[#0e2a4a]" : "text-white"
                }
              />
            ) : (
              <Menu
                size={24}
                className={scrolled ? "text-[#0e2a4a]" : "text-white"}
              />
            )}
          </button>
        </div>

        {/* Mobile menu — slides in/out from the top */}
        <div
          className={`absolute left-0 right-0 top-full overflow-hidden border-b border-gray-200 bg-white shadow-lg transition-all duration-300 ease-out xl:hidden ${
            menuOpen
              ? "max-h-[85vh] translate-y-0 opacity-100 overflow-y-auto"
              : "max-h-0 -translate-y-4 opacity-0"
          }`}
        >
          <ul className="px-6 pb-2 pt-2">
            {NAV_LINKS.map((link) => {
              const isExpertise = link.label === "Our Expertise";
              const isPresence = link.label === "Our Presence";
              const active = isActivePath(pathname, link.href);

              if (isExpertise) {
                return (
                  <li key={link.href} className="border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setMobileExpertiseOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between py-3.5 text-[16px] transition-colors duration-200 ${
                        active
                          ? "font-bold text-[#0e2a4a]"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          mobileExpertiseOpen
                            ? "rotate-180 text-[#00355F]"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Collapsible Mobile Services List */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileExpertiseOpen
                          ? "max-h-[500px] pb-3 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-1.5 pl-2 pr-1">
                        {SERVICES.map((service) => (
                          <Link
                            key={service.id}
                            href={`/our-expertise/${service.id}`}
                            onClick={() => setMenuOpen(() => false)}
                            className="flex items-center gap-3 rounded-lg p-2 text-[14px] text-gray-700 transition-colors hover:bg-[#EFF4FF] hover:text-[#00355F]"
                          >
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                              <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-slate-800">
                                {service.title}
                              </span>
                              <span className="block truncate text-[11px] text-slate-500">
                                {service.badge}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              if (isPresence) {
                return (
                  <li key={link.href} className="border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setMobilePresenceOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between py-3.5 text-[16px] transition-colors duration-200 ${
                        active
                          ? "font-bold text-[#0e2a4a]"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          mobilePresenceOpen
                            ? "rotate-180 text-[#00355F]"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Collapsible Mobile Industries List */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        mobilePresenceOpen
                          ? "max-h-[500px] pb-3 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-1.5 pl-2 pr-1">
                        {INDUSTRIES.map((industry) => (
                          <Link
                            key={industry.slug}
                            href={`/our-presence/${industry.slug}`}
                            onClick={() => setMenuOpen(() => false)}
                            className="flex items-center gap-3 rounded-lg p-2 text-[14px] text-gray-700 transition-colors hover:bg-[#EFF4FF] hover:text-[#00355F]"
                          >
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                              <Image
                                src={industry.image}
                                alt={industry.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-slate-800">
                                {industry.name}
                              </span>
                              <span className="block truncate text-[11px] text-slate-500">
                                {industry.description}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.href} className="border-b border-gray-100">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(() => false)}
                    className={`block py-3.5 text-[16px] transition-colors duration-200 ${
                      active
                        ? "font-bold text-[#0e2a4a]"
                        : "font-medium text-gray-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col gap-2.5 px-6 pb-6 pt-4">
            <Link
              href="/catalogue"
              onClick={() => setMenuOpen(() => false)}
              className="w-full rounded-md border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-800"
            >
              Catalogue
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  return (
    <>
      {/* Invisible spacer — reserves the navbar's exact height in normal document flow
          so the fixed header below doesn't make page content jump underneath it.
          Adapts automatically to any breakpoint without hardcoding pixel offsets. */}
      <div aria-hidden="true" className="invisible">
        <NavbarContent
          menuOpen={false}
          setMenuOpen={() => {}}
          scrolled={false}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 w-full">
        <NavbarContent
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          scrolled={scrolled}
        />
      </header>
    </>
  );
}
