"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import QuestionManagement from "@/components/dashboard/QuestionManagement";
import QuestionPage from "@/components/dashboard/QuestionPage";
import { QuestionSet } from "@/types/questionSet";
import { ApiResponse } from "@/types/ApiResponse";
import { UserRole } from "@/types/UserTypes";
import Loader from "@/components/shared/Loader";

export default function QuestionSetInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { questionSetId } = useParams();

  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.userRole !== UserRole.ADMIN) {
      router.push("/signin");
      return;
    }

    const fetchQuestionSet = async () => {
      try {
        const res = await axios.get<ApiResponse<QuestionSet>>(
          `/api/admin/questionsets/${questionSetId}`
        );

        if (res.data.success && res.data.data) {
          setQuestionSet(res.data.data);
        } else {
          console.error(res.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch question set:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionSet();
  }, [status, session, questionSetId, router]);

  return (
    <main>
      <QuestionManagement questionSetId={questionSetId as string} />
      {loading && (
        <div className="flex items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg mx-10">
          <Loader />
        </div>
      )}
      {!loading && questionSet && (
        <>
          <QuestionPage questionSet={JSON.stringify(questionSet)} />
        </>
      )}
    </main>
  );
}
