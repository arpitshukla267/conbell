"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

function RouteLoaderListener({
  setIsNavigating,
}: {
  setIsNavigating: (loading: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialMount = useRef(true);

  // When pathname or searchParams change, navigation has completed.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    // Briefly delay hiding to ensure page elements are painted
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsNavigating]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      // Ignore modified clicks (e.g. Cmd/Ctrl+Click to open in new tab)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      // Check if click was on or inside an anchor element
      const anchor = (event.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;

      // Ignore download, mailto, tel, javascript links, and hash-only links
      if (anchor.hasAttribute("download")) return;
      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Only handle internal navigation within the same origin
        if (targetUrl.origin !== currentUrl.origin) return;

        // Skip if target URL is the exact same page and query (e.g. in-page anchor)
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        // Show the route loader
        setIsNavigating(true);
      } catch {
        // Invalid URL, ignore
      }
    };

    const handlePopState = () => {
      setIsNavigating(true);
    };

    // Capture click events before standard handlers
    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setIsNavigating]);

  return null;
}

export default function RouteLoader() {
  const [isNavigating, setIsNavigating] = useState(false);

  // Safety fallback: auto-hide after 8 seconds if navigation aborts
  useEffect(() => {
    if (!isNavigating) return;
    const timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [isNavigating]);

  if (!isNavigating) {
    return (
      <Suspense fallback={null}>
        <RouteLoaderListener setIsNavigating={setIsNavigating} />
      </Suspense>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <RouteLoaderListener setIsNavigating={setIsNavigating} />
      </Suspense>

      <div
        role="status"
        aria-live="polite"
        aria-label="Loading page content"
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black"
      >
        <div
          className="relative animate-pulse duration-1000"
          style={{ height: "20vh", width: "20vw" }}
        >
          <Image
            src="/logo.jpeg"
            alt="Loading"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </>
  );
}
