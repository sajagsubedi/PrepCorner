import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import imagekit from "@/lib/imagekit";
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
    const courses = await CourseModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: courses,
        message: "Courses fetched successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses" },
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
    const isVisible = formData.get("isVisible") as string;
    const image = formData.get("image") as File | null;

    if (
      [name, description].some((field) => field == null || field.trim() === "")
    ) {
      return NextResponse.json(
        { success: false, message: "Name and description are required" },
        {
          status: 400,
        }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        {
          status: 400,
        }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadedImage = await imagekit.upload({
      file: buffer,
      fileName: `${name}--${Date.now()}`,
      folder: "/courses",
    });

    const newCourse = new CourseModel({
      name,
      description,
      image: {
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
      },
      isVisible: isVisible ? isVisible == "true" : true,
    });

    await newCourse.save();

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        data: newCourse,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create course" },
      {
        status: 500,
      }
    );
  }
}
