import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import QuestionSetModel from "@/models/questionSet.model";
import CategoryModel from "@/models/category.model";
import { UserRole } from "@/models/user.model";
import { getServerSession, User } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
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
    const questionSets = await QuestionSetModel.find({}).sort({
      createdAt: -1,
    });
    return NextResponse.json(
      {
        success: true,
        data: questionSets,
        message: "Question sets fetched successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching question sets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch question sets" },
      {
        status: 500,
      }
    );
  }
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
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;

    if (
      [name, categoryId].some((field) => field == null || field.trim() === "")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and categoryId are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingCategory = await CategoryModel.findById(categoryId);

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category doesn't exist!",
        },
        {
          status: 400,
        }
      );
    }

    const newQuestionSet = new QuestionSetModel({
      name,
      categoryId,
      duration: 3 * 60 * 60,
    });

    await newQuestionSet.save();

    return NextResponse.json(
      {
        success: true,
        message: "Question set created successfully",
        data: newQuestionSet,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating question set:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create question set" },
      {
        status: 500,
      }
    );
  }
}
