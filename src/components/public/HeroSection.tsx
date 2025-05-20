import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="text-center px-4 flex">
      <div className="w-1/2 px-10 py-20">
        <h1 className="text-5xl font-bold leading-tight text-black">
          Prep Smarter, Score Higher with PrepCorner
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Practice expertly crafted entrance exam questions by subject,
          category, or full-length tests — all in one place.
        </p>
        <div className="gap-4 mt-8 flex justify-center">
          <Button variant={"outline"} size="lg">
            Start practicing
          </Button>
          <Button size="lg">Get Started</Button>
        </div>
      </div>
      <Image
        src="/assets/banner.png"
        alt="banner"
        className="w-1/2 h-auto"
        height={5050}
        width={6000}
      />
    </section>
  );
};

export default HeroSection;
