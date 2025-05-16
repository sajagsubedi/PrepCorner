import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import EnrollmentModel from "@/models/enrollment.model";
import QuestionSetModel from "@/models/questionSet.model";
import TestSessionModel, { IQuestion } from "@/models/testSession.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

interface TestSessionInput {
  userId: mongoose.Types.ObjectId;
  questionSetId: mongoose.Types.ObjectId;
  responses: Array<IQuestion>;
  isSubmitted: boolean;
  isExam: boolean;
  duration: number;
  startDate?: Date;
  endDate?: Date;
}

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
    const testSessions = await TestSessionModel.find({ userId: user._id })
      .populate({
        path: "questionSetId",
        select: "name categoryId",
        populate: {
          path: "categoryId",
          select: "name courseId",
          populate: {
            path: "courseId",
            select: "name",
          },
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: testSessions,
    });
  } catch (error) {
    console.error("Error fetching test sessions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch test sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { questionSetId, isExam, duration } = await request.json();

    if (!questionSetId || typeof isExam === "undefined") {
      return NextResponse.json(
        {
          success: false,
          message: "Provide questionSetId and isExam!",
        },
        { status: 400 }
      );
    }

    const questionSet = await QuestionSetModel.findById(questionSetId).populate(
      "categoryId",
      "_id courseId"
    );

    if (!questionSet) {
      return NextResponse.json(
        { success: false, message: "Question Set not found!" },
        { status: 404 }
      );
    }

    const category = questionSet.categoryId as unknown as {
      _id: mongoose.Types.ObjectId;
      courseId: mongoose.Types.ObjectId;
    };

    const enrollment = await EnrollmentModel.findOne({
      user: userId,
      course: category.courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "You are not enrolled in this course!" },
        { status: 403 }
      );
    }

    const now = new Date();
    const responses = questionSet.questionIds.map(
      (qid: mongoose.Types.ObjectId) => ({
        questionId: qid,
        markedForLater: false,
        selectedAnswer: -1,
        isAttempted: false,
      })
    );

    // Validate duration
    const testDuration = isExam
      ? Number(duration) || questionSet.duration || 60 // Fallback to 60 minutes if undefined
      : 0;

    if (isExam && testDuration <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid duration for exam mode!",
        },
        { status: 400 }
      );
    }

    const testSessionData: TestSessionInput = {
      userId,
      questionSetId,
      responses,
      isSubmitted: false,
      isExam,
      duration: testDuration,
    };

    if (isExam) {
      testSessionData.startDate = now;
      // Calculate endDate by adding duration (in minutes) to now
      testSessionData.endDate = new Date(
        now.getTime() + testDuration * 60 * 1000
      );
    }

    const testSession = new TestSessionModel(testSessionData);
    await testSession.save();

    return NextResponse.json({
      success: true,
      message: "Test session created successfully",
      data: {
        _id: testSession._id,
        isExam: testSession.isExam,
        duration: testSession.duration,
        startDate: testSession.startDate,
        endDate: testSession.endDate,
      },
    });
  } catch (error) {
    console.error("Error creating test session:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create test session" },
      { status: 500 }
    );
  }
}
