export const prerender = false;
import type { APIRoute } from "astro";
import { getS3Config, type S3Config, saveS3Config } from "../../lib/storageConfig";

export const GET: APIRoute = async () => {
  const config = await getS3Config();
  if (config) {
    // Mask sensitive data
    return new Response(
      JSON.stringify({
        ...config,
        secretAccessKey: config.secretAccessKey ? "********" : "",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify(null), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const currentConfig = await getS3Config();
    
    // If password is masked (********) and hasn't changed, keep the old one
    if (data.secretAccessKey === "********" && currentConfig) {
      data.secretAccessKey = currentConfig.secretAccessKey;
    }

    await saveS3Config(data as S3Config);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save config" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
