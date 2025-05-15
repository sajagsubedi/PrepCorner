import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import CourseModel from "@/models/course.model";
import EnrollmentModel from "@/models/enrollment.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();
  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const userId = new mongoose.Types.ObjectId(user._id);
    const enrollments = await EnrollmentModel.find({ user: userId });
    if (enrollments.length == 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          message: "Courses fetched successfully!",
        },
        {
          status: 200,
        }
      );
    }
    const coursedIds = enrollments.map((val) => val.course);
    const myCourses = await CourseModel.find({
      _id: { $in: coursedIds },
    });

    return NextResponse.json(
      {
        success: true,
        data: myCourses,
        message: "Courses fetched successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses" },
      {
        status: 500,
      }
    );
  }
}
