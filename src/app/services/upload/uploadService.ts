import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (file: File): Promise<string> => {
  const bucketName = process.env.AMPLIFY_BUCKET;

  if (!bucketName) {
    throw new Error("Missing S3 bucket name in environment variables");
  }

  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}_${file.name}`,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${params.Key}`;
  } catch (error) {
    throw new Error(`Failed to upload file:`);
  }
};
