import fs from "node:fs/promises";

const DATA_FILE = "images.json";

export interface ImageRecord {
  id: string;
  type: "local" | "upload";
  src: string; // Filename for local, Path for upload
  width?: number;
  height?: number;
}

export async function getImages(): Promise<ImageRecord[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function saveImages(images: ImageRecord[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(images, null, 2));
}

export async function addImage(image: ImageRecord) {
  const images = await getImages();
  images.unshift(image);
  await saveImages(images);
}

export async function updateImageOrder(newImages: ImageRecord[]) {
  await saveImages(newImages);
}
