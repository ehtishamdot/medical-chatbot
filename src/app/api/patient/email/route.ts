import * as sgMail from "@sendgrid/mail";
import { errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const emailSchema = z.object({
  uri: z.string(),
  to: z.string(),
  patientName: z.string(),
  doctorName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
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
    const emailResponse = await sgMail
      .send(msg)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw new Error(err);
      });
    return NextResponse.json(emailResponse);
  } catch (err) {
    return errorHandler(err);
  }
}
