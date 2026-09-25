"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SPLASH_DURATION_DESKTOP_MS = 6000;
const SPLASH_DURATION_MOBILE_MS = 5000;
const FALLBACK_BUFFER_MS = 300; // safety margin in case animationend never fires

interface StartupLoaderProps {
  onAnimationDone?: () => void;
}

export default function StartupLoader({ onAnimationDone }: StartupLoaderProps) {
  const pathname = usePathname();

  // Lazy init: sirf ek baar mount ke time decide hota hai.
  // Agar pathname "/" nahi hai, toh showSplash kabhi true hi nahi hoga —
  // na server render mein, na client mein. Isse flash/flicker bhi nahi hoga.
  const [showSplash, setShowSplash] = useState(() => pathname === "/");

  useEffect(() => {
    if (!showSplash) {
      onAnimationDone?.();
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const splashEl = document.querySelector(".masked");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setShowSplash(false);
      onAnimationDone?.();
    };

    // animationend fires on the element carrying the `animation` property.
    // Here that's .masked::before, but pseudo-element events bubble up
    // and are observable on the real .masked node.
    const handleAnimationEnd = (e: AnimationEvent) => {
      if (
        e.animationName === "revealDesktop" ||
        e.animationName === "revealMobile"
      ) {
        finish();
      }
    };

    splashEl?.addEventListener(
      "animationend",
      handleAnimationEnd as EventListener,
    );

    // Fallback safety net only — fires if animationend never happens
    // (e.g. prefers-reduced-motion disabling the animation, or some
    // browser/CSS edge case). Under normal conditions this should
    // basically never win the race.
    const isMobile = window.innerWidth < 768;
    const fallbackDuration = isMobile
      ? SPLASH_DURATION_MOBILE_MS
      : SPLASH_DURATION_DESKTOP_MS;
    const fallbackTimer = setTimeout(
      finish,
      fallbackDuration + FALLBACK_BUFFER_MS,
    );

    return () => {
      splashEl?.removeEventListener(
        "animationend",
        handleAnimationEnd as EventListener,
      );
      clearTimeout(fallbackTimer);
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
           Timeline (6s total): 2.5s open → 1s hold (all open) → 2.5s close
           ═══════════════════════════════════════════ */
        @media (min-width: 768px) {
          .masked {
            background-size: 100% 100%;
            /* +1px prevents subpixel rounding gaps between strips */
            --strip-w: calc(100% / 8 + 1px);
            --strip-h: 60%;
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
              0% 25%,
              calc(100% / 7 * 1) 50%,
              calc(100% / 7 * 2) 22%,
              calc(100% / 7 * 3) 48%,
              calc(100% / 7 * 4) 30%,
              calc(100% / 7 * 5) 52%,
              calc(100% / 7 * 6) 24%,
              100% 45%,
              0 0;
            mask-position:
              0% 25%,
              calc(100% / 7 * 1) 50%,
              calc(100% / 7 * 2) 22%,
              calc(100% / 7 * 3) 48%,
              calc(100% / 7 * 4) 30%,
              calc(100% / 7 * 5) 52%,
              calc(100% / 7 * 6) 24%,
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

            animation: revealDesktop 6s ease-out forwards;
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
          10.4167% {
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
          20.8333% {
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
          31.25% {
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
          /* ── all 8 strips fully open ── */
          41.6667% {
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
          /* ── hold: same as above, 1s pause (41.6667% → 58.3333% of 6s) ── */
          54.3333% {
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
          /* ── shrink begins ── */
          68.75% {
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
          79.1667% {
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
          89.5833% {
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
           Timeline (5s total): compressed from 6s — dead white hold removed.
           1.6s open → hold → close, ends right when animation ends.
           ═══════════════════════════════════════════ */
        @media (max-width: 767px) {
          .masked {
            /* 1. TO CHANGE MOBILE LOGO SIZE: adjust width/height here (e.g. 70% auto, 280px auto) */
            background-size: 110% auto;
            /* 2. Exactly 0.5px border/overlap between strips in mobile (was 1.5px) */
            --strip-w: calc(100% / 4 + 0.5px);
            /* 3. TO CHANGE MOBILE STRIP HEIGHT: adjust this percentage (e.g. 40%, 45%, 50%) */
            --strip-h: 45%;
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
          16% {
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
          32% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              var(--strip-w) var(--strip-h), var(--strip-w) var(--strip-h),
              100% 100%;
          }
          /* hold: pause with all strips open */
          52% {
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
          80% {
            -webkit-mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
            mask-size:
              var(--strip-w) var(--strip-h), var(--strip-w) 0%,
              var(--strip-w) 0%, var(--strip-w) var(--strip-h),
              100% 100%;
          }
          /* strips 1 & 4 close — fully revealed, right at animation end */
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
