"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const SPLASH_DURATION_MS = 5000;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface StartupLoaderProps {
  onAnimationDone?: () => void;
}

export default function StartupLoader({
  onAnimationDone,
}: StartupLoaderProps) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);
  const decided = useRef(false);

  // Only show on home page hard-refresh / first load.
  // No sessionStorage — every hard refresh re-triggers the animation.
  useIsomorphicLayoutEffect(() => {
    if (decided.current) return;
    decided.current = true;

    if (pathname !== "/") {
      setShowSplash(false);
      onAnimationDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timers: lock scroll, auto-dismiss after duration.
  useEffect(() => {
    if (!showSplash) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      onAnimationDone?.();
    }, SPLASH_DURATION_MS);

    return () => {
      clearTimeout(splashTimer);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSplash]);

  if (!showSplash) return null;

  return (
    <>
      <div
        className="masked h-screen w-full fixed top-0 left-0 z-[9999]"
        aria-hidden="true"
      />

      <style>{`
        /* ═══════════════════════════════════════════
           BASE STYLES
           ═══════════════════════════════════════════ */
        .masked {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background-image: url("/logo.jpeg");
          background-position: center;
          background-repeat: no-repeat;
        }

        .masked::before {
          content: "";
          position: absolute;
          inset: 0;
          background-color: #EFF4FF;
          z-index: 1;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
        }

        /* ═══════════════════════════════════════════
           DESKTOP — 8 strips  (≥ 768px)
           ═══════════════════════════════════════════ */
        @media (min-width: 768px) {
          .masked {
            background-size: 100% 100%;
            /* +1px prevents subpixel rounding gaps between strips */
            --strip-w: calc(100% / 8 + 1px);
            --strip-h: 50%;
          }

          .masked::before {
            -webkit-mask-image:
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(white, white);
            mask-image:
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(white, white);

            -webkit-mask-position:
              0% 15%,
              calc(100% / 7 * 1) 25%,
              calc(100% / 7 * 2) 30%,
              calc(100% / 7 * 3) 50%,
              calc(100% / 7 * 4) 45%,
              calc(100% / 7 * 5) 35%,
              calc(100% / 7 * 6) 25%,
              100% 20%,
              0 0;
            mask-position:
              0% 55%,
              calc(100% / 7 * 1) 30%,
              calc(100% / 7 * 2) 50%,
              calc(100% / 7 * 3) 40%,
              calc(100% / 7 * 4) 45%,
              calc(100% / 7 * 5) 35%,
              calc(100% / 7 * 6) 25%,
              100% 45%,
              0 0;

            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;

            animation: revealDesktop 5s ease-out forwards;
          }
        }

        @keyframes revealDesktop {
          0% {
            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
          }
          12.5% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
          }
          25% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          37.5% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          50% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          62.5% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          75% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          87.5% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
          }
          100% {
            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
          }
        }

        /* ═══════════════════════════════════════════
           MOBILE — 4 strips  (< 768px)
           ═══════════════════════════════════════════ */
        @media (max-width: 767px) {
          .masked {
            /* 1. TO CHANGE MOBILE LOGO SIZE: adjust width/height here (e.g. 70% auto, 280px auto) */
            background-size: 110% auto;
            /* 2. Exactly 0.5px border/overlap between strips in mobile (was 1.5px) */
            --strip-w: calc(100% / 4 + 0.5px);
            /* 3. TO CHANGE MOBILE STRIP HEIGHT: adjust this percentage (e.g. 40%, 45%, 50%) */
            --strip-h: 50%;
          }

          .masked::before {
            -webkit-mask-image:
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(white, white);
            mask-image:
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(black, black),
              linear-gradient(white, white);

            /* 4. TO CHANGE MOBILE STRIP Y-AXIS POSITION:
               Adjust the second percentage on each line below (currently 20%, 30%, 15%, 25%) */
            -webkit-mask-position:
              0% 40%,                  /* Strip 1 Y position */
              calc(100% / 3 * 1) 50%,  /* Strip 2 Y position */
              calc(100% / 3 * 2) 45%,  /* Strip 3 Y position */
              100% 35%,                /* Strip 4 Y position */
              0 0;
            mask-position:
              0% 50%,                  /* Strip 1 Y position */
              calc(100% / 3 * 1) 40%,  /* Strip 2 Y position */
              calc(100% / 3 * 2) 55%,  /* Strip 3 Y position */
              100% 40%,                /* Strip 4 Y position */
              0 0;

            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;

            animation: revealMobile 5s ease-out forwards;
          }
        }

        @keyframes revealMobile {
          /* all closed */
          0% {
            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
          }
          /* strips 1 & 4 open */
          16.66% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
          }
          /* all 4 open */
          33.33% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          /* hold open */
          50% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          /* strips 2 & 3 close */
          66.66% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
          }
          /* strips 1 & 4 close */
          83.33% {
            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
          }
          /* fully revealed */
          100% {
            -webkit-mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
            mask-size:
              var(--strip-w) 0%, var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) 0%,
              100% 100%;
          }
        }
      `}</style>
    </>
  );
}
