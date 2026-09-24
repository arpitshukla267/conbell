import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { INDUSTRIES, getIndustryBySlug } from "../../../data/industries";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
});

// NOTE: this folder is named [slugs] (plural) in this project, so the
// route param key must be `slugs`, not `slug`.
export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slugs: industry.slug }));
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs } = await params;
  const industry = getIndustryBySlug(slugs);

  if (!industry) {
    notFound();
  }

  const otherIndustries = INDUSTRIES.filter((i) => i.slug !== industry.slug);

  return (
    // Full-width wrapper carries the background all the way to the
    // viewport edge — this is what removes the black side margins.
    // Inner sections stay centered via mx-auto max-w-[1400px].
    <main className="bg-[#EFF4FF]">
      {/* ============ BREADCRUMB ============ */}
      <section className="border-b border-blue-100/60 px-6 pb-6 pt-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[#5B5E67]">
            <Link href="/" className="hover:text-[#00355F]">
              HOME
            </Link>
            <ChevronRight size={13} />
            <Link href="/our-presence" className="hover:text-[#00355F]">
              OUR PRESENCE
            </Link>
            <ChevronRight size={13} />
            <span className="font-semibold text-[#00355F]">
              {industry.name.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* Copy — heading + description together, left-aligned, so
              this column's height naturally sits closer to the image's */}
          <div className="order-1 text-left">
            <p className="text-[12px] font-semibold tracking-wider text-[#0F4C81]">
              WHO WE WORK WITH
            </p>
            <h1
              className={`${manrope.className} mt-1 text-3xl font-bold text-[#0B1C30] sm:text-4xl`}
            >
              {industry.name}
            </h1>

            {/* Image card */}
            <div className="md:hidden my-6 relative order-2 h-72 w-full overflow-hidden rounded-2xl shadow-lg md:h-[420px]">
              <Image
                src={industry.image}
                alt={industry.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
                <span className="text-[13px] font-semibold tracking-wide text-white">
                  {industry.name.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="mt-4 md:mt-8 text-[16px] leading-relaxed text-[#5B5E67] sm:text-[17px]">
              {industry.longDescription}
            </p>
          </div>

          {/* Image card */}
          <div className="hidden md:block relative order-2 h-72 w-full overflow-hidden rounded-2xl shadow-lg md:h-[420px]">
            <Image
              src={industry.image}
              alt={industry.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10">
              <span className="text-[13px] font-semibold tracking-wide text-white">
                {industry.name.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ OTHER INDUSTRIES ============ */}
      {otherIndustries.length > 0 && (
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="text-center">
              <p className="text-[12px] font-semibold tracking-wider text-[#5B5E67]">
                EXPLORE MORE
              </p>
              <h2
                className={`${manrope.className} mt-1 text-2xl font-bold text-[#0B1C30] sm:text-3xl`}
              >
                Other Industries We Serve
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherIndustries.map((i) => (
                <Link
                  key={i.slug}
                  href={`/our-presence/${i.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-[#F8F9FF] shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={i.image}
                      alt={i.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-[15px] font-bold text-[#00355F]">
                      {i.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#5B5E67]">
                      {i.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
