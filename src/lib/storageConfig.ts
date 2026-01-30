import fs from "node:fs/promises";
import path from "node:path";

const S3_CONFIG_FILE = "s3-config.json";

export interface S3Config {
  enabled: boolean;
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export async function getS3Config(): Promise<S3Config | null> {
  try {
    const data = await fs.readFile(S3_CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export async function saveS3Config(config: S3Config) {
  try {
    await fs.writeFile(S3_CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Failed to save S3 config:", error);
    throw error;
  }
}
