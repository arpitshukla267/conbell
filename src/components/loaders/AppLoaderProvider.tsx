"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import StartupLoader from "./StartupLoader";
import RouteLoader from "./RouteLoader";

export default function AppLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Component fresh mount hota hai har hard refresh pe,
  // isliye current pathname se decide karo StartupLoader chahiye ya nahi
  const [showStartupLoader, setShowStartupLoader] = useState(pathname === "/");

  return (
    <>
      {showStartupLoader && (
        <StartupLoader onAnimationDone={() => setShowStartupLoader(false)} />
      )}
      <RouteLoader />
      {children}
    </>
  );
}
