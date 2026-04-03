import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    // Hash the token from the client to match the database stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await dbConnect();

    // Find user with matching token that hasn't expired yet
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Token is invalid or has expired" }, { status: 400 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
