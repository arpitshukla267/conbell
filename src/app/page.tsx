import Hero from "../sections/Hero";
import Aboutsection from "../sections/Aboutsection";
import ServicesSection from "../sections/ServicesSection";
import ProcessSection from "../sections/ProcessSection";
import CoreStrengthsSection from "../sections/CoreStrengthsSection";
import ManufacturingInfrastructure from "../sections/Manufacturinginfrastructure";
import FeaturedProjects from "../sections/Featuredprojects";
import Application from "../sections/Application";
import QualityStandards from "../sections/Qualitystandards";
import ClientsCarousel from "../sections/Clientscarousel";
import FAQSection from "../sections/Faqsection";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <Aboutsection />
      <ServicesSection />
      <ProcessSection />
      <CoreStrengthsSection />
      <ClientsCarousel />
      <ManufacturingInfrastructure />
      <Application />
      <FeaturedProjects />
      <QualityStandards />
      <FAQSection />
    </div>
  );
}
