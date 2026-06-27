import Box from "@mui/material/Box";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import PainSection from "@/app/components/PainSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import StepsSection from "@/app/components/StepsSection";
import PricingSection from "@/app/components/PricingSection";
import CTASection from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <HeroSection />
        <PainSection />
        <FeaturesSection />
        <StepsSection />
        <PricingSection />
        <CTASection />
      </Box>
      <Footer />
    </Box>
  );
}
