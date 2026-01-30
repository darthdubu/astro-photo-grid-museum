import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getS3Config } from "./storageConfig";

let s3Client: S3Client | null = null;

async function getClient() {
  if (s3Client) return s3Client;

  const config = await getS3Config();
  if (!config || !config.enabled) return null;

  s3Client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true, // Needed for many S3-compatible providers like Scaleway
  });

  return s3Client;
}

export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
): Promise<string | null> {
  const client = await getClient();
  const config = await getS3Config();

  if (!client || !config) return null;

  const upload = new Upload({
    client,
    params: {
      Bucket: config.bucket,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read", // Ensure it's public
    },
  });

  await upload.done();

  // Construct Public URL
  // For Scaleway/others, it's usually https://bucket.endpoint/key
  // But endpoint often includes 'https://', so we need to be careful.
  const endpoint = config.endpoint.replace(/^https?:\/\//, "");
  return `https://${config.bucket}.${endpoint}/${fileName}`;
}

export async function deleteFromS3(fileName: string): Promise<boolean> {
  const client = await getClient();
  const config = await getS3Config();

  if (!client || !config) return false;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: fileName,
      }),
    );
    return true;
  } catch (error) {
    console.error("S3 Delete Error:", error);
    return false;
  }
}
