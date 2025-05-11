import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <section className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Ace your
          <br />
          entrance exams
          <br />
          with PrepCorner
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Practice curated questions by examination, category, and verified
          sets.
        </p>
        <Button>Start practicing</Button>
      </section>

      {/* Features Section */}
      <section className="mt-24 px-4 pb-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Structured Practice,",
            desc: "Dedicated sections by practice pattern with curation.",
          },
          {
            title: "Real Exam Simulation,",
            desc: "Dedicated sessions to simulate the exact environment.",
          },
          {
            title: "Instant Feedback,",
            desc: "Detailed sections by teachers certain with positive outcomes.",
          },
          {
            title: "Controlled Access.",
            desc: "Dedicated sections to throttle certain distribution.",
          },
        ].map((feature, idx) => (
          <Card
            key={idx}
            className="rounded-2xl shadow-md bg-white/80 backdrop-blur-sm"
          >
            <CardContent className="p-6 space-y-4">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-md">
                {feature.title.charAt(0)}
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
