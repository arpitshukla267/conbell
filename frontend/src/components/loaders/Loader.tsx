"use client";

import Image from "next/image";

export default function Loader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <Image
        src="/logo.jpeg"
        alt="Loading..."
        width={44}
        height={44}
        priority
        className="loader-blink"
      />

      <style jsx>{`
        .loader-blink {
          animation: blink 1.2s ease-in-out infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}
