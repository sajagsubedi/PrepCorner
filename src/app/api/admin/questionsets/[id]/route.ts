import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import QuestionSetModel from "@/models/questionSet.model";
import { UserRole } from "@/models/user.model";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDb();
  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;
  if (!user || user.userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
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
          message: "Question Set doesn't exists! ",
        },
        {
          status: 400,
        }
      );
    }

    const [questionSet] = await QuestionSetModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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

    return NextResponse.json(
      {
        success: true,
        message: "Question Set fetched successfully",
        data: questionSet,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetching category" },
      {
        status: 500,
      }
    );
  }
}
