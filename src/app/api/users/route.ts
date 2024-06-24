import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/config";
import { decryptToken, errorHandler } from "@/lib/utils";
import ServerError from "@/lib/types";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const authorizationHeader = req.headers.get("cookie");
    const refreshTokenStartIndex =
      authorizationHeader?.match(/refreshToken=([^;]*)/)?.[1];
    if (!refreshTokenStartIndex) {
      throw new ServerError("Unauthorized", 401);
    }
    const accessToken = refreshTokenStartIndex;
    const dbToken = await prisma.token.findFirst({
      where: { token: accessToken },
    });
    if (!dbToken) throw new ServerError("Invalid token provided", 409);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          jobTitle: true,
          placeOfWork: true,
          licenseNumber: true,
          countryAndLanguage: true,
          countryOfPractice: true,
          preferredLanguage: true,
          role: true,
          queries: true,
          createdAt: true,
          updatedAt: true,
          Patient: true,
          Specialty: true,
          Assistant: true,
          history: true,
          Appointment: true,
          documents: true,
        },
      });
      return NextResponse.json(allUsers);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        jobTitle: true,
        placeOfWork: true,
        licenseNumber: true,
        countryAndLanguage: true,
        countryOfPractice: true,
        preferredLanguage: true,
        role: true,
        queries: true,
        createdAt: true,
        updatedAt: true,
        Patient: true,
        Specialty: true,
        Assistant: true,
        history: true,
        Appointment: true,
        documents: true,
      },
    });

    if (!user) {
      throw new ServerError("User not found", 404);
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
