import { Manrope } from "next/font/google";
import { INDUSTRIES } from "../../data/industries";
import { IndustryCard } from "../../sections/Industriesweserve";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
});

export default function OurPresencePage() {
  return (
    <main className="px-6 py-16 md:px-10 lg:px-16 bg-[#EFF4FF]">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 max-w-2xl">
          <p className="text-[13px] font-semibold tracking-wider text-[#0F4C81]">
            WHO WE WORK WITH
          </p>
          <h1
            className={`${manrope.className} mt-2 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
          >
            Our Presence
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </div>
    </main>
  );
}
