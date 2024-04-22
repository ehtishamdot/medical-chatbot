import * as sgMail from "@sendgrid/mail";
import { errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ServerError from "@/lib/types";
import { prisma } from "@/db/config";
import { gptTranslate } from "@/lib/helpers";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const emailSchema = z.object({
  uri: z.string(),
  to: z.string(),
  patientName: z.string(),
  doctorName: z.string(),
  notes: z.string(),
  preferedLanguage: z.string(),
  jobTitle: z.string(),
});

const EXPLANATION: string =
  "By interacting with this bot, you are assisting in our diagnostic process. Clicking the button below is crucial as it helps us gather essential information for accurate assessments and enables us to provide you with relevant updates on your health status, news, offers, and exciting developments.";

const HELPERTEXT: string =
  "If you're having trouble clicking the button above, you can also copy and paste the following link into your browser:";

interface MailDataWithOptionalContentAndTemplate
  extends Omit<sgMail.MailDataRequired, "content"> {
  templateId?: string;
  dynamicTemplateData?: {
    uri: string;
    patientName: string;
    doctorName: string;
    jobTitle: string;
    notes: string;
    explanation: string;
    helperText: string;
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
    const {
      uri,
      to,
      patientName,
      doctorName,
      notes,
      preferedLanguage,
      jobTitle,
    } = emailSchema.parse(await req.json());
    const chatgpt = getOpenAIApiInstance(process.env.OPENAI_GPT_KEY || "");
    const translatedExplanation = await gptTranslate(
      chatgpt,
      preferedLanguage,
      EXPLANATION
    );
    const translatedHelperText = await gptTranslate(
      chatgpt,
      preferedLanguage,
      HELPERTEXT
    );
    const msg: MailDataWithOptionalContentAndTemplate = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: `Chatbot bot Invitation from EsperWise`,
      templateId: process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID,
      dynamicTemplateData: {
        uri,
        patientName,
        doctorName,
        explanation:
          translatedExplanation.data.choices[0].message?.content ?? "",
        helperText: translatedHelperText.data.choices[0].message?.content ?? "",
        jobTitle,
        notes,
      },
    };
    await sgMail
      .send(msg as any)
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
