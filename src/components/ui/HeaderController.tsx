"use client";

import { useState } from "react";
import StartupLoader from "./StartupLoader";
import Navbar from "../Navbar";

interface HeaderControllerProps {
  children?: React.ReactNode;
}

export default function HeaderController({ children }: HeaderControllerProps) {
  const [animationDone, setAnimationDone] = useState(false);

  return (
    <>
      <StartupLoader onAnimationDone={() => setAnimationDone(true)} />
      <Navbar />
      {/* Page content fades in after animation completes */}
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
