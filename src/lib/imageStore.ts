import fs from "node:fs/promises";

const DATA_FILE = "images.json";

export interface ExifData {
  iso?: number;
  fStop?: number;
  shutterSpeed?: string;
  model?: string;
  make?: string;
  focalLength?: number;
  lensModel?: string;
  date?: string;
}

export interface ImageRecord {
  id: string;
  type: "local" | "upload";
  src: string; // Filename for local, Path for upload
  width?: number;
  height?: number;
  exif?: ExifData;
}

export interface Album {
  id: string;
  type: "album";
  title: string;
  description: string;
  coverImage?: ImageRecord;
  images: ImageRecord[];
}

export type GalleryItem = ImageRecord | Album;

export async function getImages(): Promise<GalleryItem[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function saveImages(images: GalleryItem[]) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(images, null, 2));
  } catch (error) {
    console.warn(
      "Failed to save images.json (filesystem might be read-only):",
      error,
    );
  }
}

export async function addImage(item: GalleryItem, albumId?: string) {
  const images = await getImages();

  if (albumId && item.type !== "album") {
    // Add image to specific album
    const album = images.find((i) => i.id === albumId && i.type === "album") as
      | Album
      | undefined;
    if (album) {
      album.images.unshift(item as ImageRecord);
      // Set as cover if none exists
      if (!album.coverImage) {
        album.coverImage = item as ImageRecord;
      }
    }
  } else {
    // Add to root
    images.unshift(item);
  }

  await saveImages(images);
}

export async function createAlbum(title: string, description: string) {
  const images = await getImages();
  const newAlbum: Album = {
    id: `album-${Date.now()}`,
    type: "album",
    title,
    description,
    images: [],
  };
  images.unshift(newAlbum);
  await saveImages(images);
}

export async function updateAlbum(id: string, data: Partial<Album>) {
  const images = await getImages();
  const albumIndex = images.findIndex((i) => i.id === id && i.type === "album");

  if (albumIndex !== -1) {
    const album = images[albumIndex] as Album;
    images[albumIndex] = { ...album, ...data };
    await saveImages(images);
  }
}

export async function deleteItem(id: string) {
  let images = await getImages();

  // Check if it's a root item (Album or Image)
  const isRootItem = images.some((i) => i.id === id);

  if (isRootItem) {
    images = images.filter((i) => i.id !== id);
  } else {
    // Search inside albums
    for (const item of images) {
      if (item.type === "album") {
        const album = item as Album;
        album.images = album.images.filter((img) => img.id !== id);
      }
    }
  }

  await saveImages(images);
}

export async function deleteItems(ids: string[]) {
  let images = await getImages();
  const idSet = new Set(ids);

  // Filter root items
  images = images.filter((i) => !idSet.has(i.id));

  // Filter items inside albums
  for (const item of images) {
    if (item.type === "album") {
      const album = item as Album;
      album.images = album.images.filter((img) => !idSet.has(img.id));
    }
  }

  await saveImages(images);
}

export async function updateImageOrder(newImages: GalleryItem[]) {
  await saveImages(newImages);
}
