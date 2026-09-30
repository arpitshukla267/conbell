import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Manrope, Inter } from "next/font/google";
import HeaderController from "../components/ui/HeaderController";
import Footer from "../components/Footer";
import RouteLoader from "../components/loaders/RouteLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://conbellengineering.com"),
  title: {
    default:
      "Conbell Engineering | Heavy Industrial Fabrication & Conveyor Systems",
    template: "%s | Conbell Engineering",
  },
  description:
    "Conbell Engineering is a leading provider of heavy industrial fabrication and conveyor systems, delivering precision-engineered solutions for diverse industries.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title:
      "Conbell Engineering | Heavy Industrial Fabrication & Conveyor Systems",
    description:
      "Conbell Engineering is a leading provider of heavy industrial fabrication and conveyor systems, delivering precision-engineered solutions for diverse industries.",
    url: "https://conbellengineering.com",
    siteName: "Conbell Engineering",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Conbell Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Conbell Engineering | Heavy Industrial Fabrication & Conveyor Systems",
    description:
      "Conbell Engineering is a leading provider of heavy industrial fabrication and conveyor systems, delivering precision-engineered solutions for diverse industries.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://conbellengineering.com/#organization",
      name: "Conbell Engineering",
      legalName: "Conbell Engineering Private Limited",
      url: "https://conbellengineering.com",
      logo: "https://conbellengineering.com/logo.png",
      image: "https://conbellengineering.com/logo.png",
      description:
        "Conbell Engineering is a leading provider of heavy industrial fabrication and conveyor systems, delivering precision-engineered solutions for diverse industries.",
      telephone: "+91-95866 10281",
      email: "info@conbellengineering.com",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Survey No. 298/A, Vadavswami-Ambapura Road, Village: Vadavswami",
        addressLocality: "Kalol",
        addressRegion: "Gujarat",
        postalCode: "382740",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-95866 10281",
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Gujarati"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://conbellengineering.com/#website",
      url: "https://conbellengineering.com",
      name: "Conbell Engineering",
      description:
        "Heavy Industrial Fabrication & Conveyor Systems Manufacturer in Gujarat, India",
      publisher: {
        "@id": "https://conbellengineering.com/#organization",
      },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <RouteLoader />
        <HeaderController>{children}</HeaderController>
        <Footer />
      </body>
    </html>
  );
}
