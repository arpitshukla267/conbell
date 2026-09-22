import Image from "next/image";
import { Manrope, Inter } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400"] });

export interface Client {
  name: string;
  /** Optional logo image path/URL. Falls back to a text badge with `name` when omitted. */
  logo?: string;
}

export interface ClientsCarouselProps {
  eyebrow?: string;
  heading?: string;
  clients?: Client[];
  /** Full loop duration in seconds — lower is faster. */
  speedSeconds?: number;
  /** Reverses scroll direction (right to left by default). */
  reverse?: boolean;
}

const DEFAULT_CLIENTS: Client[] = [
  { name: "Tata Steel" },
  { name: "Larsen & Toubro" },
  { name: "Mahindra" },
  { name: "Bajaj Auto" },
  { name: "Siemens" },
  { name: "ABB" },
  { name: "JSW Group" },
  { name: "Bharat Forge" },
];

export default function ClientsCarousel({
  eyebrow = "OUR CLIENTS",
  heading = "Trusted by Industry Leaders",
  clients = DEFAULT_CLIENTS,
  speedSeconds = 30,
  reverse = false,
}: ClientsCarouselProps) {
  // Duplicate the list so the track can loop seamlessly at -50% translation.
  const track = [...clients, ...clients];

  return (
    <section
      aria-label={heading}
      className={`${inter.className} bg-[#F8F9FF] py-16`}
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
        <p className="text-[13px] font-semibold tracking-wider text-[#00355F]">
          {eyebrow}
        </p>
        <h2
          className={`${manrope.className} mt-2 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
        >
          {heading}
        </h2>
      </div>

      <div className="relative mt-10 overflow-hidden">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F8F9FF] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F8F9FF] to-transparent sm:w-28" />

        <div className="clients-track flex w-max items-center gap-6">
          {track.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl bg-white px-6 shadow-sm"
            >
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
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