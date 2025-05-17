import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import TestResultModel from "@/models/testResult.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;

  if (!user || !user._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid test session ID" },
        { status: 400 }
      );
    }

    const testSessionResult = await TestResultModel.findOne({
      testSessionId: id,
    });

    console.log(testSessionResult);

    return NextResponse.json({
      success: true,
      message: "Test submitted and result calculated",
      data: testSessionResult,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
