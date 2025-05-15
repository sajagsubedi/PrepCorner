import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import EnrollmentRequestModel, {
  EnrollmentRequestStatus,
} from "@/models/enrollmentRequest.model";
import { UserRole } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user || user.userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const [total, pending, approved, rejected] = await Promise.all([
      EnrollmentRequestModel.countDocuments(),
      EnrollmentRequestModel.countDocuments({
        status: EnrollmentRequestStatus.PENDING,
      }),
      EnrollmentRequestModel.countDocuments({
        status: EnrollmentRequestStatus.APPROVED,
      }),
      EnrollmentRequestModel.countDocuments({
        status: EnrollmentRequestStatus.REJECTED,
      }),
    ]);

    const statistics = {
      total,
      pending,
      approved,
      rejected,
    };

    return NextResponse.json(
      {
        success: true,
        data: statistics,
        message: "Statistics fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
