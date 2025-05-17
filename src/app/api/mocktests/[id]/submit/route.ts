import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDb";
import TestSessionModel from "@/models/testSession.model";
import QuestionModel, { Question } from "@/models/question.model";
import TestResultModel from "@/models/testResult.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
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

    // Find the test session
    const testSession = await TestSessionModel.findById(id);
    if (!testSession) {
      return NextResponse.json(
        { success: false, message: "Test session not found" },
        { status: 404 }
      );
    }

    // Auth check
    if (testSession.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (testSession.isSubmitted) {
      return NextResponse.json(
        { success: false, message: "Test already submitted" },
        { status: 400 }
      );
    }

    // Fetch actual questions from DB
    const questionIds = testSession.responses.map((r) => r.questionId);
    const questions = await QuestionModel.find({ _id: { $in: questionIds } });

    // Build a map for faster lookup
    const questionMap = new Map();
    questions.forEach((q: Question) => questionMap.set(String(q._id), q));

    let correct = 0;
    let attempted = 0;

    testSession.responses.forEach((response) => {
      const question = questionMap.get(response.questionId.toString());
      if (!question) return;

      if (response.isAttempted) {
        attempted++;
        if (response.selectedAnswer === question.correctAnswer) {
          correct++;
        }
      }
    });

    const totalQuestions = testSession.responses.length;
    const incorrect = attempted - correct;

    // Update session as submitted
    testSession.isSubmitted = true;
    await testSession.save();

    // Save result
    const testSessionResult = new TestResultModel({
      testSessionId: testSession._id,
      userId: testSession.userId,
      questionSetId: testSession.questionSetId,
      totalQuestions,
      attempted,
      correct,
      incorrect,
      submittedAt: new Date(),
    });

    await testSessionResult.save();

    return NextResponse.json({
      success: true,
      message: "Test submitted and result calculated",
      data: {
        correct,
        incorrect,
        attempted,
        totalQuestions,
      },
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
