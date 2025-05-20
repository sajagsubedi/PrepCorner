"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  LineChart,
  ShieldCheck,
  Target,
  ListChecks,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    title: "Exam-wise Practice",
    description: "Practice questions filtered by specific entrance exams.",
    icon: <Target className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Verified Questions",
    description: "All sets are curated and verified by subject experts.",
    icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Instant Performance Insights",
    description: "Get real-time feedback and stats after each practice set.",
    icon: <LineChart className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Track Progress",
    description: "Analyze your growth with detailed performance history.",
    icon: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Subject Categorization",
    description: "Practice by Physics, Chemistry, Biology, Math, etc.",
    icon: <ListChecks className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Distraction-free UI",
    description: "Focus on learning with a clean and minimal interface.",
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full bg-white py-16 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-10">
          Our Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="bg-blue-100 p-2 rounded-md">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
