import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TestSessionModel from "@/models/testSession.model";
import { PopulatedTestSession } from "@/types/ApiTypes";
import { ApiResponse } from "@/types/ApiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user = session?.user as { _id: string } | null;

  if (!user || !user._id) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized", data: null },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid test session ID", data: null },
        { status: 400 }
      );
    }

    const testSession = await TestSessionModel.findById(id)
      .populate({
        path: "userId",
        select: "_id",
      })
      .populate({
        path: "questionSetId",
        select: "_id name",
      })
      .populate({
        path: "responses.questionId",
        select: "_id body answers correctAnswer createdAt updatedAt",
      })
      .lean<PopulatedTestSession>();

    if (!testSession) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Test session not found", data: null },
        { status: 404 }
      );
    }

    // Verify user ownership
    if (testSession.userId._id.toString() !== user._id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "Forbidden: You do not own this test session",
          data: null,
        },
        { status: 403 }
      );
    }

    // Transform the data to match frontend expectations
    const transformedSession = {
      _id: testSession._id.toString(),
      userId: testSession.userId._id.toString(),
      questionSetId: {
        _id: testSession.questionSetId._id.toString(),
        name: testSession.questionSetId.name,
      },
      responses: testSession.responses.map((response) => ({
        questionId: response.questionId._id.toString(),
        question: {
          _id: response.questionId._id.toString(),
          body: response.questionId.body,
          answers: response.questionId.answers,
          correctAnswer: response.questionId.correctAnswer,
        },
        markedForLater: response.markedForLater,
        selectedAnswer:
          response.selectedAnswer !== -1 ? response.selectedAnswer : null,
        isAttempted: response.isAttempted,
      })),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Test session retrieved successfully",
        data: transformedSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching test session:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}
