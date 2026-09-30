"use client";

import { useState, useRef, useEffect, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Manrope, Inter } from "next/font/google";
import {
  ChevronRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Send,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { fetchFromBackend } from "../../lib/api";

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

interface ContactConfig {
  companyName?: string;
  brandName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  phoneDisplay?: string;
  addressLines?: string[];
  copyrightTagline?: string;
}

// Sirf API fail hone par fallback (Footer jaisa hi)
const DEFAULT_CONTACT: ContactConfig = {
  companyName: "Conbell Engineering Private Limited",
  brandName: "Conbell Engineering",
  email: "info@conbellengineering.com",
  phone: "+919586610281",
  phoneDisplay: "+91-95866 10281",
  addressLines: [
    "Survey No. 298/A, Vadavswami-Ambapura Road",
    "Village: Vadavswami, Ta.: Kalol (N.G) – 382740, Gujarat.",
  ],
};

// API response array ho ya { data: [] } / { items: [] }, teeno handle
function extractList(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

// Active items ke titles nikalo (order ke hisaab se)
function toTitles(data: any): string[] {
  return extractList(data)
    .filter((item) => item && item.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.title)
    .filter(Boolean);
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();

  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [productInterest, setProductInterest] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [scope, setScope] = useState("");
  const [ndaRequired, setNdaRequired] = useState(true);

  // API data states
  const [contact, setContact] = useState<ContactConfig>(DEFAULT_CONTACT);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Contact config (address, phone, email)
  useEffect(() => {
    fetchFromBackend<Record<string, any>>("/api/content/config", {}).then(
      (data) => {
        if (data && data.contact) {
          setContact((prev) => ({ ...prev, ...data.contact }));
        }
      },
    );
  }, []);

  // Services + Products (dropdown options)
  useEffect(() => {
    fetchFromBackend<any>("/api/services", []).then((data) => {
      setServiceOptions(toTitles(data));
    });
    fetchFromBackend<any>("/api/products", []).then((data) => {
      setProductOptions(toTitles(data));
    });
  }, []);

  // ?product= / ?service= query params se prefill
  useEffect(() => {
    const product = searchParams.get("product");
    const service = searchParams.get("service");
    if (product) setProductInterest(product);
    if (service) setServiceInterest(service);
  }, [searchParams]);

  // Derived values
  const address = (contact.addressLines ?? []).join(", ");
  const mapQuery = encodeURIComponent(address);
  const contactChannels = [
    {
      icon: Phone,
      label: "Contact No.",
      value: contact.phoneDisplay || contact.phone,
      href: `tel:${contact.phone || ""}`,
    },
    {
      icon: Mail,
      label: "Contact Email",
      value: contact.email,
      href: `mailto:${contact.email || ""}`,
    },
  ].filter((c) => c.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setSubmitStatus("error");
      setStatusMessage("Please provide your name and work email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company: company.trim(),
          product: productInterest,
          service: serviceInterest,
          scope: scope.trim(),
          ndaRequired,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to send your inquiry. Please try again.",
        );
      }

      setSubmitStatus("success");
      setStatusMessage(
        "Thank you! Your inquiry has been successfully sent to our engineering team.",
      );
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setScope("");
    } catch (err: unknown) {
      setSubmitStatus("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong while sending your request.";
      setStatusMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`${manrope.variable} ${inter.variable} bg-white`}>
      {/* Hero / Header */}
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

          <h1 className="max-w-2xl font-[family-name:var(--font-manrope)] text-3xl font-bold leading-tight text-[#0B1C30] md:text-4xl">
            Connect with Our Engineering &amp; Procurement Team
          </h1>
          <p className="mt-4 max-w-2xl font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#5B5E67]">
            Direct technical sales support, plant audit appointments, and
            precision RFQ engineering evaluations.
          </p>
        </div>
      </section>

      {/* Body grid */}
      <section className="px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl border border-[#E4E9F2] bg-white shadow-[0_1px_2px_rgba(11,28,48,0.04)]">
              <div className="bg-[#0B1C30] px-6 py-5">
                <p className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-wide text-[#8FA9C9]">
                  REACH US DIRECTLY
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-manrope)] text-lg font-bold text-white">
                  Contact Information
                </h3>
              </div>

              {/* Address + map */}
              <div className="p-6">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EFF4FF]">
                    <Building2
                      className="h-4.5 w-4.5 text-[#0F4C81]"
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-manrope)] text-sm font-bold text-[#0B1C30]">
                      Address
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#5B5E67]">
                      {address || "Address not available"}
                    </p>
                  </div>
                </div>

                {address && (
                  <>
                    <div className="mt-4 h-36 w-full overflow-hidden rounded-lg border border-[#E4E9F2]">
                      <iframe
                        title="Factory location map"
                        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#D8DEEA] bg-white px-3 py-1.5 font-[family-name:var(--font-inter)] text-xs font-semibold text-[#0B1C30] shadow-sm transition-colors hover:bg-[#F8F9FF]"
                    >
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      Get Driving Directions
                    </a>
                  </>
                )}
              </div>

              {/* Phone + email */}
              <div className="divide-y divide-[#E4E9F2] border-t border-[#E4E9F2]">
                {contactChannels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <a
                      key={ch.label}
                      href={ch.href}
                      className="flex items-center gap-3.5 px-6 py-5 transition-colors hover:bg-[#F8F9FF]"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EFF4FF]">
                        <Icon
                          className="h-4.5 w-4.5 text-[#0F4C81]"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-inter)] text-[11px] font-semibold tracking-wide text-[#5B5E67]">
                          {ch.label.toUpperCase()}
                        </p>
                        <p className="mt-0.5 truncate font-[family-name:var(--font-manrope)] text-base font-bold text-[#0B1C30]">
                          {ch.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex h-full flex-col rounded-lg border border-[#E4E9F2] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#0F4C81] px-2 py-1 font-[family-name:var(--font-inter)] text-[10px] font-semibold tracking-wide text-white">
                TECHNICAL FORM
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs font-medium text-[#5B5E67]">
                High-Priority Direct Routing
              </span>
            </div>

            <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30]">
              Let&apos;s Connect{" "}
            </h2>
            <p className="mt-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-[#5B5E67]">
              Submit detailed engineering specifications, 2D/3D component
              drawings, or project scopes for thorough DFM appraisal and
              commercial terms.
            </p>

            <form
              className="mt-10 flex flex-1 flex-col justify-between"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-5">
                {submitStatus === "success" && (
                  <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold">
                        Inquiry Transmitted Successfully
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        {statusMessage}
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold">Submission Failed</p>
                      <p className="mt-1 text-xs text-red-700">
                        {statusMessage}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Work Email" required>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>

                  <Field label="Contact Number">
                    <div className="flex items-stretch gap-2">
                      <span className="flex w-14 flex-shrink-0 items-center justify-center rounded-md border border-[#D8DEEA] bg-[#F8F9FF] font-[family-name:var(--font-inter)] text-sm text-[#5B5E67]">
                        +91
                      </span>
                      <input
                        type="tel"
                        placeholder="Contact Number"
                        className="form-input form-input--dark-placeholder"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field label="Organization / Company Name">
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="form-input form-input--dark-placeholder"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </Field>

                  <SearchableSelect
                    label="Product of Interest"
                    placeholder="Search or select a product"
                    options={productOptions}
                    value={productInterest}
                    onChange={setProductInterest}
                  />
                  <SearchableSelect
                    label="Service of Interest"
                    placeholder="Search or select a service"
                    options={serviceOptions}
                    value={serviceInterest}
                    onChange={setServiceInterest}
                  />
                </div>

                <Field label="Detailed Project Scope & Material Specifications">
                  <textarea
                    rows={4}
                    placeholder="Describe your design parameters, material grades, expected volume, etc."
                    className="form-input resize-none"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                  />
                </Field>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ndaRequired}
                    onChange={(e) => setNdaRequired(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[#C7D4EA] text-[#0F4C81] focus:ring-[#0F4C81]"
                  />
                  <span className="font-[family-name:var(--font-inter)] text-sm text-[#0B1C30]">
                    We require mutual Non-Disclosure Agreement (NDA) execution
                    prior to sharing proprietary design/tooling data. Please
                    forward {contact.brandName || "Conbell Engineering"}&apos;s
                    standard bilateral NDA.
                  </span>
                </label>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B1C30] px-6 py-3.5 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-[#0F4C81] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Submit inquiry to Engineering Team
                    </>
                  )}
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
        .form-input--dark-placeholder::placeholder {
          color: #0b1c30;
          opacity: 1;
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
  children: ReactNode;
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

/* ----------------------------- SearchableSelect ---------------------------- */

function SearchableSelect({
  label,
  required,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState(value ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setIsMounted(true);
    } else {
      timer = setTimeout(() => setIsMounted(false), 180);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <label className="font-[family-name:var(--font-inter)] text-sm font-medium text-[#0B1C30]">
        {label}
        {required ? <span className="text-[#B9542B]"> *</span> : null}
      </label>

      <div className="relative">
        <input
          type="text"
          className="form-input pr-9"
          placeholder={placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
        />
        <Search
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA1AD]"
          aria-hidden="true"
        />
      </div>

      {isMounted ? (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 top-full z-20 mt-1.5 max-h-56 overflow-y-auto rounded-md border border-[#E4E9F2] bg-white py-1.5 shadow-lg transition-all duration-200 ease-out ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          }`}
        >
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setQuery(option);
                    setIsOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left font-[family-name:var(--font-inter)] text-sm text-[#0B1C30] transition-colors hover:bg-[#EFF4FF]"
                >
                  {option}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3.5 py-2 font-[family-name:var(--font-inter)] text-sm text-[#9AA1AD]">
              No matches found
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
