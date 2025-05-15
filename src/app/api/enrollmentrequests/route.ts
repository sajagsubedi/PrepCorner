import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import CourseModel from "@/models/course.model";
import EnrollmentRequestModel, {
  EnrollmentRequestStatus,
} from "@/models/enrollmentRequest.model";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: Request) => {
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
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const enrollmentRequests = await EnrollmentRequestModel.find({
      user: user._id,
    })
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email profilePicture")
      .populate("course", "name _id description");

    const total = await EnrollmentRequestModel.countDocuments({
      user: user._id,
    });

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

export async function POST(request: NextRequest) {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthenticated!" },
      {
        status: 401,
      }
    );
  }

  try {
    const { courseId } = await request.json();
    if ([courseId].some((field) => field == null || field.trim() === "")) {
      return NextResponse.json(
        {
          success: false,
          message: "CourseId is required! ",
        },
        {
          status: 400,
        }
      );
    }

    const existingCourse = await CourseModel.findById(courseId);

    if (!existingCourse || !existingCourse.isVisible) {
      return NextResponse.json(
        {
          success: false,
          message: "Course doesn't exists! ",
        },
        {
          status: 400,
        }
      );
    }

    const existingRequest = await EnrollmentRequestModel.findOne({
      user: user._id,
      course: courseId,
      status: {
        $in: [
          EnrollmentRequestStatus.PENDING,
          EnrollmentRequestStatus.APPROVED,
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already requested this course!",
        },
        {
          status: 400,
        }
      );
    }

    //create request
    const newRequest = await EnrollmentRequestModel.create({
      user: user._id,
      course: courseId,
      status: EnrollmentRequestStatus.PENDING,
      requestedAt: Date.now(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Requested for the course",
        data: newRequest,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      {
        status: 500,
      }
    );
  }
}
