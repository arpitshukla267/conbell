"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Manrope, Inter } from "next/font/google";
import {
  ChevronRight,
  ChevronDown,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Loader2,
  Send,
  Building2,
  FileCheck,
} from "lucide-react";
import { fetchFromBackend } from "../../lib/api";
import { ApplicationModal } from "./application-modal";

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

interface Job {
  _id: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  experience?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  order?: number;
  isActive?: boolean;
}

// API response array ho ya { data: [] } / { items: [] }, teeno handle
function extractList(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState(
    "info@conbellengineering.com",
  );

  // Application Modal state
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Vacancies
  useEffect(() => {
    async function loadJobs() {
      try {
        let data = await fetchFromBackend<any>("/api/jobs", []);
        if (!data || (Array.isArray(data) && data.length === 0)) {
          data = await fetchFromBackend<any>("/api/jobs/active", []);
        }
        if (!data || (Array.isArray(data) && data.length === 0)) {
          data = await fetchFromBackend<any>("/api/jobs/all", []);
        }
        const list = extractList(data)
          .filter((j) => j && j.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setJobs(list);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Apply email CMS config se
  useEffect(() => {
    fetchFromBackend<Record<string, any>>("/api/content/config", {}).then(
      (data) => {
        if (data?.contact?.email) setContactEmail(data.contact.email);
      },
    );
  }, []);

  function handleOpenApplyModal(job: Job | null) {
    setApplyModalJob(job);
    setIsApplyModalOpen(true);
  }

  return (
    <main className={`${manrope.variable} ${inter.variable} bg-white`}>
      {/* Hero */}
      <section className="bg-[#EFF4FF] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-[95vw]">
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
            <span className="font-medium text-[#0F4C81]">Careers</span>
          </nav>

          <h1 className="max-w-3xl font-[family-name:var(--font-manrope)] text-3xl font-bold leading-tight text-[#0B1C30] md:text-5xl">
            Build Your Career with Conbell Engineering
          </h1>
          <p className="mt-4 max-w-2xl font-[family-name:var(--font-inter)] text-base leading-relaxed text-[#5B5E67] md:text-lg">
            Join a team delivering precision fabrication and industrial
            engineering solutions. Explore our current openings below.
          </p>
        </div>
      </section>

      {/* Vacancies */}
      <section className="md:px-12 py-12 md:py-16">
        <div className="mx-auto max-w-[95vw]">
          {loading ? (
            <div className="flex h-56 items-center justify-center">
              <Loader2
                className="h-7 w-7 animate-spin text-[#0F4C81]"
                aria-label="Loading vacancies"
              />
            </div>
          ) : jobs.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#E4E9F2] px-6 py-16 text-center space-y-4">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF4FF]">
                <Briefcase
                  className="h-7 w-7 text-[#0F4C81]"
                  aria-hidden="true"
                />
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#0B1C30]">
                  No open positions right now
                </h2>
                <p className="mx-auto mt-2 max-w-md font-[family-name:var(--font-inter)] text-sm text-[#5B5E67]">
                  We don&apos;t have any specific openings at the moment. You can still
                  submit your resume and we&apos;ll keep it on file for future opportunities.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleOpenApplyModal(null)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B1C30] px-5 py-2.5 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-[#0F4C81] cursor-pointer shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Submit General Application
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#0B1C30]">
                    Current Openings
                  </h2>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#5B5E67] mt-0.5">
                    Click &quot;Apply Now&quot; on any role to submit your details and attach your resume.
                  </p>
                </div>
                <p className="font-[family-name:var(--font-inter)] text-sm text-[#5B5E67]">
                  {jobs.length} open{" "}
                  {jobs.length === 1 ? "position" : "positions"}
                </p>
              </div>

              <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => {
                  const isOpen = openId === job._id;
                  const hasDetails =
                    !!job.description ||
                    (job.responsibilities?.length ?? 0) > 0 ||
                    (job.requirements?.length ?? 0) > 0;

                  return (
                    <article
                      key={job._id}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                        isOpen
                          ? "border-[#0F4C81] shadow-lg"
                          : "border-[#E4E9F2] shadow-[0_1px_2px_rgba(11,28,48,0.04)] hover:-translate-y-0.5 hover:border-[#C9D6EA] hover:shadow-md"
                      }`}
                    >
                      {/* Accent bar */}
                      <span
                        aria-hidden="true"
                        className={`h-1 w-full transition-colors ${
                          isOpen
                            ? "bg-[#0F4C81]"
                            : "bg-[#EFF4FF] group-hover:bg-[#0F4C81]"
                        }`}
                      />

                      <div className="flex flex-col p-5 md:p-6">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          {job.department && (
                            <span className="rounded-md bg-[#EFF4FF] px-2.5 py-1 font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wide text-[#0F4C81]">
                              {job.department}
                            </span>
                          )}
                          {job.type && (
                            <span className="rounded-md bg-slate-100 px-2.5 py-1 font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                              {job.type}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="mt-3 font-[family-name:var(--font-manrope)] text-xl font-bold leading-snug text-[#0B1C30]">
                          {job.title}
                        </h3>

                        {/* Meta */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]">
                          {job.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin
                                className="h-3.5 w-3.5 text-[#0F4C81]"
                                aria-hidden="true"
                              />
                              {job.location}
                            </span>
                          )}
                          {job.experience && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock
                                className="h-3.5 w-3.5 text-[#0F4C81]"
                                aria-hidden="true"
                              />
                              Exp: {job.experience}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expandable details */}
                      {hasDetails && (
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="space-y-4 border-t border-[#E4E9F2] px-5 py-5 md:px-6">
                              {job.description && (
                                <div>
                                  <h4 className="font-[family-name:var(--font-manrope)] text-xs font-bold uppercase tracking-wider text-[#0B1C30]">
                                    Role Overview
                                  </h4>
                                  <p className="mt-1 whitespace-pre-line font-[family-name:var(--font-inter)] text-xs leading-relaxed text-[#5B5E67]">
                                    {job.description}
                                  </p>
                                </div>
                              )}

                              {job.responsibilities &&
                                job.responsibilities.length > 0 && (
                                  <BulletList
                                    title="Responsibilities"
                                    items={job.responsibilities}
                                  />
                                )}

                              {job.requirements &&
                                job.requirements.length > 0 && (
                                  <BulletList
                                    title="Requirements"
                                    items={job.requirements}
                                  />
                                )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Footer with Apply Now Button */}
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#E4E9F2] bg-[#F8FAFF] px-5 py-3.5 md:px-6">
                        {hasDetails ? (
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : job._id)}
                            aria-expanded={isOpen}
                            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-xs font-semibold text-[#0F4C81] hover:underline cursor-pointer"
                          >
                            {isOpen ? "Hide details" : "View details"}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(job)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#0B1C30] px-4 py-2 font-[family-name:var(--font-inter)] text-xs font-bold text-white transition-colors hover:bg-[#0F4C81] cursor-pointer shadow-xs"
                        >
                          <Send className="h-3.5 w-3.5" aria-hidden="true" />
                          Apply Now
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* General Application Banner */}
              {/* <div className="mt-12 rounded-2xl bg-[#EFF4FF]/60 border border-[#D8DEEA] p-6 text-center sm:text-left sm:flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#0B1C30]">
                    Don&apos;t see the right role listed above?
                  </h4>
                  <p className="font-[family-name:var(--font-inter)] text-xs text-[#5B5E67] mt-1">
                    Submit your resume to our talent pool. Our engineering leadership regularly reviews candidate submissions for new upcoming requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenApplyModal(null)}
                  className="mt-4 sm:mt-0 shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#0B1C30] px-4.5 py-2.5 font-[family-name:var(--font-inter)] text-xs font-bold text-white transition-colors hover:bg-[#0F4C81] cursor-pointer shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit Open Application
                </button>
              </div> */}
            </>
          )}
        </div>
      </section>

      {/* Candidate Application Modal */}
      <ApplicationModal
        job={applyModalJob}
        open={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </main>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-[family-name:var(--font-manrope)] text-xs font-bold uppercase tracking-wider text-[#0B1C30]">
        {title}
      </h4>
      <ul className="mt-1.5 space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 font-[family-name:var(--font-inter)] text-xs text-[#5B5E67]"
          >
            <CheckCircle2
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#0F4C81]"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
