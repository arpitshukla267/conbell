import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & RFQ | Engineering Team",
  description:
    "Connect directly with Conbell Engineering for fabrication inquiries, DFM review, project drawings submission, plant audits, and commercial RFQs.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & RFQ | Conbell Engineering",
    description:
      "Connect directly with Conbell Engineering for fabrication inquiries, DFM review, project drawings submission, plant audits, and commercial RFQs.",
    url: "https://conbellengineering.com/contact",
    siteName: "Conbell Engineering",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Contact Conbell Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us & RFQ | Conbell Engineering",
    description:
      "Connect directly with Conbell Engineering for fabrication inquiries, DFM review, project drawings submission, plant audits, and commercial RFQs.",
    images: ["/logo.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
