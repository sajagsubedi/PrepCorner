"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, ListChecks } from "lucide-react";
import { TestSession } from "@/types/testSession";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CourseCardSkeleton from "@/components/skeleton/CourseCardSkeleton";

export default function TestSessionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testSessions, setTestSessions] = useState<TestSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const fetchTestSessions = async () => {
      try {
        const res = await axios.get<ApiResponse<TestSession[]>>(
          "/api/mocktests"
        );

        if (res.data.success && res.data.data) {
          setTestSessions(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<undefined>>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Failed to fetch test sessions.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSessions();
  }, [status, session, router]);

  const getProgress = (session: TestSession) => {
    const attempted = session.responses.filter((r) => r.isAttempted).length;
    const total = session.responses.length;
    return { attempted, total };
  };

  const handleSubmit = async (testId: string) => {
    try {
      const response = await axios.post<ApiResponse<undefined>>(
        `/api/mocktests/${testId}/submit`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push(`./my-tests/${testId}/result`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      toast.error(
        axiosError.response?.data?.message || "Failed to submit test."
      );
    }
  };

  const getActionButton = (session: TestSession) => {
    const endDate = session.endDate ? new Date(session.endDate) : null;
    const hasEndDatePassed =
      endDate && !isNaN(endDate.getTime()) && endDate < new Date();

    if (session.isSubmitted) {
      return (
        <Button
          size="sm"
          className="flex justify-center items-center w-full mt-4 bg-gray-700 hover:bg-gray-80"
          asChild
        >
          <Link href={`./my-tests/${session._id}/result`}>View Results</Link>
        </Button>
      );
    }

    if (session.isExam && hasEndDatePassed && !session.isSubmitted) {
      return (
        <Button
          onClick={() => handleSubmit(session._id)}
          className="w-full mt-3"
          variant="destructive"
          size="sm"
        >
          Submit (Time Up)
        </Button>
      );
    }

    return (
      <Button size="sm" className="w-full mt-3" asChild>
        <Link href={`./my-tests/${session._id}`}>Continue</Link>
      </Button>
    );
  };

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">My Test Sessions</h2>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
        </div>
      )}

      {!loading && testSessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
          <p className="text-lg text-gray-500 mb-4">No test sessions found</p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {testSessions.map((session) => {
          const { attempted, total } = getProgress(session);
          const correctPercentage = Math.round(
            session?.result?.percentage || 0
          );
          return (
            <Card
              key={session._id}
              className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-border p-0"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-base line-clamp-1">
                      {session.questionSetId?.name || "Test Session"}
                    </h3>
                    <Badge
                      variant={session.isExam ? "default" : "outline"}
                      className="text-xs"
                    >
                      {session.isExam ? "Exam" : "Practice"}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                    {session.questionSetId?.categoryId?.courseId?.name || "N/A"}
                  </p>

                  {session.startDate && (
                    <p className="text-xs text-muted-foreground">
                      Started
                      {formatDistanceToNow(new Date(session.startDate), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>

                <CardContent className="p-2 pt-2 flex-grow">
                  <div className="flex flex-col gap-4 justify-between h-full">
                    <div className="flex items-center gap-4">
                      {session.isSubmitted && (
                        <div className="w-10 h-10 relative">
                          <svg
                            className="w-full h-full transform -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <circle
                              className="text-gray-300"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              r="16"
                              cx="18"
                              cy="18"
                            />
                            <circle
                              className="text-blue-500"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              r="16"
                              cx="18"
                              cy="18"
                              strokeDasharray="100"
                              strokeDashoffset={100 - correctPercentage}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold text-gray-700">
                            {correctPercentage}%
                          </div>
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{session.duration / 60} min</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ListChecks className="h-3 w-3" />
                          <span>
                            {session.isSubmitted && session.result
                              ? `Score: ${session.result.correct}/${session.result.totalQuestions}`
                              : `Progress: ${attempted}/${total}`}
                          </span>
                        </div>

                        {session.isSubmitted && session.result && (
                          <p className="text-xs mt-1">
                            <span
                              className={`font-medium ${
                                session.result.percentage >= 70
                                  ? "text-green-600 dark:text-green-400"
                                  : session.result.percentage >= 50
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {correctPercentage}%
                            </span>
                            <span className="text-muted-foreground ml-1">
                              accuracy
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    {getActionButton(session)}
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
