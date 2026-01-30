import { expect, test } from "@playwright/test";

test("Slideshow speed increases on double space press", async ({ page }) => {
  await page.goto("/");

  // Wait for gallery to load (specifically in the horizontal view)
  const visibleItem = page
    .locator(".horizontal-scroll-view .gallery-item-multi")
    .first();
  await visibleItem.waitFor({ state: "visible" });

  // Verify Branding
  await expect(page).toHaveTitle(/June Flowers/);

  // Ensure we are in horizontal mode (default)
  const container = page.locator(".horizontal-scroll-view");
  await expect(container).toBeVisible();

  // 1. Start slideshow with single space
  await page.keyboard.press("Space");

  // Wait a bit for acceleration/start
  await page.waitForTimeout(500);

  // Measure distance over 1 second
  const scrollBefore = await container.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1000);
  const scrollAfter = await container.evaluate((el) => el.scrollLeft);

  const distanceNormal = scrollAfter - scrollBefore;
  console.log(`Normal speed distance: ${distanceNormal}`);

  // Stop slideshow
  await page.keyboard.press("Space");
  await page.waitForTimeout(500); // Wait for stop

  // 2. Double press space for 3x speed
  await page.keyboard.press("Space");
  await page.waitForTimeout(50); // Short delay < 300ms
  await page.keyboard.press("Space");

  // Wait a bit for start
  await page.waitForTimeout(500);

  // Measure distance over 1 second
  const scrollBeforeFast = await container.evaluate((el) => el.scrollLeft);
  await page.waitForTimeout(1000);
  const scrollAfterFast = await container.evaluate((el) => el.scrollLeft);

  const distanceFast = scrollAfterFast - scrollBeforeFast;
  console.log(`Fast speed distance: ${distanceFast}`);

  // Verify fast distance is significantly larger (approx 3x)
  // Allow some margin of error
  expect(distanceFast).toBeGreaterThan(distanceNormal * 2);
  expect(distanceFast).toBeLessThan(distanceNormal * 5);
});
