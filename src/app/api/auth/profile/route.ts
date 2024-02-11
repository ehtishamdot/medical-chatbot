import { prisma } from "@/db/config";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";

const profileSchema = z
  .object({
    specialty: z.string().optional(),
    jobTitle: z.string().optional(),
    placeOfWork: z.string().optional(),
    licenseNumber: z.string().optional(),
    countryAndLanguage: z.string().optional(),
    countryOfPractice: z.string().optional(),
    preferredLanguage: z.string().optional(),
  })
  .strict();

export async function PUT(req: NextRequest) {
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
    const data = profileSchema.parse(await req.json());
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);
    let user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new ServerError("User not found", 404);
    user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
