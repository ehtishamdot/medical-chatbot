import { prisma } from "@/db/config";
import ServerError from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { message } = messageSchema.parse(await req.json());
    const token = req.cookies.get("accessToken")!.value!;
    const chatgpt = getOpenAIApiInstance(process.env.OPENAI_GPT_KEY || "");
    const chat_completion = await chatgpt.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    await prisma.query.createMany({
      data: [
        {
          data: message,
          isUser: true,
          userId,
        },
        {
          data: chat_completion.data.choices[0].message?.content ?? "",
          isUser: false,
          userId,
        },
      ],
    });
    return NextResponse.json({
      message: chat_completion.data.choices[0].message?.content ?? "",
    });
  } catch (err) {
    console.log(err);

    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
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

    // return NextResponse.json({ queries });
  } catch (err) {
    return errorHandler(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")!.value!;
    const { userId } = decryptToken(token, process.env.JWT_SECRET!);
    await prisma.query.deleteMany({
      where: {
        userId,
      },
    });
    return NextResponse.json({ message: "Successfully cleared conversation" });
  } catch (err) {
    return errorHandler(err);
  }
}
