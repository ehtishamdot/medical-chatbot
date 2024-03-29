import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
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

export async function POST(req: NextRequest) {
  try {
    const patient = await req.json();
    const authorizationHeader = req.headers.get("Cookie");
    console.log(authorizationHeader);
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
    const createdPatient = await prisma.patient.create({
      data: {
        ...patient,
        addedByUserId: id,
      },
    });
    return NextResponse.json(createdPatient);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const authorizationHeader = req.headers.get("Cookie");
    console.log(authorizationHeader);
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
    let userPatients;
    let addedByUserId = user?.id;
    if (user?.role === "ASSISTANT") {
      addedByUserId = user?.user?.id;
    } else {
      addedByUserId = user?.id;
    }
    userPatients = await prisma.patient.findMany({
      where: {
        addedByUserId,
      },
    });
    return NextResponse.json(userPatients);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
