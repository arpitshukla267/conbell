"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Our Presence", href: "/our-presence" },
  { label: "Client", href: "/client" },
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
            : "border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-2 pr-2 transition-all duration-300 ease-out md:px-6 ${
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
              const active = isActivePath(pathname, link.href);
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
            <Link
              href="/quote"
              className={`whitespace-nowrap rounded-md px-4.5 py-2 text-md font-semibold transition-colors duration-300 ${
                scrolled
                  ? "bg-[#00355F] text-white hover:bg-[#0b2038]"
                  : "bg-[#EFF4FF] text-[#00355F] hover:bg-white"
              }`}
            >
              Get a Quote
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
              ? "max-h-[80vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-4 opacity-0"
          }`}
        >
          <ul className="px-6 pb-2 pt-2">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
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
            <Link
              href="/quote"
              onClick={() => setMenuOpen(() => false)}
              className="w-full rounded-md bg-[#0e2a4a] py-2.5 text-center text-sm font-semibold text-white"
            >
              Get a Quote
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
