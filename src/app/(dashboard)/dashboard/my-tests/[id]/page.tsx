import { redirect } from "next/navigation";
import { TestSession } from "@/types/testSession";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import TestSessionModel from "@/models/testSession.model";
import { PopulatedTestSession } from "@/types/ApiTypes";
import connectDb from "@/lib/connectDb";
import TestSessionPage from "@/components/dashboard/TestSessionPage";

async function fetchTestSession(
  testSessionId: string,
  userId: string
): Promise<TestSession | undefined> {
  try {
    await connectDb();
    if (!mongoose.Types.ObjectId.isValid(testSessionId)) {
      return undefined;
    }

    const testSession = await TestSessionModel.findById(testSessionId)
      .populate({
        path: "userId",
        select: "_id",
      })
      .populate({
        path: "questionSetId",
        select: "_id name categoryId",
      })
      .populate({
        path: "responses.questionId",
        select: "_id body answers createdAt updatedAt",
      })
      .lean<PopulatedTestSession>();

    if (!testSession) {
      return undefined;
    }

    // Verify user ownership
    if (testSession.userId._id.toString() !== userId) {
      return undefined;
    }

    // Transform the data to match frontend expectations
    const transformedSession = {
      _id: testSession._id.toString(),
      userId: testSession.userId._id.toString(),
      questionSetId: {
        _id: testSession.questionSetId._id.toString(),
        name: testSession.questionSetId.name,
        categoryId: testSession.questionSetId.categoryId,
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
      isExam: testSession.isExam,
      duration: testSession.duration,
      isSubmitted: testSession.isSubmitted,
      endDate: testSession.endDate,
      startDate: testSession.startDate,
    };
    return transformedSession as unknown as TestSession;
  } catch (err) {
    console.log("Error is: ", err);
    return undefined;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect("/signin");
  }
  const testSessionData = await fetchTestSession(id, user._id);

  if (!testSessionData) {
    redirect("../");
  }

  return <TestSessionPage testSessionProp={JSON.stringify(testSessionData)} />;
}
