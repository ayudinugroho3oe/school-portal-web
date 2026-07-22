import { expect, test } from "@playwright/test";

for (const route of ["/", "/profil", "/program", "/galeri", "/guru", "/kontak"]) {
  test(`public route ${route} renders with database-backed fallback`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main").last()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link").first()).toBeVisible();
  });
}
