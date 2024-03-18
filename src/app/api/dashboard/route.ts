import { prisma } from "@/db/config";
import * as sgMail from "@sendgrid/mail";
import {
  decryptToken,
  errorHandler,
  generateRandomPassword,
} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";

interface Feedback {
  rating: number;
  comment?: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  medicalHistory: string;
  addedByUserId: string;
  Feedback: Feedback[]; // Adding the Feedback property as an array of Feedback objects
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

    let createdAssistants = await prisma.assistant.count({
      where: {
        userId: id,
      },
    });
    let patientAssisted = await prisma.patient.count({
      where: {
        addedByUserId: id,
      },
    });
    let botUsage = await prisma.patient.count({
      where: {
        addedByUserId: id,
      },
    });
    const patients: Patient[] = await prisma.patient.findMany({
      where: {
        addedByUserId: id,
      },
      include: {
        Feedback: {
          select: {
            rating: true,
            comment: true,
          },
        },
      },
    });
    let totalRatings = 0;
    let numberOfFeedback = 0;
    patients.forEach((patient) => {
      patient.Feedback.forEach((feedback: { rating: number }) => {
        if (feedback.rating) {
          totalRatings += feedback.rating;
          numberOfFeedback++;
        }
      });
    });
    const averageRating = totalRatings / numberOfFeedback;
    const scaledRating = (averageRating / 5) * 100;
    return NextResponse.json({
      createdAssistants,
      patientAssisted,
      botUsage,
      totalRatings: scaledRating,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id: assistantId } = await req.json();

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
    const assistant = await prisma.assistant.findUnique({
      where: {
        id: assistantId,
      },
    });
    if (!assistant) {
      throw new ServerError("Assistant not found", 404);
    }
    await prisma.assistant.delete({
      where: {
        id: assistantId,
      },
    });

    return NextResponse.json("Deleted assistant successfully");

    // const payload: JWTPayload = { id: assistant.id };
    // const accessToken = sign(payload, process.env.JWT_SECRET!, {
    //   expiresIn: "50m",
    // });
    // const refreshToken = sign(
    //   { id: assistant.id },
    //   process.env.JWT_REFRESH_SECRET!
    // );
    // await prisma.token.create({
    //   data: {
    //     token: refreshToken,
    //   },
    // });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
