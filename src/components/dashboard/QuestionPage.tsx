"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { QuestionSet } from "@/types/questionSet";
import katex from "katex";
import "katex/dist/katex.min.css";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import Image from "next/image";
import { useRouter } from "next/navigation";

// KaTeX Renderer Component
const KatexRenderer: React.FC<{ latex: string }> = ({ latex }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(latex, containerRef.current, {
        throwOnError: false,
        displayMode: false,
      });
    }
  }, [latex]);

  return <span ref={containerRef}></span>;
};

const renderWithLatex = (text: string) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (
          domNode.name === "ki" &&
          domNode.attribs["data-katex"] === "true" &&
          domNode.attribs.src
        ) {
          return <KatexRenderer latex={domNode.attribs.src} />;
        }

        if (domNode.name === "img") {
          const src = domNode.attribs.src;
          if (src.trim() == "") {
            console.warn(
              "Empty or missing src attribute for <img> tag:",
              domNode
            );
            return <></>; // Skip rendering the image
          }
          return (
            <Image
              src={src}
              className={domNode.attribs.class || ""}
              alt="Question image"
              height={200}
              width={200}
              style={{
                maxWidth: "100%",
                ...(domNode.attribs["data-size"] === "small" && {
                  width: "200px",
                }),
                ...(domNode.attribs["data-float"] === "none" && {
                  float: "none",
                }),
              }}
            />
          );
        }
        if (domNode.attribs.src == "") {
          return <></>;
        }
      }

      return null; // Let other nodes be handled by default
    },
  };

  return parse(text, options);
};

interface QuestionPageProps {
  questionSet: string;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  questionSet: questionString,
}) => {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };

  const [questionSet] = useState<QuestionSet>(JSON.parse(questionString));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0">
        <div className="max-w-6xl mx-auto px-2 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {questionSet.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
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
