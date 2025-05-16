import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Course } from "@/types/course";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CourseModel from "@/models/course.model";
import mongoose from "mongoose";
import connectDb from "@/lib/connectDb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import EnrollmentModel from "@/models/enrollment.model";
import { Category } from "@/types/category";

async function fetchCourse(
  courseId: string,
  userId: string
): Promise<Course | undefined> {
  if (!mongoose.isValidObjectId(new mongoose.Types.ObjectId(courseId))) {
    return undefined;
  }

  await connectDb();
  const enrollment = await EnrollmentModel.findOne({
    course: new mongoose.Types.ObjectId(courseId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!enrollment) {
    return undefined;
  }

  const [course] = await CourseModel.aggregate([
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
  return course;
}

export default async function CourseInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/signin");
  }

  const course = await fetchCourse(id, user._id);

  return (
    <section className="p-6">
      <Button className="items-center justify-center flex mb-5">
        <Link
          className="gap-2 flex items-center justify-center"
          href={`../my-courses`}
        >
          <ArrowLeft /> Back
        </Link>
      </Button>
      <h2 className="text-3xl font-bold text-primary mb-6 uppercase ml-5">
        Course Details
      </h2>

      {!course && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">Course not found!</p>
        </div>
      )}
      {course && (
        <Card className="shadow-md">
          <CardContent>
            <CardHeader>
              <h3 className="text-3xl font-semibold text-primary">
                {course.name}
              </h3>
            </CardHeader>
            <div className="w-full flex flex-col gap-3 px-6">
              <p className="text-muted-foreground text-base">
                {course.description}
              </p>
            </div>
          </CardContent>
          <div className="mx-auto px-7 sm:px-10 bg-transparent w-full">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-primary">Categories</h1>
            </div>

            {course.categories && course?.categories?.length > 0 && (
              <p className="text-lg text-gray-500 mb-4">
                {course?.categories?.length} categories found
              </p>
            )}

            <div className="grid grid-cols-3 gap-6">
              {course.categories?.map((category: Category, id: number) => (
                <Card
                  className="w-full max-w-sm rounded-2xl shadow-md"
                  key={id}
                >
                  <CardContent className="space-y-2">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {category.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline">
                      <Link
                        href={`../categories/${category._id}`}
                        className="flex gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {(!course.categories || course.categories.length == 0) && (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-lg text-gray-500 mb-4">
                  No categories found
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </section>
  );
}
