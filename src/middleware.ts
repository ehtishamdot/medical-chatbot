import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ServerError from "./lib/types";
import { prisma } from "./db/config";
import { decryptToken } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const token = request.cookies.get("accessToken")?.value;

  const authorizationHeader = request.headers.get("Cookie");
  const refreshTokenStartIndex =
    authorizationHeader?.match(/refreshToken=([^;]*)/)?.[1];

  if (!refreshTokenStartIndex) {
    throw new ServerError("Unauthorized", 401);
  }
  const accessToken = refreshTokenStartIndex;
  // const user = await decryptToken(accessToken, process.env.JWT_SECRET as string);
  // console.log(user);
  // const dbToken = await prisma.token.findFirst({
  //   where: {
  //     token: accessToken,
  //   },
  // });
  // if (!dbToken) throw new ServerError("Invalid token provided", 409);

  if (pathname === "/landing") {
    return NextResponse.next();
  }
  if (pathname === "/") {
    return NextResponse.next();
  }

  if (
    !pathname.startsWith("/api") &&
    (pathname == "/auth/login" || pathname == "/auth/signup") &&
    token
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/patient") ||
      pathname.startsWith("/chatbots")) &&
    !token
  ) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  if (pathname == "/landing" || pathname == "/landing") {
    url.pathname = "/questions";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api")) {
    if (
      !(pathname == "/api/auth/login" || pathname == "/api/auth/signup") &&
      !token
    ) {
      return NextResponse.json(
        {
          message: "Unauthorised",
        },
        { status: 401 }
      );
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
