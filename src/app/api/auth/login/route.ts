import { prisma } from "@/db/config";
import { errorHandler } from "@/lib/utils";
import { NextRequest } from "next/server";
import { compareSync } from "bcrypt";
import { z } from "zod";
import { getSession } from "next-auth/react";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";
import { Session } from "next-auth";

type AccessToken = string;
type RefreshToken = string;

const loginSchema = z
  .object({
    input: z.string(),
    password: z.string().min(8).max(16),
    role: z.enum(["ASSISTANT", "DOCTOR"]),
  })
  .strict();

export async function POST(req: NextRequest) {
  try {
    const { input, password, role } = loginSchema.parse(await req.json());
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input }, { username: input }],
        role: role,
      },
    });
    if (!user) throw new ServerError("User does not exist or Forbidden", 409);

    const correctPassword = compareSync(password, user.password);
    if (!correctPassword) throw new ServerError("Wrong email or password", 401);

    const payload: JWTPayload = { userId: user.id };
    const accessToken: AccessToken = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "50m",
    });
    const refreshToken: RefreshToken = sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!
    );
    await prisma.token.create({
      data: {
        token: refreshToken,
      },
    });

    const userCopy = {
      ...user,
      password: undefined,
    };

    // Update: Replace the manual cookie setting with the Next.js authentication
    const session = (await getSession({ req })) as Session & {
      accessToken: AccessToken;
      refreshToken: RefreshToken;
    };
    session.accessToken = accessToken;
    session.refreshToken = refreshToken;

    return new Response(JSON.stringify(userCopy), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}
