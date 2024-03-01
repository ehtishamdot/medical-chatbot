import { prisma } from "@/db/config";
import ServerError from "@/lib/types";
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
                },
                create: {
                  question: q.question,
                  priority: q.priority,
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
    const { specialist, specificity, disease } = await req.json();
    console.log(specialist, specificity, disease);
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
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);
    let user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new ServerError("User not found", 404);

    const apiUrl = `https://7b13-2407-aa80-14-5b38-9910-1438-f17c-98f3.ngrok-free.app/api/bot/question?specialist=${specialist}&specificity=${specificity}&disease=${disease}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error calling API: ${response.statusText}`);
    }
    const responseData = await response.json();
    const { phases } = await responseData;

    const createdPhases = await Promise.all(
      phases.map(
        async (phase: {
          questions: { question: string; priority: number }[];
          name: string;
        }) => {
          const createdQuestions = await Promise.all(
            phase.questions.map(
              (q: { question: string; priority: number }) => ({
                question: q.question,
                priority: q.priority,
              })
            )
          );
          const phaseType = specificity;
          const createdPhase = await prisma.phase.create({
            data: {
              name: phase.name,
              questions: {
                create: createdQuestions,
              },
              phaseType,
            },
          });
          return createdPhase;
        }
      )
    );
    const createdSpecialty = await prisma.specialty.create({
      data: {
        name: specialist,
        addedByUserId: id,
        countryAndLanguage: user.countryAndLanguage,
        ...(specificity === "DISEASE_SPECIFIC"
          ? {
              diseases: {
                create: {
                  phases: {
                    connect: createdPhases.map((createdPhase: { id: any }) => ({
                      id: createdPhase.id,
                    })),
                  },
                  name: disease,
                },
              },
            }
          : {
              generalPhases: {
                connect: createdPhases.map((createdPhase: { id: any }) => ({
                  id: createdPhase.id,
                })),
              },
            }),
      },
    });

    return NextResponse.json({ ...createdSpecialty, specificity });
  } catch (err) {
    console.error(err);
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

    const id = req.nextUrl.searchParams.get("specialtyId");
    const specificity = req.nextUrl.searchParams.get("specificity");
    if (!specificity || !id) {
      return NextResponse.json({
        error: "Invalid or missing specialty ID.",
      });
    }

    const currentScaler =
      specificity === "DISEASE_SPECIFIC"
        ? {
            diseases: {
              include: {
                phases: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          }
        : {
            generalPhases: {
              include: {
                questions: true,
              },
            },
          };
    const specialty = await prisma.specialty.findUnique({
      where: { id },
      include: currentScaler,
    });
    return NextResponse.json(specialty);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const specialty = req.nextUrl.searchParams.get("specialty");
//     if (!specialty) {
//       return NextResponse.json({
//         error: "Specialty name is required in the query parameters",
//       });
//     }

//     const phases = await prisma.specialty.findMany({
//       where: {
//         name: specialty,
//         // phases: {
//         //   gt: 0,
//         // },
//       },
//       include: {
//         phases: {
//           include: {
//             questions: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({ phases });
//   } catch (err) {
//     console.error(err);
//     return errorHandler(err);
//   }
// }
