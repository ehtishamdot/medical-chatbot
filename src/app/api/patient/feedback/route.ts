import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { Patient } from "@prisma/client";
import { deepEqual } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { rating, comment, patientId, specialtyId, diseaseId } =
      await req.json();
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
    const availablePatientStatus = await prisma.patient.findUnique({
      where: {
        id: patientId,
        addedByUserId: id,
      },
    });

    const SpecialtyName = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
      select: {
        name: true,
      },
    });

    let diseaseName;
    if (diseaseId) {
      diseaseName = await prisma.disease.findUnique({
        where: {
          id: diseaseId,
        },
        select: {
          name: true,
        },
      });
    }

    if (availablePatientStatus) {
      const feedback = await prisma.feedback.create({
        data: {
          patientId,
          rating,
          comment,
          specialty: SpecialtyName?.name,
          diseaseName: diseaseName?.name,
          phaseType: diseaseId ? "DISEASE_SPECIFIC" : "GENERAL",
          diseaseId,
          specialtyId,
        },
      });
      return NextResponse.json(feedback);
    }
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const specialtyId = req.nextUrl.searchParams.get("specialtyId") as string;
    const diseaseId = req.nextUrl.searchParams.get("diseaseId") as string;
    const phaseType = req.nextUrl.searchParams.get("phaseType") as string;
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
    let feedback = await prisma.feedback.findMany({
      where: {
        specialtyId,
        diseaseId,
        phaseType,
      },
    });

    if (!feedback.length) {
      throw new ServerError("Feedbacks not found", 404);
    }
    const feedbacksWithPatients = await Promise.all(
      feedback.map(async (feedback: { patientId: any }) => {
        const patient: Patient | null = await prisma.patient.findUnique({
          where: {
            id: feedback.patientId,
          },
        });
        return { feedback, patient };
      })
    );
    const response = {
      feedbacks: feedbacksWithPatients,
    };

    return NextResponse.json(feedbacksWithPatients);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
