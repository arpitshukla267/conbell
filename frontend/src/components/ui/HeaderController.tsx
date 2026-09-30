"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import StartupLoader from "../loaders/StartupLoader";
import Navbar from "../Navbar";

interface HeaderControllerProps {
  children?: React.ReactNode;
}

export default function HeaderController({ children }: HeaderControllerProps) {
  const pathname = usePathname();
  // StartupLoader only runs on the home page ("/").
  // On all other routes, content must be immediately visible.
  const [animationDone, setAnimationDone] = useState(() => pathname !== "/");

  useEffect(() => {
    if (pathname !== "/") {
      setAnimationDone(true);
    }
  }, [pathname]);

  return (
    <>
      <StartupLoader onAnimationDone={() => setAnimationDone(true)} />
      <Navbar />
      {/* Page content fades in after animation completes on home page, or is visible immediately */}
      <main
        className="flex-1"
        style={{
          opacity: animationDone ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
        }}
      >
        {children}
      </main>
    </>
  );
}
