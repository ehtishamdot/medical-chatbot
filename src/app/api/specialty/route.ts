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
import { randomBytes } from "crypto";

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

    let specialtiesByUser = await prisma.specialty.findMany({
      where: {
        addedByUserId: id,
      },
    });
    return NextResponse.json(specialtiesByUser);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
