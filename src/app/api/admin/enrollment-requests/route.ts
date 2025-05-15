import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import { UserRole } from "@/models/user.model";
import EnrollmentRequestModel, {
  EnrollmentRequestStatus,
} from "@/models/enrollmentRequest.model";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import CourseModel from "@/models/course.model";

interface queryType {
  course?: string;
  user?: string;
  status?: EnrollmentRequestStatus;
}

export const GET = async (request: Request) => {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;

  if (!user || user.userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId") || undefined;
    const courseId = searchParams.get("courseId") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build dynamic query obect
    const query: queryType = {};
    if (courseId && courseId !== "all") query.course = courseId;
    if (userId && userId !== "all") query.user = userId;
    if (status && status !== "all")
      query.status = status as EnrollmentRequestStatus;

    if (courseId) {
      const existingCourse = await CourseModel.findById(courseId);
      if (!existingCourse) {
        return NextResponse.json(
          {
            success: true,
            message: "Enrollment requets fetched successfully!",
            data: [],
            pagination: { page, limit, total: 0 },
          },
          { status: 200 }
        );
      }
    }

    const enrollmentRequests = await EnrollmentRequestModel.find(query)
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email profilePicture")
      .populate("course", "name description");

    const total = await EnrollmentRequestModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message: "Enrollment requets fetched successfully!",
        data: enrollmentRequests,
        pagination: { page, limit, total },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enrollment requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enrollment requests!" },
      { status: 500 }
    );
  }
};
