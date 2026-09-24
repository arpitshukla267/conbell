import Image from "next/image";
import Link from "next/link";
import { Manrope, Inter } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { CLIENTS } from "../../data/clients";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export default function ClientsPage() {
  return (
    <main className={`${manrope.variable} ${inter.variable} bg-white`}>
      {/* ---------------------------- Hero / Header ---------------------------- */}
      <section className="border-b border-[#E4E9F2] px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-sm"
          >
            <Link
              href="/"
              className="text-[#5B5E67] transition-colors hover:text-[#0B1C30]"
            >
              Home
            </Link>
            <ChevronRight
              className="h-3.5 w-3.5 text-[#5B5E67]"
              aria-hidden="true"
            />
            <span className="font-medium text-[#0F4C81]">Our Clients</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold leading-tight text-[#0B1C30] md:text-4xl">
              Trusted by Industry Leaders
            </h1>
            <p className="mt-4 font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#5B5E67]">
              From heavy engineering to automotive and power, we&apos;ve
              partnered with organizations across sectors — delivering
              structures and fabrication they rely on year after year.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------ Clients grid ----------------------------- */}
      <section
        className="px-6 py-16 md:px-10 lg:px-16"
        aria-label="All clients"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {CLIENTS.map((client) => (
              <div
                key={client.name}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#E4E9F2] px-6 py-10 text-center transition-colors hover:border-[#DCE9FF]"
              >
                <div className="relative h-14 w-full sm:h-24">
                  {client.logo ? (
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      sizes="220px"
                      className="object-contain"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center font-[family-name:var(--font-manrope)] text-base font-bold text-[#0B1C30]">
                      {client.name}
                    </span>
                  )}
                </div>

                <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-[#0B1C30]">
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- CTA banner ------------------------------ */}
      <section className="border-t border-[#E4E9F2] bg-[#F8F9FF] px-6 py-14 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 text-center">
          <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30] md:text-3xl">
            Looking to partner with us?
          </h2>
          <p className="max-w-xl font-[family-name:var(--font-inter)] text-base text-[#5B5E67]">
            Tell us about your project and we&apos;ll get back with a solution
            tailored to your requirements.
          </p>
          <Link
            href="/contact"
            className="rounded-md bg-[#0B1C30] px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-[#0F4C81]"
          >
            Enquire Now
          </Link>
        </div>
      </section>
    </main>
  );
}
