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
