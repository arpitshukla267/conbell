import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Industrial Fabrication Specialists",
  description:
    "Learn about Conbell Engineering, our vision, mission, directors, and decades of engineering excellence in heavy industrial fabrication and conveyor systems.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Conbell Engineering",
    description:
      "Learn about Conbell Engineering, our vision, mission, directors, and decades of engineering excellence in heavy industrial fabrication and conveyor systems.",
    url: "https://conbellengineering.com/about",
    siteName: "Conbell Engineering",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/story.png",
        width: 800,
        height: 600,
        alt: "Conbell Engineering Manufacturing Facility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Conbell Engineering",
    description:
      "Learn about Conbell Engineering, our vision, mission, directors, and decades of engineering excellence in heavy industrial fabrication and conveyor systems.",
    images: ["/story.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
