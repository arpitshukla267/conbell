"use client";

import { useState, useRef, type DragEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Manrope, Inter } from "next/font/google";
import {
  ChevronRight,
  Factory,
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  ClipboardCheck,
  UploadCloud,
  Send,
  ShieldCheck,
} from "lucide-react";

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

const CHANNELS = [
  {
    icon: Mail,
    label: "General Inquiries",
    value: "info@conbellengineering.com",
  },
];

export default function ContactPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <main className={`${manrope.variable} ${inter.variable} bg-white`}>
      {/* ---------------------------- Hero / Header ---------------------------- */}
      <section className="bg-[#EFF4FF] px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
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
            <span className="font-medium text-[#0F4C81]">
              Contact &amp; RFQ
            </span>
          </nav>

          <p className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold tracking-wide text-[#5B5E67]">
            ENGINEERING TECHNICAL SALES &amp; PROCUREMENT DESK
          </p>

          <h1 className="max-w-2xl font-[family-name:var(--font-manrope)] text-3xl font-bold leading-tight text-[#0B1C30] md:text-4xl">
            Connect with Our Engineering &amp; Procurement Team
          </h1>
          <p className="mt-4 max-w-2xl font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#5B5E67]">
            Direct technical sales support, plant audit appointments, and
            precision RFQ engineering evaluations.
          </p>
        </div>
      </section>

      {/* ------------------------------- Body grid ------------------------------- */}
      <section className="px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* ------------------------------ Left column ------------------------------ */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-lg border border-[#E4E9F2]">
              {/* Plant header */}
              <div className="flex items-start justify-between gap-3 p-5 pb-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[#0B1C30]">
                    <Factory
                      className="h-4.5 w-4.5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-manrope)] text-sm font-bold text-[#0B1C30]">
                      Integrated Plant &amp; HQ
                    </p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                      Kalol (N.G.), Gujarat
                    </p>
                  </div>
                </div>
                <span className="flex-shrink-0 rounded bg-[#E5EEFF] px-2 py-1 font-[family-name:var(--font-inter)] text-[10px] font-semibold text-[#0F4C81]">
                  ISO 9001:2015
                </span>
              </div>

              {/* Plant photo */}
              <div className="relative h-40 w-full">
                <Image
                  src="/images/contact/plant-floor.jpg"
                  alt="Integrated machining and fabrication floor"
                  fill
                  className="object-cover"
                  sizes="380px"
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-[family-name:var(--font-inter)] text-[11px] font-medium text-white">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  120,000 sq.ft Machining &amp; Fabrication Floor
                </span>
              </div>

              {/* Registered office */}
              <div className="border-t border-[#E4E9F2] bg-[#F8F9FF] p-5">
                <div className="flex items-start gap-2.5">
                  <Building2
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0F4C81]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-[family-name:var(--font-manrope)] text-sm font-bold text-[#0B1C30]">
                      Factory Address
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#5B5E67]">
                      Survey No. 298/A, Vadavswami-Ambapura Road, Village:
                      Vadavswami, Ta.: Kalol(N.G)-382740, Gujarat.
                    </p>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="relative mt-4 h-32 w-full overflow-hidden rounded-md bg-[#DCE9FF]">
                  <Image
                    src="/images/contact/map-preview.jpg"
                    alt="Map showing factory location in Kalol, Gujarat"
                    fill
                    className="object-cover"
                    sizes="380px"
                  />
                  <button
                    type="button"
                    className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-md bg-white px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs font-semibold text-[#0B1C30] shadow-sm"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Get Driving Directions
                  </button>
                </div>
              </div>

              {/* Hotline / WhatsApp */}
              <div className="grid grid-cols-2 border-t border-[#E4E9F2]">
                <div className="border-r border-[#E4E9F2] p-4">
                  <div className="flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-[11px] font-semibold text-[#5B5E67]">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    SALES HOTLINE
                  </div>
                  <a
                    href="tel:+919586610281"
                    className="mt-1.5 block font-[family-name:var(--font-manrope)] text-base font-bold text-[#0B1C30] hover:text-[#0F4C81]"
                  >
                    +91-95866 10281
                  </a>
                  <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                    Mon – Sat: 8:30 AM – 7:00 PM
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-[11px] font-semibold text-[#5B5E67]">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    FAST PROCUREMENT
                  </div>
                  <p className="mt-1.5 font-[family-name:var(--font-manrope)] text-base font-bold text-[#0B1C30]">
                    WhatsApp Desk
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                    Instant BOM dispatch
                  </p>
                </div>
              </div>

              {/* Official channels */}
              <div className="border-t border-[#E4E9F2] p-5">
                <p className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-wide text-[#5B5E67]">
                  OFFICIAL INQUIRIES &amp; CHANNELS
                </p>
                <ul className="mt-3 space-y-3">
                  {CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <li
                        key={channel.label}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm text-[#0B1C30]">
                          <Icon
                            className="h-4 w-4 text-[#0F4C81]"
                            aria-hidden="true"
                          />
                          {channel.label}
                        </span>
                        <a
                          href={`mailto:${channel.value}`}
                          className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#0F4C81] hover:underline"
                        >
                          {channel.value}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Factory audit liaison */}
              <div className="flex items-center justify-between gap-3 border-t border-[#E4E9F2] bg-[#EFF4FF] p-5">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#0F4C81]">
                    <ClipboardCheck
                      className="h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-manrope)] text-sm font-bold text-[#0B1C30]">
                      Factory Audit Liaison
                    </p>
                    <p className="font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                      Schedule technical OEM plant inspections
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex-shrink-0 rounded-md bg-[#0B1C30] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-[#0F4C81]"
                >
                  Book Visit
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------ Right column ------------------------------ */}
          <div className="rounded-lg border border-[#E4E9F2] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#0F4C81] px-2 py-1 font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-wide text-white">
                TECHNICAL FORM
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs font-medium text-[#5B5E67]">
                High-Priority Direct Routing
              </span>
            </div>

            <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30]">
              Request for Quotation (RFQ)
            </h2>
            <p className="mt-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#5B5E67]">
              Submit detailed engineering specifications, 2D/3D component
              drawings, or project scopes for thorough DFM appraisal and
              commercial terms.
            </p>

            <form
              className="mt-6 flex flex-col gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma"
                    className="form-input"
                  />
                </Field>
                <Field label="Work Email" required>
                  <input
                    type="email"
                    placeholder="rsharma@enterprise.com"
                    className="form-input"
                  />
                </Field>

                <Field label="Contact Number" required>
                  <div className="flex items-stretch gap-2">
                    <span className="flex w-14 flex-shrink-0 items-center justify-center rounded-md border border-[#D8DEEA] bg-[#F8F9FF] font-[family-name:var(--font-inter)] text-sm text-[#5B5E67]">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 00000"
                      className="form-input"
                    />
                  </div>
                </Field>
                <Field label="Organization / Company Name" required>
                  <input
                    type="text"
                    placeholder="e.g. Bharat Heavy Transmissions Ltd"
                    className="form-input"
                  />
                </Field>

                <Field label="Industry Sector" required>
                  <select defaultValue="" className="form-input">
                    <option value="" disabled>
                      Select Industry Sector
                    </option>
                    <option>Automotive</option>
                    <option>Oil &amp; Gas</option>
                    <option>Power &amp; Energy</option>
                    <option>Defense</option>
                    <option>Construction &amp; Infrastructure</option>
                  </select>
                </Field>
                <Field label="Primary Requirement Type" required>
                  <select defaultValue="" className="form-input">
                    <option value="" disabled>
                      Select Core Process
                    </option>
                    <option>CNC Machining</option>
                    <option>Structural Fabrication</option>
                    <option>Sheet Metal Enclosures</option>
                    <option>Custom Tooling &amp; Fixtures</option>
                  </select>
                </Field>

                <Field label="Estimated Batch / Annual Quantity" required>
                  <input
                    type="text"
                    placeholder="e.g. 500 pcs/month or 1 Off Prototype"
                    className="form-input"
                  />
                </Field>
                <Field label="Expected First Delivery Timeline" required>
                  <input
                    type="text"
                    placeholder="Target Turnaround"
                    className="form-input"
                  />
                </Field>
              </div>

              {/* File upload */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#0B1C30]">
                    Attach Engineering Drawings / CAD Files
                  </label>
                  <span className="font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                    Up to 50MB (STEP, IGES, DWG, DXF, PDF)
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
                    isDragging
                      ? "border-[#0F4C81] bg-[#EFF4FF]"
                      : "border-[#C7D4EA] bg-[#F8F9FF] hover:bg-[#EFF4FF]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".step,.stp,.iges,.dwg,.dxf,.pdf,.zip"
                    className="hidden"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name ?? null)
                    }
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4C81]">
                    <UploadCloud
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="font-[family-name:var(--font-inter)] text-sm font-semibold text-[#0B1C30]">
                    {fileName ?? "Drag & drop 2D/3D drawings here, or browse"}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                    Accepted: .step, .stp, .iges, .dwg, .dxf, .pdf, .zip.
                    Strictly protected under bilateral NDA.
                  </p>
                </div>
              </div>

              {/* Project scope */}
              <Field label="Detailed Project Scope &amp; Material Specifications">
                <textarea
                  rows={4}
                  placeholder="Mention raw material grades (e.g. SS 316L, IS 2062 E250, EN24), surface treatments (galvanizing, powder coating, nitriding), critical tolerance limits, and NDT/CMM test report requirements..."
                  className="form-input resize-none"
                />
              </Field>

              {/* NDA checkbox */}
              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[#C7D4EA] text-[#0F4C81] focus:ring-[#0F4C81]"
                />
                <span className="font-[family-name:var(--font-inter)] text-sm text-[#0B1C30]">
                  We require mutual Non-Disclosure Agreement (NDA) execution
                  prior to sharing proprietary design/tooling data. Please
                  forward Conbell Engineering&apos;s standard bilateral NDA.
                </span>
              </label>

              {/* Submit */}
              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B1C30] px-6 py-3.5 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-[#0F4C81]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit RFQ to Engineering Team
                </button>
                <p className="inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                  <ShieldCheck
                    className="h-3.5 w-3.5 flex-shrink-0 text-[#0F4C81]"
                    aria-hidden="true"
                  />
                  Response with initial DFM feedback within{" "}
                  <span className="font-semibold text-[#0B1C30]">
                    24 business hours
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #d8deea;
          background-color: #ffffff;
          padding: 0.625rem 0.75rem;
          font-family: var(--font-inter);
          font-size: 0.875rem;
          color: #0b1c30;
        }
        .form-input::placeholder {
          color: #9aa1ad;
        }
        .form-input:focus {
          outline: none;
          border-color: #0f4c81;
          box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.12);
        }
      `}</style>
    </main>
  );
}

/* --------------------------------- Field --------------------------------- */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#0B1C30]">
        {label}
        {required ? <span className="text-[#B9542B]"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
