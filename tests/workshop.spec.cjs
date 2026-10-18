const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/labs/scene-workshop/");
  await expect.poll(() => page.evaluate(() => Boolean(window.__THUNDER_LABS_READY))).toBe(true);
});

test("bundled libraries initialize without external script tags", async ({ page }) => {
  const runtime = await page.evaluate(() => ({
    konva: typeof window.Konva,
    phaser: typeof window.Phaser,
    howler: typeof window.Howl,
    objects: window.THUNDER_LABS.getState().objects,
    scripts: Array.from(document.querySelectorAll("script[src]")).length
  }));
  expect(runtime).toMatchObject({ konva: "object", phaser: "object", howler: "function", objects: 4, scripts: 0 });
  await expect(page.locator("#error")).toBeHidden();
});

test("forge adds objects and undo restores scene", async ({ page }) => {
  await expect(page.getByTestId("object-count")).toHaveText("4");
  await page.locator('[data-add="tree"]').click();
  await expect(page.getByTestId("object-count")).toHaveText("5");
  await page.locator("#undoButton").click();
  await expect(page.getByTestId("object-count")).toHaveText("4");
});

test("JSON export includes latest scene", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#jsonButton").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("THUNDER_SCENE.json");
  await expect(page.getByTestId("status")).toContainText("EXPORTED");
});

test("Phaser simulation responds to WASD and reset", async ({ page }) => {
  await page.locator('#tabDrive').click();
  await expect(page.locator("#phaserMount canvas")).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(window.THUNDER_LABS.getState().mode === "drive"))).toBe(true);
  await page.keyboard.down("w");
  await page.waitForTimeout(850);
  await page.keyboard.up("w");
  await expect.poll(() => page.evaluate(() => window.THUNDER_LABS.getState().speed)).toBeGreaterThan(0);
  await page.locator("#resetDrive").click();
  await expect.poll(() => page.evaluate(() => window.THUNDER_LABS.getState().speed)).toBe(0);
});

test("Howler only starts after user opt-in", async ({ page }) => {
  await expect(page.locator("#audioToggle")).toHaveAttribute("aria-pressed", "false");
  await page.locator("#audioToggle").click();
  await expect(page.locator("#audioToggle")).toHaveAttribute("aria-pressed", "true");
  await page.locator("#audioToggle").click();
  await expect(page.locator("#audioToggle")).toHaveAttribute("aria-pressed", "false");
});
