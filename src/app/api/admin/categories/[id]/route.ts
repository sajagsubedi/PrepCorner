import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import CategoryModel from "@/models/category.model";
import { UserRole } from "@/models/user.model";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
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

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const existingCategory = await CategoryModel.findById(id);

    if (!existingCategory) {
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

    if (name) existingCategory.name = name;
    if (description) existingCategory.description = description;

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: existingCategory,
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
