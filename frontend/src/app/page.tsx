import type { Metadata } from "next";
import Hero from "../sections/Hero";
import Aboutsection from "../sections/Aboutsection";
import ServicesSection from "../sections/ServicesSection";
import ProcessSection from "../sections/ProcessSection";
import CoreStrengthsSection from "../sections/CoreStrengthsSection";
import ManufacturingInfrastructure from "../sections/Manufacturinginfrastructure";
import IndustriesWeServe from "../sections/Industriesweserve";
import QualityStandards from "../sections/Qualitystandards";
import ClientsCarousel from "../sections/Clientscarousel";
import FAQSection from "../sections/Faqsection";
import ProductsSection from "../sections/Products";

export const metadata: Metadata = {
  title:
    "Conbell Engineering | Heavy Industrial Fabrication & Conveyor Systems",
  description:
    "Conbell Engineering is a premier heavy industrial fabrication and conveyor systems manufacturer in Gujarat, India. Delivering precision engineering, automated assembly lines, and turnkey projects.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Conbell Engineering | Heavy Industrial Fabrication & Conveyor Systems",
    description:
      "Conbell Engineering is a premier heavy industrial fabrication and conveyor systems manufacturer in Gujarat, India. Delivering precision engineering, automated assembly lines, and turnkey projects.",
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
      "Conbell Engineering is a premier heavy industrial fabrication and conveyor systems manufacturer in Gujarat, India. Delivering precision engineering, automated assembly lines, and turnkey projects.",
    images: ["/logo.png"],
  },
};

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <Aboutsection />
      <ServicesSection />
      <ProcessSection />
      <ProductsSection />
      <CoreStrengthsSection />
      <ClientsCarousel />
      <IndustriesWeServe />
      <ManufacturingInfrastructure />
      <QualityStandards />
      <FAQSection />
    </div>
  );
}
