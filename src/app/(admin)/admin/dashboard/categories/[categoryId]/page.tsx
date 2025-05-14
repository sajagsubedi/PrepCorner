"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ApiResponse } from "@/types/ApiResponse";
import { Category } from "@/types/category";
import { UserRole } from "@/types/UserTypes";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import QuestionSetPage from "@/components/dashboard/QuestionSetPage";

export default function CategoryInfoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { categoryId } = params;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.userRole !== UserRole.ADMIN) {
      router.push("/signin");
      return;
    }

    const fetchCategory = async () => {
      try {
        const res = await axios.get<ApiResponse<Category>>(
          `/api/admin/categories/${categoryId}`
        );

        if (res.data.success && res.data.data) {
          setCategory(res.data.data);
        } else {
          console.error("Fetch error:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [status, session, categoryId, router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

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

      {!category && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">Category not found!</p>
        </div>
      )}

      {category && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <CardHeader>
              <h3 className="text-3xl font-semibold text-primary">
                {category.name}
              </h3>
            </CardHeader>
            <div className="w-full flex flex-col gap-3">
              <p className="text-muted-foreground text-base">
                {category.description}
              </p>
            </div>
          </CardContent>
          <QuestionSetPage
            questionSets={JSON.stringify(category.questionSets)}
            categoryId={categoryId as string}
          />
        </Card>
      )}
    </section>
  );
}
