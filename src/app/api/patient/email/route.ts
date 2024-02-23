import * as sgMail from "@sendgrid/mail";
import { errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ServerError from "@/lib/types";
import { prisma } from "@/db/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const emailSchema = z.object({
  uri: z.string(),
  to: z.string(),
  patientName: z.string(),
  doctorName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const authorizationHeader = req.headers.get("Cookie");
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

    const { uri, to, patientName, doctorName } = emailSchema.parse(
      await req.json()
    );
    const msg: sgMail.MailDataRequired = {
      to,
      from: "contact@seedinov.com",
      subject: `EsperWise from ${doctorName}`,
      templateId: process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID,
      text: "and easy to do anywhere, even with Node.js",
      dynamicTemplateData: {
        uri,
        patientName,
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
    return NextResponse.json({ message: `email sent to ${patientName}` });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
