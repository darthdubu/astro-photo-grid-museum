import type { APIRoute } from "astro";
import { getImages, saveImages } from "../../lib/imageStore";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids)) {
      return new Response(JSON.stringify({ error: "Invalid IDs" }), {
        status: 400,
      });
    }

    const currentImages = await getImages();

    // Create a map for quick lookup
    const imageMap = new Map(currentImages.map((img) => [img.id, img]));

    // Reconstruct the array based on the new order of IDs
    // Only include IDs that actually exist in the current store
    const newImages = ids
      .map((id) => imageMap.get(id))
      .filter((img) => img !== undefined);

    // If there are images not in the IDs list (e.g. newly added while reordering), append them?
    // Or just strictly follow IDs. Strictly following is safer for reorder logic.
    // However, if we missed some, we might delete them accidentally.
    // Let's ensure we keep any that weren't mentioned (append at end).
    const sentIds = new Set(ids);
    const missingImages = currentImages.filter((img) => !sentIds.has(img.id));

    const finalImages = [...newImages, ...missingImages];

    await saveImages(finalImages);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Reorder error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
