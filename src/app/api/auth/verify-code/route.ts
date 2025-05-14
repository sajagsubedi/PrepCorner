import connectDb from "@/lib/connectDb";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectDb();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const decodedId = decodeURIComponent(id);
    const user = await UserModel.findById(decodedId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.verificationCode || !user.verificationCodeExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification data is missing. Please sign up again.",
        },
        { status: 400 }
      );
    }

    const expiry = new Date(user.verificationCodeExpiry);
    const now = new Date();

    if (expiry <= now) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        verificationCodeExpiry: expiry.toISOString(),
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Error fetching verification info:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  await connectDb();
  try {
    const { id, verificationCode } = await request.json();
    const decodedId = decodeURIComponent(id);
    console.log("decoded id is ", decodedId);
    const user = await UserModel.findById(decodedId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exists!",
        },
        { status: 404 }
      );
    }
    const isCodeValid = user?.verificationCode == verificationCode;
    const isCodeNotExpired =
      new Date(user?.verificationCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "Your account has been verified!",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code expired!. Please signup again to gain new verification code",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code!",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
