import { expect, test } from "@playwright/test";

test("MuseumRedesign_2026-01-30", async ({ page, context }) => {
  // Navigate to URL
  await page.goto("http://localhost:4321");

  // Take screenshot
  await page.screenshot({
    path: "museum-homepage-initial.png",
    fullPage: true,
  });

  // Take screenshot
  await page.screenshot({
    path: "museum-homepage-scrolled.png",
    fullPage: true,
  });

  // Take screenshot
  await page.screenshot({
    path: "museum-homepage-deep-scroll.png",
    fullPage: true,
  });
});
