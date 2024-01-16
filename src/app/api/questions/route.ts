import { prisma } from "@/db/config";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  priority: z.number(),
  phase: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { id, question, priority, phase } = questionSchema.parse(
      await req.json()
    );
    const token = req.cookies.get("accessToken")!.value!;
    const { userId } = decryptToken(token, process.env.JWT_SECRET!);

    const existingPhase = await prisma.query.findUnique({
      where: {
        name: phase,
      },
      include: {
        questions: true,
      },
    });

    // Check if the phase exists
    if (existingPhase) {
      // Find the question by id and userId
      const existingQuestion = existingPhase.questions.find(
        (q) => q.id === id && q.userId === userId
      );

      if (existingQuestion) {
        // Update the existing question with new data
        await prisma.query.update({
          where: {
            name: phase,
          },
          data: {
            questions: {
              update: {
                where: {
                  id_userId: {
                    id,
                    userId,
                  },
                },
                data: {
                  data: question,
                  priority,
                  status: "none",
                },
              },
            },
          },
        });

        // Your existing code for chat completion
        // ...

        return NextResponse.json({
          message: chat_completion.data.choices[0].message?.content ?? "",
        });
      }
    }

    // Handle the case where the phase or question does not exist
    return NextResponse.json({
      error: "Phase or question not found",
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
    const phases = await prisma.query.findMany({
      include: {
        questions: true,
      },
      where: {
        userId,
      },
    });
    return NextResponse.json({ phases });
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
