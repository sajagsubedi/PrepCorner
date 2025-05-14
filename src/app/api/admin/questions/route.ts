import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import QuestionModel from "@/models/question.model";
import { UserRole } from "@/types/UserTypes";
import mongoose from "mongoose";
import imagekit from "@/lib/imagekit";
import { User } from "next-auth";
import QuestionSetModel from "@/models/questionSet.model";

export async function POST(request: NextRequest) {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;
  if (!user || user.userRole !== UserRole.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const images = formData.getAll("images") as File[];
    const body = formData.get("body") as string;
    const questionSetId = formData.get("questionSetId") as string;
    const correctAnswer = parseInt(formData.get("correctAnswer") as string, 10);
    const answers = formData.getAll("answers") as string[];

    // Validate questionSetId
    const existingQuestionSet = await QuestionSetModel.findById(questionSetId);
    if (!existingQuestionSet) {
      return NextResponse.json(
        { success: false, message: "Question set doesn't exist!" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Question body is required" },
        { status: 400 }
      );
    }
    if (
      isNaN(correctAnswer) ||
      correctAnswer < 0 ||
      correctAnswer >= answers.length
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid correct answer index" },
        { status: 400 }
      );
    }
    if (answers.length !== 4) {
      return NextResponse.json(
        { success: false, message: "Exactly four answers are required" },
        { status: 400 }
      );
    }

    // Prepare question data
    const formattedAnswers = answers.map((answer) => ({
      answer: answer || "<p>No Option</p>",
    }));

    // Upload images to ImageKit
    let uploadedImages: Array<{ url: string; name: string }> = [];

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (img) => {
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
      uploadedImages = await Promise.all(uploadPromises);
    }

    let newQuestion = {
      body,
      answers: formattedAnswers,
      correctAnswer,
    };
    let newQuestionString = JSON.stringify(newQuestion);

    newQuestionString = newQuestionString.replace(/[\w-]+\.png/g, (match) => {
      const image = uploadedImages.find(
        (val: { name: string; url: string }) => val.name === match
      );
      return image ? image.url : match;
    });

    newQuestion = JSON.parse(newQuestionString);

    // Save question to database
    const createdQuestion = await QuestionModel.create(newQuestion);
    if (!createdQuestion) {
      return NextResponse.json(
        { success: false, message: "Failed to create question" },
        { status: 500 }
      );
    }

    // Update QuestionSet with new question ID
    existingQuestionSet.questionIds.push(
      createdQuestion._id as mongoose.Types.ObjectId
    );
    await existingQuestionSet.save();

    console.log(existingQuestionSet);

    return NextResponse.json(
      {
        success: true,
        message: "Question added successfully!",
        data: createdQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add question" },
      { status: 500 }
    );
  }
}
