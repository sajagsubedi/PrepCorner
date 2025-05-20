"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  UserPlus,
  BookOpenCheck,
  FolderKanban,
  FileCheck2,
  BarChart2,
} from "lucide-react";

const steps = [
  {
    title: "Sign Up & Log In",
    description: "Create your PrepCorner account to get started.",
    icon: UserPlus,
  },
  {
    title: "Join a Course",
    description: "Request and get access to entrance-focused courses.",
    icon: BookOpenCheck,
  },
  {
    title: "Explore & Learn",
    description: "View topics, categories, and prepare at your pace.",
    icon: FolderKanban,
  },
  {
    title: "Take Tests & Get Results",
    description: "Attempt tests and receive instant feedback.",
    icon: FileCheck2,
  },
  {
    title: "Track Progress",
    description: "Monitor performance, analytics, and grow consistently.",
    icon: BarChart2,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary">How It Works</h2>
        <p className="text-muted-foreground mt-2">
          A simple process to prepare smarter and track your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="flex flex-col items-center text-center shadow-md hover:shadow-xl transition p-6 border border-muted bg-white rounded-2xl"
          >
            <div className="bg-primary/10 text-tblue p-4 rounded-full mb-4">
              <step.icon className="w-6 h-6" />
            </div>
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
              <span className="block text-xs text-primary font-semibold mt-4">
                Step {index + 1}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
