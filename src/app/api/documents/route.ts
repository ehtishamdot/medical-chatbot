import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { runMiddleware, multerMiddleware } from "@/lib/multerMiddleware";
import { prisma } from "@/db/config";
import { decryptToken, errorHandler } from "@/lib/utils";
import ServerError from "@/lib/types";

const Bucket = process.env.AMPLIFY_BUCKET!;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// export async function GET() {
//   try {
//     const response = await s3.send(new ListObjectsCommand({ Bucket }));
//     return NextResponse.json(response.Contents ?? []);
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await runMiddleware(req as any, res as any, multerMiddleware);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      throw new ServerError("File not found", 400);
    }

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
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    const fileUrl = await uploadFile(file);

    const createdDocument = await prisma.document.create({
      data: {
        url: fileUrl,
        name: file.name,
        userId: id,
      },
    });

    return NextResponse.json(createdDocument);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

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
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    const createdDocument = await prisma.document.findMany({
      where: {
        userId: id,
      },
    });

    return NextResponse.json(createdDocument);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

async function uploadFile(file: any): Promise<string> {
  console.log("File Data:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  const Body = Buffer.from(await file.arrayBuffer());

  const params = {
    Bucket,
    Key: `${Date.now()}_${file.name}`,
    Body: Body,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    return `https://${Bucket}.s3.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("Upload Error:", error);
    throw new Error(`Failed to upload file: ${error}`);
  }
}
