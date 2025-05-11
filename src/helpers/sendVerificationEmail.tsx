import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;

export const sendVerificationEmail = async (data: {
  id: string;
  fullName: string;
  email: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const formattedExpiry = new Date(
      data.verificationCodeExpiry
    ).toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${data.id}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Foodiego Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f8f8f8; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); text-align: center;">
          <h2 style="font-size: 22px; font-weight: bold; color: #333;">Welcome to <span style="color: #ec003f;">Prepcorner</span>, ${data.fullName}!</h2>
          <p style="font-size: 16px; color: #555; margin-top: 10px;">
            Thank you for signing up. Please verify your email using the code below:
          </p>
          <p style="font-size: 22px; font-weight: bold; color: #ec003f; margin: 10px 0;">${data.verificationCode}</p>
          <p style="font-size: 14px; color: #777; margin-top: 10px;">
             <a href="${link}" style="color: #ec003f; text-decoration: none;">Visit</a> the form to verify your email.
          </p>
          <p style="font-size: 16px; color: #555; margin-top: 20px;">
            This code is valid until <strong>${formattedExpiry}</strong>. If you did not sign up for Foodiego, please ignore this email.
          </p>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">&copy; 2025 Foodiego. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const result = await transporter.sendMail({
      from: EMAIL_USER,
      to: data.email,
      subject: "Verify Your Email - Prepcorner",
      html: emailHtml,
    });

    console.log("result is ", result);
    return { success: true, message: "Verification email sent." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
};
