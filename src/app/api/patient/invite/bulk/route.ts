import * as sgMail from "@sendgrid/mail";
import { errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ServerError from "@/lib/types";
import { prisma } from "@/db/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const emailSchema = z.object({
  uri: z.string(),
  to: z.array(z.string()),
  patientNames: z.array(z.string()),
  doctorName: z.string(),
  notes: z.string(),
});

interface MailDataWithOptionalContentAndTemplate
  extends Omit<sgMail.MailDataRequired, "content"> {
  templateId?: string;
  dynamicTemplateData?: {
    uri: string;
    patientName: string;
    doctorName: string;
    notes: string;
  };
}

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

    const { uri, to, patientNames, doctorName, notes } = emailSchema.parse(
      await req.json()
    );

    const messages = to.map((email, index) => {
      const msg: MailDataWithOptionalContentAndTemplate = {
        to: email,
        from: "contact@seedinov.com",
        subject: `EsperWise from ${doctorName}`,
        templateId: process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID,
        dynamicTemplateData: {
          uri,
          patientName: patientNames[index],
          doctorName,
          notes,
        },
      };
      return msg;
    });
    const sendPromises = messages.map((msg) => sgMail.send(msg));
    await Promise.all(sendPromises);
    return NextResponse.json({
      message: `Bulk email invitations sent to ${to.length} recipients`,
    });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
