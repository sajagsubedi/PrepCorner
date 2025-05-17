import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import TestSessionModel from "@/models/testSession.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { id } = await params;
    const { questionId, selectedAnswer, markedForLater } = await request.json();

    // Validate test session ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid test session ID", data: undefined },
        { status: 400 }
      );
    }

    // Validate question ID
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json(
        { success: false, message: "Invalid question ID", data: undefined },
        { status: 400 }
      );
    }

    // Check if test session exists and is not submitted
    const testSession = await TestSessionModel.findOne({ _id: id });
    if (!testSession) {
      return NextResponse.json(
        { success: false, message: "Test session not found" },
        { status: 404 }
      );
    }

    if (testSession.userId.toString() != user._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (testSession.isSubmitted) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot modify responses after submission",
          data: undefined,
        },
        { status: 400 }
      );
    }

    // Build update object for the specific response
    const update: Record<string, unknown> = {};
    if (selectedAnswer != undefined) {
      update["responses.$.selectedAnswer"] = selectedAnswer;
    }
    if (markedForLater !== undefined) {
      update["responses.$.markedForLater"] = markedForLater;
    }
    if (selectedAnswer !== undefined || markedForLater) {
      update["responses.$.isAttempted"] = true;
    }

    // Update the response where responses.questionId matches
    const updatedTestSession = await TestSessionModel.findOneAndUpdate(
      { _id: id, "responses.questionId": questionId },
      { $set: update },
      { new: true }
    );

    if (!updatedTestSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Response not found for the given question ID",
          data: undefined,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Response updated successfully",
    });
  } catch (error) {
    console.error("Error updating test session response:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        data: undefined,
      },
      { status: 500 }
    );
  }
}
