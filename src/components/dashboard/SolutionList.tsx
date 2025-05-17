"use client";

import { renderWithLatex } from "@/helpers/katexRenderer";
import { TestSession } from "@/types/testSession";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";

const SolutionList = ({ testSession }: { testSession: string }) => {
  const [solutionsData] = useState<TestSession>(JSON.parse(testSession));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-16 z-10 px-10">
        <div className="mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {solutionsData.questionSetId.name} - Solutions
            </h1>
          </div>
          <Button>
            <Link href={"./"}>See Result</Link>
          </Button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {solutionsData.responses.map((solution, index) => (
          <div
            className="bg-white rounded-lg p-6 mb-6"
            key={solution.questionId}
          >
            <h2 className="font-medium text-gray-800 mb-5 flex gap-2 text-xl">
              {index + 1})
              {renderWithLatex(solution.question ? solution.question.body : "")}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {solution.question?.answers.map((option, optIndex) => {
                const isCorrect = optIndex === solution.question?.correctAnswer;
                const isSelected = solution.selectedAnswer === optIndex;

                let borderStyle = "border-gray-200";
                let bgStyle = "bg-white";
                let label = null;

                if (isCorrect && isSelected) {
                  borderStyle = "border-green-500 border-2"; // Green border for correct answer
                  bgStyle = "bg-green-50"; // Light green background
                  label = (
                    <span className="ml-2 text-green-600 text-sm absolute bottom-0 translate-y-1/2 right-2 bg-white">
                      Your Answer
                    </span>
                  );
                } else if (isSelected && !isCorrect) {
                  borderStyle = "border-red-500 border-2"; // Red border for incorrect user answer
                  bgStyle = "bg-red-50"; // Light red background
                  label = (
                    <span className="ml-2 text-red-600 text-sm absolute right-2 bottom-0 translate-y-1/2 bg-white">
                      Your Answer
                    </span>
                  );
                } else if (isCorrect) {
                  borderStyle = "border-green-500 border-2"; // Green border for correct answer
                  bgStyle = "bg-green-50"; // Light green background
                  label = (
                    <span className="ml-2 text-green-600 text-sm absolute top-0 -translate-y-1/2 right-2 bg-white">
                      Correct Answer
                    </span>
                  );
                }

                return (
                  <div
                    key={optIndex}
                    className={`p-4  rounded-lg border ${borderStyle} ${bgStyle} flex justify-between items-center relative text-lg py-6`}
                  >
                    <div className="flex gap-2">
                      {optIndex + 1}){renderWithLatex(option.answer)}
                    </div>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SolutionList;
