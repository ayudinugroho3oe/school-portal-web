import { expect, test } from "@playwright/test";

test("Super Admin login, session protection, and logout use the real database", async ({ page, request }) => {
  const email = process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Bootstrap Super Admin credentials are unavailable in the local test environment.");

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Masuk ke Admin" })).toBeVisible();
  const unauthorized = await request.get("/api/v1/school-settings");
  expect(unauthorized.status()).toBe(401);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata sandi").fill(`${password}-wrong`);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page.getByRole("alert")).toBeVisible();

  await page.getByLabel("Kata sandi").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "School Management System" })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/admin$/);

  const settingsResponse = await page.request.get("/api/v1/school-settings");
  expect(settingsResponse.status()).toBe(200);
  const settingsBody = await settingsResponse.json();
  const originalMotto = settingsBody.data.schoolMotto;
  const firstToken = settingsBody.data.updatedAt;
  const updateResponse = await page.request.patch("/api/v1/school-settings", { data: { schoolMotto: "Runtime verification", expectedUpdatedAt: firstToken } });
  expect(updateResponse.status()).toBe(200);
  const updatedBody = await updateResponse.json();
  const conflictResponse = await page.request.patch("/api/v1/school-settings", { data: { schoolMotto: "Stale write", expectedUpdatedAt: firstToken } });
  expect(conflictResponse.status()).toBe(409);
  const restoreResponse = await page.request.patch("/api/v1/school-settings", { data: { schoolMotto: originalMotto, expectedUpdatedAt: updatedBody.data.updatedAt } });
  expect(restoreResponse.status()).toBe(200);
  const restoredBody = await restoreResponse.json();
  const noOpResponse = await page.request.patch("/api/v1/school-settings", { data: { schoolMotto: originalMotto, expectedUpdatedAt: restoredBody.data.updatedAt } });
  expect(noOpResponse.status()).toBe(200);

  await page.goto("/admin/settings/school");
  await expect(page.getByRole("heading", { name: "Identitas Sekolah" })).toBeVisible();
  await page.goto("/admin/settings/school/setup");
  await expect(page).toHaveURL(/\/admin\/settings\/school$/);

  await page.getByRole("button", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/, { timeout: 15_000 });
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
