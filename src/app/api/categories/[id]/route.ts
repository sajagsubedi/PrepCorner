import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import CategoryModel from "@/models/category.model";
import EnrollmentModel from "@/models/enrollment.model";
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
  if (!user) {
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
          message: "Category doesn't exists! ",
        },
        {
          status: 400,
        }
      );
    }
    const categoryData = await CategoryModel.findById(id);
    if (!categoryData) {
      return NextResponse.json(
        {
          success: false,
          message: "Category doesn't exists! ",
        },
        {
          status: 400,
        }
      );
    }
    const enrollment = await EnrollmentModel.findOne({
      course: categoryData?.courseId,
      user: user._id,
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "Category doesn't exists! ",
        },
        {
          status: 400,
        }
      );
    }

    const [category] = await CategoryModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "questionsets",
          localField: "_id",
          foreignField: "categoryId",
          as: "questionSets",
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Category fetched successfully",
        data: category,
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
