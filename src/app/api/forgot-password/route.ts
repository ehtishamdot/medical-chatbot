import * as sgMail from "@sendgrid/mail";
import { errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import ServerError from "@/lib/types";
import { prisma } from "@/db/config";
import { randomBytes } from "crypto";

function generatePassword(length: number): string {
  return randomBytes(length).toString("base64").slice(0, length);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const { email } = forgotPasswordSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ServerError("User with this email does not exist", 404);
    }

    const newPassword = generatePassword(12);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: "Your New Password",
      text: `Hello ${user.username},\n\nYour new password is: ${newPassword}\n\nPlease log in and change it as soon as possible.\n\nBest regards,\nYour Team`,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: `New password sent to ${email}` });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
