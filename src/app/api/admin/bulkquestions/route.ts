import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import imagekit from "@/lib/imagekit";
import QuestionModel from "@/models/question.model";
import QuestionSetModel from "@/models/questionSet.model";
import { UserRole } from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

interface QuestionInput {
  body: string;
  answers: Array<{
    answer: string;
  }>;
  correctAnswer: number;
}

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const questions = formData.get("questions") as string;
    const images = formData.getAll("images") as File[] | null;
    const questionSetId = formData.get("questionSetId") as string;

    const existingQuestionSet = await QuestionSetModel.findById(questionSetId);

    if (!existingQuestionSet) {
      return NextResponse.json(
        {
          success: false,
          message: "Question set doesn't exist!",
        },
        {
          status: 400,
        }
      );
    }
    let uploadedImgG: Array<{ url: string; name: string }> = [];
    if (images) {
      const imgObject = images.map(async (img) => {
        console.log(img);
        const bytes = await img.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedImg = await imagekit.upload({
          file: buffer,
          fileName: `${img.name}`,
          folder: "/prepcorner",
        });
        return {
          url: uploadedImg.url,
          name: img.name,
        };
      });
      uploadedImgG = await Promise.all(imgObject);
    }

    const newContent = questions.replace(/[\w-]+\.png/g, (match) => {
      const image = uploadedImgG.find((val) => val.name === match);
      return image ? image.url : match;
    });

    const questionArray = JSON.parse(newContent);

    const updatedQuestionArray = questionArray
      .map((val: QuestionInput) => {
        if (!val.body) {
          return null;
        }

        if (!val.correctAnswer || val.correctAnswer > val.answers.length) {
          return null;
        }
        const arr = [...val.answers];
        if (arr.length < 4) {
          while (arr.length < 4) {
            const newOption = {
              answer: "<p>No option</p>",
            };
            arr.push(newOption);
          }
        }

        const newArr = arr.map(
          (ans: { answer: string }): { answer: string } => {
            if (ans.answer == "") {
              return {
                answer: "<p>No Option</p>",
              };
            }
            return ans;
          }
        );

        return {
          ...val,
          answers: newArr,
        };
      })
      .filter((val: QuestionInput | null) => val !== null);

    //upload question to db
    const uploadedQuestions = updatedQuestionArray
      .map(async (question: QuestionInput) => {
        const createdQuestion = await QuestionModel.create(question);
        if (!createdQuestion) {
          return null;
        }
        return createdQuestion._id as mongoose.Types.ObjectId;
      })
      .filter((val: string | null) => val != null);

    const uploadedQuestionIds = await Promise.all(uploadedQuestions);

    existingQuestionSet.questionIds = [
      ...existingQuestionSet.questionIds,
      ...uploadedQuestionIds,
    ];

    await existingQuestionSet.save();

    const [updatedQuestionSet] = await QuestionSetModel.aggregate([
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

    return NextResponse.json(
      {
        success: true,
        message: "Bulk Questions added successfully!",
        data: updatedQuestionSet,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add questions" },
      {
        status: 500,
      }
    );
  }
}

//code to delete unused questions
export async function DELETE() {
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
    // Step 1: Get all used question IDs from all question sets
    const usedQuestionIds = await QuestionSetModel.distinct("questionIds");
    const result = await QuestionModel.deleteMany({
      _id: { $nin: usedQuestionIds },
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(err);
  }
}
