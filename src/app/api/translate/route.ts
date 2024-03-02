import { prisma } from "@/db/config";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { message } = messageSchema.parse(await req.json());
    const chatgpt = getOpenAIApiInstance(process.env.OPENAI_GPT_KEY || "");
    const chat_completion = await chatgpt.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are a translation bot tasked with converting messages into English. Your job is to accurately interpret the input text and provide a clear English translation.",
        },
        { role: "user", content: message },
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
    const token = req.cookies.get("accessToken")!.value!;
    const { userId } = decryptToken(token, process.env.JWT_SECRET!);
    const queries = await prisma.query.findMany({
      orderBy: {
        id: "asc",
      },
      where: {
        userId,
      },
    });
    return NextResponse.json({ queries });
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
