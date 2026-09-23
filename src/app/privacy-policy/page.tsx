import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCode,
  Server,
  UserCheck,
  ChevronRight,
  Clock,
  Mail,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Conbell Engineering Private Limited",
  description:
    "Privacy Policy for Conbell Engineering Private Limited. Protecting your industrial data, technical CAD drawings, contact info, and business confidentiality.",
};

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Overview & Commitment to Privacy",
    content: `Conbell Engineering Private Limited ("Conbell Engineering", "we", "us", or "our") respects the privacy and confidentiality of our clients, prospective customers, partners, and website visitors.
    
This Privacy Policy describes how we collect, store, utilize, protect, and disclose information obtained through our website (conbellengineering.com), quotation inquiry forms, CAD blueprint submissions, and commercial business interactions.`,
  },
  {
    id: "collection",
    title: "2. Information We Collect",
    content: `We collect information necessary to provide industrial engineering quotes, structural qualification, and manufacturing services:

• Contact Details: Name, job title, company name, corporate email address, contact phone number, and factory/shipping delivery address.
• Technical & RFQ Data: 2D/3D CAD models (.step, .dwg, .dxf, .pdf), bill of materials (BOM), structural load requirements, coating preferences, and project timelines submitted via our website upload forms or email.
• Automated Technical Data: IP address, browser type, device information, operating system, and anonymous interaction metrics collected through cookies for performance optimization.`,
  },
  {
    id: "usage",
    title: "3. How We Use Your Information",
    content: `The information collected is strictly utilized for legitimate industrial engineering and commercial purposes, including:
• Analyzing drawings and preparing detailed, engineering-accurate commercial quotations.
• Manufacturing, fabrication planning, CNC programming, quality inspections, and logistical dispatch.
• Communicating project milestone status, engineering change notes, and post-delivery technical support.
• Complying with statutory tax, invoicing (GST), customs, and industrial reporting obligations.
• Enhancing the functionality, navigation, and security of our online web platform.`,
  },
  {
    id: "cad-protection",
    title: "4. Confidentiality of Technical Blueprints & IP",
    content: `We understand that proprietary product designs, prototype machinery skids, and production line layouts represent mission-critical intellectual property:
• All customer drawings and technical files are stored on secure, access-controlled engineering networks.
• Files are shared solely with authorized application engineers, project heads, and certified fabrication supervisors who have executed non-disclosure covenants.
• We execute formal Bilateral Non-Disclosure Agreements (NDA) prior to receiving confidential drawings upon client request.
• Blueprints are never disclosed, licensed, or shared with unauthorized third parties or competitors.`,
  },
  {
    id: "sharing",
    title: "5. Information Sharing & Third Parties",
    content: `Conbell Engineering does not sell, rent, trade, or commercially monetize client data or technical drawings.
    
Information is disclosed only under strictly controlled operational conditions:
• Certified Service Providers: Trusted logistics carriers, NDT testing laboratories, and third-party inspection agencies (TPI) solely to the extent required to execute your fabrication project.
• Legal Mandates: When required by applicable Indian law, judicial decree, or factory inspectorate audit authorities.`,
  },
  {
    id: "security",
    title: "6. Data Security & Storage",
    content: `We employ industry-standard technical and organizational security controls to safeguard your data against accidental loss, unauthorized access, alteration, or disclosure.
    
Our website utilizes Secure Sockets Layer (SSL/TLS) encryption for all form submissions and file transmissions. While we take every reasonable precaution, no Internet transmission is 100% immune from external security vulnerabilities; however, our offline engineering repositories remain isolated behind corporate firewalls.`,
  },
  {
    id: "cookies",
    title: "7. Cookies & Web Analytics",
    content: `Our website may use standard session and analytical cookies to remember user preferences, ensure fast loading of structural galleries, and analyze aggregated visitor flow. You can adjust your browser settings to reject cookies, though certain interactive features may experience reduced performance.`,
  },
  {
    id: "rights",
    title: "8. Your Rights",
    content: `You maintain the right to:
• Request confirmation of whether we hold personal or corporate contact information regarding your company.
• Request correction or updating of outdated contact details or shipping addresses.
• Request deletion of your technical files from our active RFQ archives (subject to statutory warranty, tax, and accounting retention requirements).`,
  },
  {
    id: "updates",
    title: "9. Policy Revisions",
    content: `We reserve the right to amend this Privacy Policy periodically to reflect technological advances, manufacturing additions, or regulatory updates. Any revisions become effective immediately upon posting to this page.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ----------------- Breadcrumb & Hero Header ----------------- */}
      <section className="border-b border-blue-100 bg-[#EFF4FF] px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            <Link href="/" className="transition-colors hover:text-[#00355F]">
              Home
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-bold text-[#00355F]">Privacy Policy</span>
          </nav>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00355F] shadow-sm">
                <Lock size={14} className="text-[#00355F]" />
                Data Protection &amp; Confidentiality
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-2 text-base text-slate-600 sm:text-lg">
                Conbell Engineering Private Limited • Protecting Your Drawings &amp; Business Information
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Clock size={14} />
              <span>Last Updated: 2024–2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Main Content ----------------- */}
      <section className="px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contents
                </p>
                <nav className="mt-3 space-y-1.5 text-xs">
                  {SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block rounded-lg px-2.5 py-1.5 font-medium text-slate-600 transition-colors hover:bg-[#EFF4FF] hover:text-[#00355F]"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-[11px] text-slate-500">
                    Require a signed Non-Disclosure Agreement (NDA) before sharing CAD drawings?
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 inline-block text-xs font-bold text-[#00355F] hover:underline"
                  >
                    Request NDA &rarr;
                  </Link>
                </div>
              </div>
            </aside>

            {/* Content blocks */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-blue-200 bg-[#EFF4FF]/70 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00355F] text-white">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      Our Confidentiality Promise
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Conbell Engineering treats all customer drawings, engineering specifications, and RFQ data as strictly proprietary trade secrets. We never disclose or monetize client CAD designs.
                    </p>
                  </div>
                </div>
              </div>

              {SECTIONS.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {section.content}
                  </div>
                </div>
              ))}

              {/* Data Protection Inquiries */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#00355F]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Privacy &amp; Data Protection Officer
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                      If you have questions regarding our privacy practices or wish to submit an NDA request, please contact our administrative desk:
                    </p>
                    <div className="mt-3 text-xs text-slate-700 space-y-1">
                      <p>
                        <strong>Conbell Engineering Private Limited</strong>
                      </p>
                      <p>
                        Survey No. 298/A, Vadavswami-Ambapura Road, Village: Vadavswami, Ta.: Kalol(N.G)-382740, Gujarat, India.
                      </p>
                      <p>
                        Email:{" "}
                        <a
                          href="mailto:info@conbellengineering.com"
                          className="font-bold text-[#00355F] hover:underline"
                        >
                          info@conbellengineering.com
                        </a>{" "}
                        | Phone: +91-95866 10281
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
