import { prisma } from "@/db/config";
import ServerError from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { deepEqual } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Question {
  id: string;
  phaseId: string;
  question: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface Phase {
  id: string;
  name: string;
  phaseType: string;
  specialtyId: string | null;
  diseaseId: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}
interface Disease {
  phases?: Phase[];
}

interface SpecialtyType {
  id: string;
  name: string;
  countryAndLanguage: string;
  addedByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  diseases?: Disease[] | any;
  generalPhases?: Phase[];
}

type SpecialtyTypeOrNull = SpecialtyType | null;

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
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    const specialty = await prisma.user.findUnique({
      where: { id },
      include: {
        Specialty: {
          include: {
            diseases: true,
            generalPhases: true,
          },
        },
        
      },
    });
    return NextResponse.json(specialty?.Specialty[0]);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
