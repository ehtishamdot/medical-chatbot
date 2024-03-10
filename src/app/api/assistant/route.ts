import { prisma } from "@/db/config";
import * as sgMail from "@sendgrid/mail";
import {
  decryptToken,
  errorHandler,
  generateRandomPassword,
} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";
import { randomBytes } from "crypto";

const AssistantType = z.enum(["MEDICAL", "ADMINISTRATIVE"]);
const Assistant = z.object({
  email: z.string().email(),
  name: z.string(),
  additionalInfo: z.string().optional(),
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

    const authorizationHeader = req.headers.get("Cookie");
    console.log(authorizationHeader);
    const refreshTokenStartIndex =
      authorizationHeader?.match(/refreshToken=([^;]*)/)?.[1];
    if (!refreshTokenStartIndex) {
      throw new ServerError("Unauthorized", 401);
    }
    const accessToken = refreshTokenStartIndex;
    const dbToken = await prisma.token.findFirst({
      where: {
        token: accessToken,
      },
    });
    if (!dbToken) throw new ServerError("Invalid token provided", 409);
    const { id: userId } = decryptToken(
      accessToken,
      process.env.JWT_REFRESH_SECRET!
    );
    let result = await prisma.$transaction([
      prisma.user.findUnique({
        where: {
          email,
          id: userId,
        },
      }),
      prisma.assistant.findUnique({
        where: {
          email,
          userId,
        },
      }),
    ]);
    const password = generateRandomPassword(12);
    console.log(result);
    if (result[0] || result[1])
      throw new ServerError("This email is already exist", 409);
    console.log(password);
    let assistant = await prisma.assistant.create({
      data: {
        email,
        password: hashSync(password, 10),
        role: "ASSISTANT",
        name,
        userId,
      },
    });

    const msg: MailDataWithOptionalContentAndTemplate = {
      to: email,
      from: "contact@seedinov.com",
      subject: `Your invitation to EsperWise Platform`,
      templateId: process.env.SENDGRID_ASSISTANT_INVITATION_TEMPLATE_ID,
      dynamicTemplateData: {
        uri: process.env.NEXT_PUBLIC_API_URL as string,
        email,
        password,
        assistantName: name,
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

    return NextResponse.json({ data: { password, assistant } });

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
    console.log(err);
    return errorHandler(err);
  }
}
