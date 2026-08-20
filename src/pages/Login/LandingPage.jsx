import { Box } from "@mui/material";

import { Navigation } from "../Landingpage/Navigation";
import { HeroSection } from "../Landingpage/HeroSection";
import { ClientLogos } from "../Landingpage/ClientLogo";
import { StatsSection } from "../Landingpage/StatSection";
import { FooterSection } from "../Landingpage/FooterSection";
import FinalCTASection from "../Landingpage/FinalCTASection";
import ContactSection from "../Landingpage/ContactSection";
import ConsultancySection from "../Landingpage/ConsultancySection";
import TestimonialsSection from "../Landingpage/TestimonialsSection";
import PricingSection from "../Landingpage/PricingSection";
import FeaturesSection from "../Landingpage/FeaturesSection";
import WorkflowSection from "../Landingpage/WorkflowSection";
import { useLanguage } from "../../providers/LanguageProvider";
import { getGarageLandingData } from "../../data/garageLandingData";

export default function GarageLandingPage() {
  const { language, setLanguage } = useLanguage();
const {
  features,
  workflowSteps,
  pricingPlans,
  testimonials,
  stats,
} = getGarageLandingData(language);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)",
        color: "white",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Navigation
        scrollToSection={scrollToSection}
        language={language}
        setLanguage={setLanguage}
      />
      <HeroSection language={language} />
      <ClientLogos language={language} />
      <StatsSection stats={stats} language={language} />
      <WorkflowSection workflowSteps={workflowSteps} language={language} />
      <FeaturesSection features={features} language={language} />
      <PricingSection pricingPlans={pricingPlans} language={language} />
      <TestimonialsSection testimonials={testimonials} language={language} />
      <ConsultancySection language={language} />
      <ContactSection language={language} />
      <FinalCTASection language={language} />
      <FooterSection language={language} />
    </Box>
  );
}
