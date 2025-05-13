import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { UserRole } from "@/models/user.model";
import { redirect } from "next/navigation";
import { Course } from "@/types/course";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CourseModel from "@/models/course.model";
import mongoose from "mongoose";
import connectDb from "@/lib/connectDb";
import Image from "next/image";
import { format } from "date-fns";
import CategoryPage from "@/components/dashboard/CategorySection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function fetchCourses(courseId: string): Promise<Course | undefined> {
  if (!mongoose.isValidObjectId(courseId)) {
    return undefined;
  }

  await connectDb();
  const course = await CourseModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "courseId",
        as: "categories",
      },
    },
  ]);
  console.log(course);
  return course[0];
}

export default async function CourseInfoPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.userRole !== UserRole.ADMIN) {
    redirect("/signin");
  }

  const course = await fetchCourses(courseId);

  return (
    <section className="p-6">
      <Button className="items-center justify-center flex">
        <Link
          className="gap-2 flex items-center justify-center"
          href={`/admin/dashboard/courses`}
        >
          <ArrowLeft /> Back
        </Link>
      </Button>
      <h2 className="text-3xl font-bold text-primary mb-6 uppercase">
        Course Details
      </h2>

      {!course && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">Course not found!</p>
        </div>
      )}
      {course && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <CardHeader>
              <h3 className="text-3xl font-semibold text-primary">
                {course.name}
              </h3>
              <div className="h-48 w-full rounded overflow-hidden">
                <Image
                  src={course.image.url}
                  alt={course.name}
                  width={400}
                  height={200}
                />
              </div>
            </CardHeader>
            <div className="w-full flex flex-col gap-3">
              <p className="text-muted-foreground text-base">
                {course.description}
              </p>

              <div className="text-sm text-muted-foreground mt-2">
                <p>Created At: {format(new Date(course.createdAt), "PPPpp")}</p>
                <p>Updated At: {format(new Date(course.updatedAt), "PPPpp")}</p>
              </div>
            </div>
          </CardContent>
          <CategoryPage
            categories={JSON.stringify(course?.categories)}
            courseId={courseId}
          />
        </Card>
      )}
    </section>
  );
}
