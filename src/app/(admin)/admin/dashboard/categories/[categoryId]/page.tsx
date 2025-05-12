import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { UserRole } from "@/models/user.model";
import { redirect } from "next/navigation";
import { Category } from "@/schemas/category";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CategoryModel from "@/models/category.model";
import mongoose from "mongoose";
import connectDb from "@/lib/connectDb";
import { format } from "date-fns";
import QuestionSetPage from "@/components/dashboard/QuestionSetPage";

async function fetchCategories(
  categoryId: string
): Promise<Category | undefined> {
  if (!mongoose.isValidObjectId(categoryId)) {
    return undefined;
  }

  await connectDb();
  const category = await CategoryModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(categoryId),
      },
    },
    {
      $lookup: {
        from: "questionSets",
        localField: "_id",
        foreignField: "categoryId",
        as: "questionSets",
      },
    },
  ]);
  console.log(category);
  return category[0];
}

export default async function CategoryInfoPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.userRole !== UserRole.ADMIN) {
    redirect("/signin");
  }

  const category = await fetchCategories(categoryId);

  return (
    <section className="p-6">
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
              {/* Image display removed as per updated requirements */}
            </CardHeader>
            <div className="w-full flex flex-col gap-3">
              <p className="text-muted-foreground text-base">
                {category.description}
              </p>

              <div className="text-sm text-muted-foreground mt-2">
                <p>
                  Created At: {format(new Date(category.createdAt), "PPPpp")}
                </p>
                <p>
                  Updated At: {format(new Date(category.updatedAt), "PPPpp")}
                </p>
              </div>
            </div>
          </CardContent>
          <QuestionSetPage
            questionSets={category.questionSets || []}
            categoryId={categoryId}
          />
        </Card>
      )}
    </section>
  );
}
