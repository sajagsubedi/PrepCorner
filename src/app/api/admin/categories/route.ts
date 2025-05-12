import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import CategoryModel from "@/models/category.model";
import CourseModel from "@/models/course.model";
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
    const categories = await CategoryModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: categories,
        message: "Categories fetched successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
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
    const description = formData.get("description") as string;
    const courseId = formData.get("courseId") as string;

    if (
      [name, description, courseId].some(
        (field) => field == null || field.trim() === ""
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, and courseId are required",
        },
        {
          status: 400,
        }
      );
    }

    const existingCourse = await CourseModel.findById(courseId);

    if (!existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Course doesn't exists! ",
        },
        {
          status: 400,
        }
      );
    }

    const newCategory = new CategoryModel({
      name,
      description,
      courseId,
    });

    await newCategory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      {
        status: 500,
      }
    );
  }
}
