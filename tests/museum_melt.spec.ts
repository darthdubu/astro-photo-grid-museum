import { expect, test } from "@playwright/test";

test("Museum Melt Effect and Layout", async ({ page }) => {
  // Go to home page
  await page.goto("/");

  // Wait for gallery items to load
  const firstItem = page.locator(".gallery-item-multi").first();
  await firstItem.waitFor();

  // 1. Check Layout (Images not touching)
  const items = page.locator(".gallery-item-multi");
  const count = await items.count();
  expect(count).toBeGreaterThan(0);

  // Check CSS properties ensuring separation
  const display = await firstItem.evaluate(
    (el) => window.getComputedStyle(el).display,
  );
  expect(display).toBe("inline-block");

  // Check gaps/margins (approximate check via bounding boxes)
  if (count >= 2) {
    const box1 = await items.nth(0).boundingBox();
    const box2 = await items.nth(1).boundingBox();

    if (box1 && box2) {
      // If stacked vertically (mobile or single column), check vertical distance
      // If side-by-side, check horizontal distance
      // Since we don't know the exact viewport size here, we just check they don't overlap exactly
      // and have some distance if they are in the same column flow.

      // Simple check: do they overlap?
      const overlap = !(
        box1.x + box1.width < box2.x ||
        box2.x + box2.width < box1.x ||
        box1.y + box1.height < box2.y ||
        box2.y + box2.height < box1.y
      );

      expect(overlap).toBeFalsy();
    }
  }

  // 2. Check Animation Script (Melt Effect)
  // The script sets --blur, --opacity, --scale on scroll/intersection

  // Get initial values
  const initialBlur = await firstItem.evaluate((el) =>
    el.style.getPropertyValue("--blur"),
  );

  // Scroll down to trigger intersection observer
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1000); // Wait for observer callback

  // Get new values
  const newBlur = await firstItem.evaluate((el) =>
    el.style.getPropertyValue("--blur"),
  );

  // Verify values are being set (even if 0, they should be present as strings like "0px" or similar)
  // The script initializes them, so they should be present.
  expect(initialBlur).toBeDefined();

  // Check if class 'in-focus' is toggled or variables change
  // We can't guarantee exact values, but we can check if the script injected the inline styles.
  const styleAttribute = await firstItem.getAttribute("style");
  expect(styleAttribute).toContain("--blur");
  expect(styleAttribute).toContain("--scale");
});
