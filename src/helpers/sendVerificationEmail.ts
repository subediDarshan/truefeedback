import { resend } from "@/lib/resend";
import ApiResponse from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "True Feedback Verification Code",
      react: VerificationEmail({ username, otp }),
    });

    if (error) {
      throw error;
    }

    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.log("Error sending verification email", error);

    return {
      success: false,
      message: "Error sending verification email :: " + error,
    };
  }
}
