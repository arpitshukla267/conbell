import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products & Manufacturing Capabilities",
  description:
    "Explore Conbell Engineering's structural fabrication capabilities, conveyor structures, mezzanine floors, safety rails, catwalks, tanks, and turnkey solutions.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products & Manufacturing Capabilities | Conbell Engineering",
    description:
      "Explore Conbell Engineering's structural fabrication capabilities, conveyor structures, mezzanine floors, safety rails, catwalks, tanks, and turnkey solutions.",
    url: "https://conbellengineering.com/products",
    siteName: "Conbell Engineering",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Conbell Engineering Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products & Manufacturing Capabilities | Conbell Engineering",
    description:
      "Explore Conbell Engineering's structural fabrication capabilities, conveyor structures, mezzanine floors, safety rails, catwalks, tanks, and turnkey solutions.",
    images: ["/logo.png"],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
