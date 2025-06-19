import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (data: {
  id: string;
  fullName: string;
  email: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
}) => {
  try {
    const formattedExpiry = new Date(
      data.verificationCodeExpiry
    ).toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${data.id}`;
    const SENDER_EMAIL = process.env.SENDER_EMAIL;

    const result = await resend.emails.send({
      from: `PrepCorner <${SENDER_EMAIL}>`,
      to: data.email,
      subject: "Verify Your Email - PrepCorner",
      react: VerificationEmail({
        fullName: data.fullName,
        verificationCode: data.verificationCode,
        formattedExpiry,
        verificationLink,
      }),
    });

    console.log("Resend email result:", result);
    return { success: true, message: "Verification email sent via Resend." };
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    return {
      success: false,
      message: "Failed to send verification email via Resend.",
    };
  }
};
