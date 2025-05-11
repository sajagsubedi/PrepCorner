import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Ace your
        <br />
        entrance exams
        <br />
        with PrepCorner
      </h1>
      <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
        Practice curated questions by examination, category, and verified sets.
      </p>
      <Button>Start practicing</Button>
    </section>
  );
};

export default HeroSection;
