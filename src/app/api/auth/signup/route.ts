import UserModel from "@/models/user.model";
import connectDb from "@/lib/connectDb";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { type NextRequest, NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export const POST = async (request: NextRequest) => {
  console.log("FOr signup");
  // Connect to the database
  await connectDb();
  try {
    let newUser = null;

    const formData = await request.formData();

    // Get the fullName, username, password, email and profile picture from the formdata

    const fullName = formData.get("fullName") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const profilePicture = formData.get("profilePicture") as File | null;

    // Check if the profile picture is provided and is a valid file type
    if (profilePicture && !profilePicture.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid file type for profile picture" },
        {
          status: 400,
        }
      );
    }

    // Check if all fields are provided
    if (
      [fullName, email, password].some(
        (field) => field == null || field.trim() === ""
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide all the fields" },
        {
          status: 400,
        }
      );
    }

    // Check if a user with the same email already exists
    const existingUserWithEmail = await UserModel.findOne({ email });

    // Generate a random verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserWithEmail) {
      // If the user with the same email exists and is verified, return an error
      if (existingUserWithEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User with email already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        // If the user with the same email exists but is not verified, update the user's information
        const verificationCodeExpiry = new Date(Date.now() + 600000); // 10 minutes
        existingUserWithEmail.password = password;
        existingUserWithEmail.verificationCode = verificationCode;
        existingUserWithEmail.verificationCodeExpiry = verificationCodeExpiry;
        newUser = existingUserWithEmail;
      }
    } else {
      // If the user with the same email does not exist, create a new user
      const verificationCodeExpiry = new Date(Date.now() + 600000); // 10 minutes
      newUser = new UserModel({
        fullName,
        email,
        password: password,
        verificationCode,
        verificationCodeExpiry,
      });
    }

    //upload the profile picture
    if (profilePicture) {
      if (newUser?.profilePicture && newUser.profilePicture.fileId) {
        await imagekit.deleteFile(newUser.profilePicture.fileId);
      }
      const bytes = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadedprofilePicture = await imagekit.upload({
        file: buffer,
        fileName: `${newUser._id}-profile-picture-${Date.now()}`,
        folder: "/profile-pictures",
      });
      newUser.profilePicture = {
        url: uploadedprofilePicture.url,
        fileId: uploadedprofilePicture.fileId,
      };
    }

    // Save the user (new or updated)
    await newUser.save();

    // Send a verification email to the user
    const emailResponse = await sendVerificationEmail({
      id: String(newUser._id),
      fullName,
      email,
      verificationCode,
      verificationCodeExpiry: newUser?.verificationCodeExpiry,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.Please verify your email",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
};
