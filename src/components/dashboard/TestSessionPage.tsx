"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuestionResponse, TestSession } from "@/types/testSession";
import { renderWithLatex } from "@/helpers/katexRenderer";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import ConfirmDialog from "./modals/ConfirmDialog";

interface TestSessionPageProps {
  testSessionProp: string;
}

const TestSessionPage: React.FC<TestSessionPageProps> = ({
  testSessionProp,
}) => {
  const [testSession, setTestSession] = useState<TestSession>(
    JSON.parse(testSessionProp)
  );
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = async (questionId: string, optIndex: number) => {
    const prevVal = { ...testSession };
    try {
      setTestSession((prev) => {
        const response = prev.responses.map((val) => {
          if (val.questionId === questionId) {
            return { ...val, selectedAnswer: optIndex, isAttempted: true };
          }
          return val;
        });
        return { ...prev, responses: response };
      });

      const response = await axios.patch<ApiResponse<undefined>>(
        `/api/mocktests/${testSession._id}/response`,
        {
          questionId,
          selectedAnswer: optIndex,
          isAttempted: true,
        }
      );
      if (!response.data.success) {
        setTestSession(prevVal);
        toast.error(response.data.message || "Failed to update answer");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem selecting answer.";
      toast.error(errorMessage);
      setTestSession(prevVal);
    }
  };

  const handleAnswerLater = async (
    questionId: string,
    markedForLater: boolean
  ) => {
    const prevVal = { ...testSession };
    try {
      setTestSession((prev) => {
        const response = prev.responses.map((val) => {
          if (val.questionId === questionId) {
            return { ...val, markedForLater };
          }
          return val;
        });
        return { ...prev, responses: response };
      });
      const response = await axios.patch<ApiResponse<undefined>>(
        `/api/mocktests/${testSession._id}/response`,
        {
          questionId,
          markedForLater,
        }
      );
      if (!response.data.success) {
        setTestSession(prevVal);
        toast.error(response.data.message || "Failed to update mark for later");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem marking for later.";
      toast.error(errorMessage);
      setTestSession(prevVal);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse<undefined>>(
        `/api/mocktests/${testSession._id}/submit`
      );

      if (response.data.success) {
        toast.success("Test session submitted successfully!");
        console.log(response.data);
        router.push("./result");
      } else {
        toast.error(response.data.message || "Failed to submit test session");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem submitting the test.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setConfirmDialog(false);
    }
  }, [testSession._id]);

  const onBack = () => {
    router.back();
  };

  const openConfirmDialog = () => {
    setConfirmDialog(true);
  };

  // Timer logic for exams
  useEffect(() => {
    if (!testSession.isExam || !testSession.endDate) {
      return;
    }

    const calculateTimeLeft = () => {
      const end = new Date(testSession?.endDate as string).getTime();
      const now = Date.now();
      const remaining = Math.max(0, end - now);
      return Math.floor(remaining / 1000); // Convert to seconds
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        toast.info("Time's up! Submitting test session...");
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [testSession.isExam, testSession.endDate, handleSubmit]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-16 z-9 px-10">
        <div className="mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {testSession.questionSetId.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {testSession.isExam && timeLeft !== null && (
              <div className="text-lg font-medium text-gray-800">
                {formatTime(timeLeft)}
              </div>
            )}
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={openConfirmDialog}
              disabled={testSession.isSubmitted}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {testSession.responses.map(
          (response: QuestionResponse, index: number) => {
            if (!response.question) {
              return null; // Skip if question is missing
            }
            return (
              <div
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
                key={response.questionId}
              >
                <h2 className="text-lg font-medium text-gray-800 mb-6 flex gap-2">
                  {index + 1}) {renderWithLatex(response.question.body)}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {response.question.answers.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() =>
                        handleAnswerSelect(response.questionId, optIndex)
                      }
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        response.selectedAnswer === optIndex
                          ? "border-gray-500 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      disabled={testSession.isSubmitted}
                    >
                      {renderWithLatex(option.answer)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    onClick={() =>
                      handleAnswerLater(
                        response.questionId,
                        !response.markedForLater
                      )
                    }
                    disabled={testSession.isSubmitted}
                  >
                    <input
                      type="checkbox"
                      checked={response.markedForLater}
                      onChange={() =>
                        handleAnswerLater(
                          response.questionId,
                          !response.markedForLater
                        )
                      }
                      className="rounded border-gray-300"
                      disabled={testSession.isSubmitted}
                    />
                    <span>Answer Later</span>
                  </button>
                </div>
              </div>
            );
          }
        )}
      </main>
      <ConfirmDialog
        open={confirmDialog}
        onCancel={() => setConfirmDialog(false)}
        onSubmit={handleSubmit}
        stats={{
          total: testSession.responses.length,
          attempted: testSession.responses.filter((q) => q.isAttempted).length,
          notAttempted: testSession.responses.filter((q) => !q.isAttempted)
            .length,
          marked: testSession.responses.filter((q) => q.markedForLater).length,
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TestSessionPage;
