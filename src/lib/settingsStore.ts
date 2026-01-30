import fs from "node:fs/promises";

const SETTINGS_FILE = "settings.json";

export interface GallerySettings {
  minHeight: number;
  gap: number;
  wideAspectRatioThreshold: number;
  tallAspectRatioThreshold: number;
  largeImageMinHeight: number;
}

export interface Settings {
  password?: string;
  gallery: GallerySettings;
}

const DEFAULT_SETTINGS: Settings = {
  gallery: {
    minHeight: 200,
    gap: 4,
    wideAspectRatioThreshold: 1.5,
    tallAspectRatioThreshold: 0.6,
    largeImageMinHeight: 300,
  },
};

export async function getSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      gallery: { ...DEFAULT_SETTINGS.gallery, ...parsed.gallery },
    };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings) {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function updatePassword(password: string) {
  const settings = await getSettings();
  settings.password = password;
  await saveSettings(settings);
}

export async function updateGallerySettings(gallerySettings: GallerySettings) {
  const settings = await getSettings();
  settings.gallery = gallerySettings;
  await saveSettings(settings);
}
