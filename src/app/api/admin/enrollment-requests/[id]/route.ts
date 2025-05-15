import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import EnrollmentModel from "@/models/enrollment.model";
import EnrollmentRequestModel, {
  EnrollmentRequestStatus,
} from "@/models/enrollmentRequest.model";
import { UserRole } from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;
  if (!user || user.userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { success: false, message: "UnauthorizedF" },
      {
        status: 401,
      }
    );
  }

  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment request doesnot exists! ",
        },
        {
          status: 400,
        }
      );
    }

    const existingEnrollmentRequest = await EnrollmentRequestModel.findById(id);
    if (!existingEnrollmentRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment request doesnot exists! ",
        },
        {
          status: 400,
        }
      );
    }

    const { status, reason } = await request.json();

    if (status) existingEnrollmentRequest.status = status;
    if (reason) existingEnrollmentRequest.reason = reason;

    await existingEnrollmentRequest.save();

    if (existingEnrollmentRequest.status == EnrollmentRequestStatus.APPROVED) {
      const enrollment = await EnrollmentModel.create({
        course: existingEnrollmentRequest.course,
        user: existingEnrollmentRequest.user,
        enrolledAt: Date.now(),
      });
      if (!enrollment) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create enrollment!",
          },
          {
            status: 500,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Enrollment request updated successfully",
        data: existingEnrollmentRequest,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error update enrollment request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enrollment requet" },
      {
        status: 500,
      }
    );
  }
}
