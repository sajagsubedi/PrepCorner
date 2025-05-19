import QuestionManagement from "@/components/dashboard/QuestionManagement";
import QuestionPage from "@/components/dashboard/QuestionPage";
import { QuestionSet } from "@/types/questionSet";
import { UserRole } from "@/types/UserTypes";
import { redirect } from "next/navigation";
import connectDb from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import QuestionSetModel from "@/models/questionSet.model";

async function fetchQuestionSet(
  questionSetId: string
): Promise<QuestionSet | undefined> {
  try {
    await connectDb();
    if (!mongoose.Types.ObjectId.isValid(questionSetId)) {
      return undefined;
    }

    const [questionSet] = await QuestionSetModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(questionSetId),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "questionIds",
          foreignField: "_id",
          as: "questions",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          duration: 1,
          categoryId: { $toString: "$categoryId" },
          questionIds: {
            $map: {
              input: "$questionIds",
              as: "id",
              in: { $toString: "$$id" },
            },  
          },
          questions: {
            $map: {
              input: "$questions",
              as: "question",
              in: {
                _id: { $toString: "$$question._id" },
                body: "$$question.body",
                answers: "$$question.answers",
                correctAnswer: "$$question.correctAnswer",
                createdAt: "$$question.createdAt",
                updatedAt: "$$question.updatedAt",
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return questionSet;
  } catch (err) {
    console.log("Error is: ", err);
    return undefined;
  }
}

export default async function QuestionSetInfoPage({
  params,
}: {
  params: Promise<{ questionSetId: string }>;
}) {
  const { questionSetId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.userRole !== UserRole.ADMIN) {
    redirect("/signin");
  }
  const questionSet = await fetchQuestionSet(questionSetId);

  if (!questionSet) {
    redirect("../");
  }
  return (
    <main>
      <QuestionManagement questionSetId={questionSetId as string} />
      <QuestionPage questionSet={JSON.stringify(questionSet)} />
    </main>
  );
}
