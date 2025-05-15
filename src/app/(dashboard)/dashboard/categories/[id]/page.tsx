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

export default function CategoryInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id: categoryId } = params;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handlePractice = (id: string) => {
    console.log("Practice for:", id);
  };

  return (
    <section className="p-6">
      <Button className="items-center justify-center flex">
        <Link
          className="gap-2 flex items-center justify-center"
          href={`/admin/dashboard/courses/${category?.courseId}`}
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

            <div className="grid grid-cols-3 gap-6 p-6">
              {category?.questionSets?.map((questionSet, id) => {
                return (
                  <Card
                    className="w-full max-w-sm rounded-2xl shadow-md"
                    key={id}
                  >
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          {questionSet.name}
                        </h2>
                      </div>
                      <p>Duration: {questionSet.duration / 60} minutes</p>
                      <p>Questions: {questionSet.questionIds.length}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button onClick={() => handlePractice(questionSet._id)}>
                        Practice
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
    </section>
  );
}
