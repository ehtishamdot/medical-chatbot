import { prisma } from "@/db/config";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { JwtPayload, sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";
import { verify } from "jsonwebtoken";

const securitySchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const { username, password } = securitySchema.parse(await req.json());
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      throw new ServerError("Unauthorized", 401);
    }
    const accessToken = authorizationHeader.replace("Bearer ", "");
    const dbToken = await prisma.token.findFirst({
      where: {
        token: accessToken,
      },
    });
    if (!dbToken) throw new ServerError("Invalid token provided", 409);
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
      data: {
        ...(username && { username }),
        ...(password && { password: hashSync(password, 10) }),
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
