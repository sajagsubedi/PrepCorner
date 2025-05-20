import { FeaturesSection } from "@/components/public/Feature";
import HeroSection from "@/components/public/HeroSection";
import HowItWorks from "@/components/public/HowItWorks";
import React from "react";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
    </main>
  );
}
