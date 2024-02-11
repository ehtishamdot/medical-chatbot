import { prisma } from "@/db/config";
import { errorHandler } from "@/lib/utils";
import { NextRequest } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";

const securitySchema = z
  .object({
    username: z.string().min(6).max(12),
    password: z.string().min(8).max(16),
  })
  .strict();

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

    let user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) throw new ServerError("User not found", 404);
    user = await prisma.user.update({
      where: {
        username: username,
      },
      data: {
        password: hashSync(password, 10),
        username,
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (err) {
    return errorHandler(err);
  }
}
