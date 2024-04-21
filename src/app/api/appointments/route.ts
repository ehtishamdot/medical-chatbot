import { prisma } from "@/db/config";
import ServerError from "@/lib/types";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const appointmentSchema = z.object({
  startDate: z.string(),
  patientName: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const appointmentData = await req.json(appointmentSchema);
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
    const createdAppointment = await prisma.appointment.create({
      data: {
        ...appointmentData,
        createdById: id,
      },
    });
    return NextResponse.json(createdAppointment);
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
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    const userAppointments = await prisma.appointment.findMany({
      where: {
        createdBy: {
          id,
        },
      },
    });

    return NextResponse.json(userAppointments);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
