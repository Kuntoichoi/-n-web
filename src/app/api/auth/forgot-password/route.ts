import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });

    // We don't want to expose if a user exists or not to prevent email enumeration,
    // so we always return success.
    if (!user) {
      return NextResponse.json({ message: "If an account with that email exists, we sent a reset link." }, { status: 200 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    
    await user.save();

    const resetURL = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Mock Email Sending
    console.log(`[MOCK EMAIL] To: ${email}\nSubject: Password Reset Request\nBody: Forgot your password? Click here to reset it: ${resetURL}`);

    return NextResponse.json({ message: "If an account with that email exists, we sent a reset link.", resetURL }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
