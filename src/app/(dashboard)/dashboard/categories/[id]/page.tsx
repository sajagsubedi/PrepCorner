"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { ApiResponse } from "@/types/ApiResponse";
import { Category } from "@/types/category";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Loader from "@/components/shared/Loader";
import { toast } from "react-toastify";
import PracticeDialog from "@/components/shared/PracticeDialog";
import { TestSession } from "@/models/testSession.model";

export default function CategoryInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id: categoryId } = params;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestionSetId, setSelectedQuestionSetId] =
    useState<string>("");
  const [selectedQuestionSetDuration, setSelectedQuestionSetDuration] =
    useState<number>(0);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const fetchCategory = async () => {
      try {
        const res = await axios.get<ApiResponse<Category>>(
          `/api/categories/${categoryId}`
        );

        if (res.data.success && res.data.data) {
          setCategory(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<undefined>>;
        const errorMessage =
          axiosError.response?.data?.message || "Failed to request access.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [status, session, categoryId, router]);

  const handlePracticeClick = (id: string, duration: number) => {
    setSelectedQuestionSetId(id);
    setSelectedQuestionSetDuration(duration);
    console.log(duration);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmitPractice = async (isExam: boolean, duration: number) => {
    try {
      const response = await axios.post<ApiResponse<TestSession>>(
        `/api/mocktests`,
        {
          questionSetId: selectedQuestionSetId,
          isExam,
          duration: isExam ? duration * 60 : selectedQuestionSetDuration,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        if (response.data.data) {
          router.push(`../my-tests/${response.data.data._id}`);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      toast.error(
        axiosError.response?.data?.message || "Failed to create test."
      );
    }
  };

  return (
    <section className="p-6">
      <Button className="items-center justify-center flex mb-5">
        <Link
          className="gap-2 flex items-center justify-center"
          href={`/dashboard/my-courses/${category?.courseId}`}
        >
          <ArrowLeft /> Back
        </Link>
      </Button>
      <h2 className="text-3xl font-bold text-primary mb-6 uppercase">
        Category Details
      </h2>
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <Loader />
        </div>
      )}

      {!loading && !category && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">Category not found!</p>
        </div>
      )}

      {category && (
        <Card className="shadow-md py-10">
          <CardContent>
            <CardHeader>
              <h3 className="text-3xl font-semibold text-primary">
                {category.name}
              </h3>
            </CardHeader>
            <div className="w-full flex flex-col gap-3">
              <p className="text-muted-foreground text-base px-7">
                {category.description}
              </p>
            </div>
          </CardContent>

          <div className="px-10">
            <h1 className="text-2xl font-bold text-primary mt-3">
              Question Sets
            </h1>
            {category.questionSets && category.questionSets?.length > 0 && (
              <p className="text-lg text-gray-500 mb-4">
                {category.questionSets?.length} question sets found
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {category?.questionSets?.map((questionSet, id) => {
                return (
                  <Card
                    className="w-full rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    key={id}
                  >
                    <CardContent className="space-y-2 pt-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          {questionSet.name}
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Duration: {questionSet.duration / 60} minutes
                      </p>
                      <p className="text-muted-foreground">
                        Questions: {questionSet.questionIds.length}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between pb-6">
                      <Button
                        onClick={() =>
                          handlePracticeClick(
                            questionSet._id,
                            questionSet.duration
                          )
                        }
                        className="w-full"
                      >
                        Start Practice
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            {category?.questionSets?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-lg text-gray-500 mb-4">
                  No question sets found
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
      {dialogOpen && (
        <PracticeDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmitPractice}
          defaultDuration={selectedQuestionSetDuration}
        />
      )}
    </section>
  );
}
