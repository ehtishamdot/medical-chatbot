import { prisma } from "@/db/config";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { deepEqual } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  status: z.string(),
  priority: z.number(),
});

const phaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.array(questionSchema),
});

export async function PUT(req: NextRequest) {
  try {
    const phases = phaseSchema.array().parse(await req.json());
    const token = req.cookies.get("accessToken")!.value!;
    const { id } = decryptToken(token, process.env.JWT_SECRET!);

    const updatedPhases = await Promise.all(
      phases.map(async (phase) => {
        return await prisma.phase.update({
          where: {
            id: phase.id,
          },
          data: {
            questions: {
              upsert: phase.questions.map((q) => ({
                where: {
                  id: q.id || "0",
                },
                update: {
                  question: q.question,
                  priority: q.priority,
                  status: q.status,
                },
                create: {
                  question: q.question,
                  priority: q.priority,
                  status: q.status,
                },
              })),
            },
          },
        });
      })
    );

    return NextResponse.json({ updatedPhases });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const specialties = await req.json();
    if (specialties.length === 0) return;
    const token = req.cookies.get("accessToken")!.value!;
    const { id } = decryptToken(token, process.env.JWT_SECRET!);

    const createdSpecialties = await Promise.all(
      specialties.map(async (specialty: { phases: any[]; name: any; }) => {
        const createdPhases = await Promise.all(
          specialty.phases.map(async (phase) => {
            const createdQuestions = await Promise.all(
              phase.questions.map((q) => ({
                question: q.question,
                priority: q.priority,
                status: q.status || "none",
              }))
            );

            const createdPhase = await prisma.phase.create({
              data: {
                name: phase.phase,
                specialty: {
                  create: {
                    name: specialty.name,
                  },
                },
                questions: {
                  create: createdQuestions,
                },
              },
            });

            return createdPhase;
          })
        );

        console.log(specialty);

        const createdSpecialty = await prisma.specialty.create({
          data: {
            name: specialty.name,
            phases: {
              connect: createdPhases.map((createdPhase) => ({
                id: createdPhase.id,
              })),
            },
          },
        });

        return createdSpecialty;
      })
    );

    return NextResponse.json({ createdSpecialties });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const specialty = req.nextUrl.searchParams.get("specialty");
    if (!specialty) {
      return NextResponse.status(400).json({
        error: "Specialty name is required in the query parameters",
      });
    }

    const phases = await prisma.specialty.findMany({
      where: {
        name: specialty,
        // phases: {
        //   gt: 0,
        // },
      },
      include: {
        phases: {
          include: {
            questions: true,
          },
        },
      },
    });

    return NextResponse.json({ phases });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

// export async function DELETE(req: NextRequest) {
//   try {
//     const token = req.cookies.get("accessToken")!.value!;
//     const { id } = decryptToken(token, process.env.JWT_SECRET!);
//     await prisma.query.deleteMany({
//       where: {
//         id,
//       },
//     });
//     return NextResponse.json({ message: "Successfully cleared conversation" });
//   } catch (err) {
//     return errorHandler(err);
//   }
// }
