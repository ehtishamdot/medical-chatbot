import { prisma } from "@/db/config";
import * as sgMail from "@sendgrid/mail";
import { errorHandler, generateRandomPassword } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";
import { randomBytes } from "crypto";

const AssistantType = z.enum(["MEDICAL", "ADMINISTRATIVE"]);
const Assistant = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  assistantType: AssistantType,
  additionalInfo: z.string().optional(),
  role: z.enum(["ASSISTANT", "DOCTOR"]),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface MailDataWithOptionalContentAndTemplate
  extends Omit<sgMail.MailDataRequired, "content"> {
  templateId?: string;
  dynamicTemplateData?: {
    uri: string;
    assistantName: string;
    email: string;
    password: string;
  };
}
const emailSchema = z.object({
  uri: z.string(),
  to: z.string(),
  email: z.string(),
  password: z.string(),
  assistantName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { email, name } = Assistant.parse(await req.json());
    let assistant = await prisma.assistant.findUnique({
      where: {
        email,
      },
    });
    const password = generateRandomPassword(12);
    if (assistant) throw new ServerError("Assistant already exist", 409);
    assistant = await prisma.assistant.create({
      data: {
        email,
        password: hashSync(password, 10),
        role: "ASSISTANT",
        name,
      },
    });

    const { uri, to, assistantName } = emailSchema.parse(await req.json());
    const msg: MailDataWithOptionalContentAndTemplate = {
      to,
      from: "contact@seedinov.com",
      subject: `EsperWise from ${doctorName}`,
      templateId: process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID,
      dynamicTemplateData: {
        uri,
        email,
        password,
        assistantName,
      },
    };
    await sgMail
      .send(msg)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw new Error(err);
      });
    return NextResponse.json({ message: `email sent to ${assistant}` });

    // const payload: JWTPayload = { id: assistant.id };
    // const accessToken = sign(payload, process.env.JWT_SECRET!, {
    //   expiresIn: "50m",
    // });
    // const refreshToken = sign(
    //   { id: assistant.id },
    //   process.env.JWT_REFRESH_SECRET!
    // );
    // await prisma.token.create({
    //   data: {
    //     token: refreshToken,
    //   },
    // });
  } catch (err) {
    return errorHandler(err);
  }
}
