"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import { formatDistanceToNow, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, ListChecks, CalendarClock } from "lucide-react";
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
    return `${attempted}/${total}`;
  };

  const handleSubmit = async (testId: string) => {
    try {
      const response = await axios.post<ApiResponse<undefined>>(
        `/api/mocktests/${testId}/submit`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push(`/my-tests/${testId}/result`);
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
        <Button className="flex justify-center items-center w-full mt-4 bg-gray-700 hover:bg-gray-800">
          <Link
            href={`./my-tests/${session._id}/result`}
            className="w-full h-full flex justify-center items-center"
          >
            View Result
          </Link>
        </Button>
      );
    }

    if (!session.isExam) {
      return (
        <Button className="flex justify-center items-center w-full mt-4">
          <Link
            href={`./my-tests/${session._id}`}
            className="w-full h-full flex justify-center items-center"
          >
            Continue
          </Link>
        </Button>
      );
    }

    if (session.isExam && hasEndDatePassed && !session.isSubmitted) {
      return (
        <Button
          onClick={() => handleSubmit(session._id)}
          className="w-full mt-4"
          variant="destructive"
        >
          Submit (Time Up)
        </Button>
      );
    }

    return (
      <Button className="flex justify-center items-center w-full mt-4">
        <Link
          href={`./my-tests/${session._id}`}
          className="w-full h-full flex justify-center items-center"
        >
          Continue
        </Link>
      </Button>
    );
  };

  const getEndTime = (session: TestSession) => {
    if (!session.endDate) return "N/A";
    const endDate = new Date(session.endDate);
    return isNaN(endDate.getTime())
      ? "N/A"
      : format(endDate, "MMM d, yyyy, h:mm a");
  };

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">My Test Sessions</h2>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
        </div>
      )}

      {!loading && testSessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No test sessions found</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testSessions.map((session) => (
          <Card
            key={session._id}
            className="hover:shadow-lg transition-shadow duration-300 relative gap-3 justify-between"
          >
            <Badge
              variant={session.isExam ? "default" : "outline"}
              className="absolute top-3 right-3 z-10"
            >
              {session.isExam ? "Exam" : "Practice"}
            </Badge>

            <CardHeader className="py-0 my-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {session.questionSetId?.name || "Test Session"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Category:
                {session.questionSetId?.categoryId?.name || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                Course:
                {session.questionSetId?.categoryId?.courseId?.name || "N/A"}
              </p>
              {session.startDate && (
                <p className="text-sm text-muted-foreground">
                  Started {formatDistanceToNow(new Date(session.startDate))} ago
                </p>
              )}
            </CardHeader>
            <CardContent className="py-0 my-0">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {session.duration / 60} minutes</span>
                </div>

                {/* Only show end time for Exam mode */}
                {session.isExam && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarClock className="h-4 w-4" />
                    <span>End Time: {getEndTime(session)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <ListChecks className="h-4 w-4" />
                  <span>Progress: {getProgress(session)} questions</span>
                </div>

                {/* Showing only completion status badge if submitted */}
                {session.isSubmitted && (
                  <Badge variant="secondary" className="mt-2">
                    Completed
                  </Badge>
                )}

                {getActionButton(session)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
