"use client";

import React, { useState } from "react";
import { QuestionSet } from "@/types/questionSet";
import { renderWithLatex } from "@/helpers/katexRenderer";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuestionPageProps {
  questionSet: string;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  questionSet: questionString,
}) => {
  const [questionSet] = useState<QuestionSet>(JSON.parse(questionString));
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="bg-gray-50 border-y border-gray-200 sticky top-16">
        <div className="w-full mx-auto px-10 py-4 flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <button onClick={onBack}>
              <ArrowLeft />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {questionSet.name}
            </h1>
          </div>
          <p>Duration: {questionSet.duration / 60} minutes</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {questionSet?.questions?.length == 0 && (
          <div className="flex items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg mx-10">
            No question sets!
          </div>
        )}
        {questionSet?.questions &&
          questionSet?.questions.length > 0 &&
          questionSet.questions.map((question, index) => (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6" key={index}>
              <h2 className="text-lg font-medium text-gray-800 mb-6 flex gap-2">
                {index + 1}. {renderWithLatex(question.body)}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {question.answers.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`w-full p-4 rounded-lg border ${
                      question.correctAnswer === optIndex
                        ? "border-green-500 bg-green-100"
                        : "border-gray-200"
                    }`}
                  >
                    {renderWithLatex(option.answer)}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
};

export default QuestionPage;
