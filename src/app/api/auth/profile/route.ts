import { prisma } from "@/db/config";
import { errorHandler } from "@/lib/utils";
import { NextRequest } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";

const profileSchema = z
  .object({
    userId: z.string(),
    specialty: z.string(),
    jobTitle: z.string(),
    placeOfWork: z.string(),
    licenseNumber: z.string(),
    countryAndLanguage: z.string(),
    countryOfPractice: z.string(),
    preferredLanguage: z.string(),
  })
  .strict();

const securitySchema = z
  .object({
    userId: z.string(),
    username: z.string().min(6).max(12),
    password: z.string().min(8).max(16),
  })
  .strict();

export async function PUT(req: NextRequest) {
  try {
    const {
      userId,
      specialty,
      jobTitle,
      placeOfWork,
      licenseNumber,
      countryAndLanguage,
      countryOfPractice,
      preferredLanguage,
    } = profileSchema.parse(await req.json());

    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ServerError("User not found", 404);
    user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        specialty,
        jobTitle,
        placeOfWork,
        licenseNumber,
        countryAndLanguage,
        countryOfPractice,
        preferredLanguage,
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
