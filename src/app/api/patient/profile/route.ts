import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  status: z.string(),
  priority: z.number(),
});

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const patientId = req.nextUrl.searchParams.get("patientId") as string;
    if (!patientId) throw new ServerError("Patient Id is required", 500);
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

    let result = await prisma.$transaction([
      prisma.user.findFirst({
        where: {
          id,
        },
      }),
      prisma.assistant.findFirst({
        where: {
          id,
        },
        include: {
          user: true,
        },
      }),
    ]);
    let user = result[0] || result[1];
    let addedByUserId = user?.id;
    if (user?.role === "ASSISTANT") {
      addedByUserId = user?.user?.id;
    } else {
      addedByUserId = user?.id;
    }
    const patient = await prisma.patient.findUnique({
      where: {
        addedByUserId,
        id: patientId,
      },
    });
    return NextResponse.json(patient);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
