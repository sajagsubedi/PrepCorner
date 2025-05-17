import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import TestSessionModel from "@/models/testSession.model";
import mongoose from "mongoose";
import "@/models/question.model";
import "@/models/course.model";
import { PopulatedTestSession } from "@/types/ApiTypes";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid test session ID" },
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
        select: "_id body answers",
      })
      .lean<PopulatedTestSession>();

    if (!testSession) {
      return NextResponse.json(
        { error: "Test session not found" },
        { status: 404 }
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
        },
        markedForLater: response.markedForLater,
        selectedAnswer:
          response.selectedAnswer !== -1 ? response.selectedAnswer : null,
        isAttempted: response.isAttempted,
      })),
      isSubmitted: testSession.isSubmitted,
      duration: testSession.duration,
      isExam: testSession.isExam,
      startDate: testSession.startDate?.toISOString(),
      endDate: testSession.endDate?.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Test session fetched successfully",
        data: transformedSession,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching test session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
