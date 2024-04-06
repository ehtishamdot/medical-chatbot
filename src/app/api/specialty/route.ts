import { prisma } from "@/db/config";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import ServerError, { JWTPayload } from "@/lib/types";

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
    let addedByUserId = user?.id;
    if (user?.role === "ASSISTANT") {
      addedByUserId = user?.user?.id;
    } else {
      addedByUserId = user?.id;
    }
    let specialtiesByUser = await prisma.specialty.findMany({
      where: {
        addedByUserId,
      },
    });
    return NextResponse.json(specialtiesByUser);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
