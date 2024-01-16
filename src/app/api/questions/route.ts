import { prisma } from "@/db/config";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  status: z.string(),
  priority: z.number(),
});

const phaseSchema = z.object({
  name: z.string(),
  questions: z.array(questionSchema),
});

export async function PUT(req: NextRequest) {
  try {
    const phases = phaseSchema.array().parse(await req.json());
    const token = req.cookies.get("accessToken")!.value!;
    const { userId } = decryptToken(token, process.env.JWT_SECRET!);

    // Update each phase in the database
    const updatedPhases = await Promise.all(
      phases.map(async (phase) => {
        // Update the phase with new data
        await prisma.query.update({
          where: {
            name: phase.name,
          },
          data: {
            questions: {
              updateMany: phase.questions.map((q) => ({
                where: {
                  id: q.id,
                },
                data: {
                  question: q.question,
                  priority: q.priority,
                  status: q.status,
                },
              })),
            },
          },
        });

        return {
          name: phase.name,
          message: chat_completion.data.choices[0].message?.content ?? "",
        };
      })
    );

    return NextResponse.json({ updatedPhases });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const phases = phaseSchema.array().parse(await req.json());
//     const token = req.cookies.get("accessToken")!.value!;
//     const { userId } = decryptToken(token, process.env.JWT_SECRET!);

//     // Create each phase and its questions in the database
//     const createdPhases = await Promise.all(
//       phases.map(async (phase) => {
//         const createdPhase = await prisma.query.create({
//           data: {
//             name: phase.name,
//             questions: {
//               createMany: {
//                 data: phase.questions.map((q) => ({
//                   id: q.id,
//                   question: q.question,
//                   priority: q.priority,
//                   status: q.status,
//                   userId,
//                 })),
//               },
//             },
//           },
//           include: {
//             questions: true,
//           },
//         });

//         // Your existing code for chat completion
//         // ...

//         return {
//           name: createdPhase.name,
//           questions: createdPhase.questions,
//           message: chat_completion.data.choices[0].message?.content ?? "",
//         };
//       })
//     );

//     return NextResponse.json({ createdPhases });
//   } catch (err) {
//     console.log(err);
//     return errorHandler(err);
//   }
// }

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

// export async function DELETE(req: NextRequest) {
//   try {
//     const token = req.cookies.get("accessToken")!.value!;
//     const { userId } = decryptToken(token, process.env.JWT_SECRET!);
//     await prisma.query.deleteMany({
//       where: {
//         userId,
//       },
//     });
//     return NextResponse.json({ message: "Successfully cleared conversation" });
//   } catch (err) {
//     return errorHandler(err);
//   }
// }
