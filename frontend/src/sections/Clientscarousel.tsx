import Image from "next/image";
import { Manrope, Inter } from "next/font/google";
import { CLIENTS, type Client } from "../data/clients";

const manrope = Manrope({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export interface ClientsCarouselProps {
  heading?: string;
  clients?: Client[];
  /** Full loop duration in seconds — lower is faster. */
  speedSeconds?: number;
  /** Reverses scroll direction (right to left by default). */
  reverse?: boolean;
}

export default function ClientsCarousel({
  heading = "Trusted by Industry Leaders",
  clients = CLIENTS,
  speedSeconds = 32,
  reverse = false,
}: ClientsCarouselProps) {
  // Duplicate the list so the track can loop seamlessly at -50% translation.
  const track = [...clients, ...clients];

  return (
    <section
      aria-label={heading}
      className={`${inter.className} bg-[#F8F9FF] py-16 sm:py-20`}
    >
      <style>{`
        @keyframes clients-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .clients-track {
          animation: clients-marquee ${speedSeconds}s linear infinite;
          animation-direction: ${reverse ? "reverse" : "normal"};
        }
        .clients-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .clients-track {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1100px] px-6 text-center">
        <h2
          className={`${manrope.className} mt-2 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
        >
          {heading}
        </h2>
      </div>

      <div className="relative mt-12 overflow-hidden">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F8F9FF] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F8F9FF] to-transparent sm:w-28" />

        <div className="clients-track flex w-max items-stretch">
          {track.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex h-24 w-48 shrink-0 items-center justify-center sm:h-28 sm:w-56"
            >
              {client.logo ? (
                <div className="relative h-full w-full">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="320px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-center text-sm font-semibold text-[#5B5E67]">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
