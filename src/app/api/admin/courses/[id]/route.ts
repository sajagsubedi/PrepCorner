import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import imagekit from "@/lib/imagekit";
import CourseModel from "@/models/course.model";
import { UserRole } from "@/models/user.model";
import { getServerSession, User } from "next-auth";
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
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    const { id } = await params;

    const existingCourse = await CourseModel.findById(id);

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, message: "Course does not exist!" },
        {
          status: 400,
        }
      );
    }

    if (image) {
      // Delete the old image from ImageKit
      if (existingCourse.image?.fileId) {
        await imagekit.deleteFile(existingCourse.image.fileId);
      }
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadedImage = await imagekit.upload({
        file: buffer,
        fileName: `${existingCourse.name}--${Date.now()}`,
        folder: "/courses",
      });

      existingCourse.image = {
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
      };
    }

    if (name) existingCourse.name = name;

    if (description) existingCourse.description = description;

    await existingCourse.save();

    return NextResponse.json(
      {
        success: true,
        message: "Course updated successfully",
        data: existingCourse,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update course" },
      {
        status: 500,
      }
    );
  }
}
