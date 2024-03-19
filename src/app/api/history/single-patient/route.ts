import { prisma } from "@/db/config";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import ServerError, { JWTPayload } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const historyId = req.nextUrl.searchParams.get("historyId") as string;
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
    let history = await prisma.history.findUnique({
      where: {
        id: historyId,
      },
    });
    return NextResponse.json(history);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
