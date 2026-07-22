import { expect, test } from "@playwright/test";

test("Configuration APIs enforce auth, validation, lifecycle, and ordering", async ({ page, request }) => {
  const email = process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Bootstrap Super Admin credentials are unavailable in the local test environment.");

  expect((await request.get("/api/v1/cms/contact-channels")).status()).toBe(401);

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata sandi").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  const massAssignment = await page.request.post("/api/v1/cms/contact-channels", { data: {
    typeCode: "EMAIL",
    label: "Email",
    value: "school@example.invalid",
    schoolId: crypto.randomUUID(),
  } });
  expect(massAssignment.status()).toBe(422);

  const contactResponse = await page.request.post("/api/v1/cms/contact-channels", { data: {
    typeCode: "EMAIL",
    label: "Email",
    value: "school@example.invalid",
    url: "mailto:school@example.invalid",
  } });
  expect(contactResponse.status()).toBe(201);
  const contact = (await contactResponse.json()).data;
  expect(contact.schoolId).toBeTruthy();

  const duplicate = await page.request.post("/api/v1/cms/contact-channels", { data: {
    typeCode: "EMAIL",
    label: "Other Email",
    value: "other@example.invalid",
  } });
  expect(duplicate.status()).toBe(409);
  expect((await duplicate.json()).error.code).toBe("DUPLICATE_CODE");

  const unknownSocial = await page.request.post("/api/v1/cms/social-links", { data: {
    platformCode: "UNKNOWN",
    label: "Unknown",
    url: "https://example.com",
  } });
  expect(unknownSocial.status()).toBe(422);

  const socialResponse = await page.request.post("/api/v1/cms/social-links", { data: {
    platformCode: "INSTAGRAM",
    label: "Instagram",
    url: "https://instagram.com/example",
  } });
  expect(socialResponse.status()).toBe(201);

  const ctaOneResponse = await page.request.post("/api/v1/cms/ctas", { data: { code: "ONE", label: "One", targetUrl: "/one", sortOrder: 0 } });
  const ctaTwoResponse = await page.request.post("/api/v1/cms/ctas", { data: { code: "TWO", label: "Two", targetUrl: "/two", sortOrder: 1 } });
  expect(ctaOneResponse.status()).toBe(201);
  expect(ctaTwoResponse.status()).toBe(201);
  const ctaOne = (await ctaOneResponse.json()).data;
  const ctaTwo = (await ctaTwoResponse.json()).data;

  const update = await page.request.patch(`/api/v1/cms/ctas/${ctaOne.id}`, { data: {
    label: "Updated One",
    expectedUpdatedAt: ctaOne.updatedAt,
  } });
  expect(update.status()).toBe(200);
  const updated = (await update.json()).data;

  const deactivate = await page.request.patch(`/api/v1/cms/ctas/${ctaOne.id}`, { data: {
    isActive: false,
    expectedUpdatedAt: updated.updatedAt,
  } });
  expect(deactivate.status()).toBe(200);
  expect((await deactivate.json()).data.isActive).toBe(false);

  const listResponse = await page.request.get("/api/v1/cms/ctas");
  expect(listResponse.status()).toBe(200);
  const list = (await listResponse.json()).data;
  const reorder = await page.request.put("/api/v1/cms/ctas/order", { data: {
    ids: [ctaTwo.id, ctaOne.id],
    expectedCollectionUpdatedAt: list.collectionUpdatedAt,
  } });
  expect(reorder.status()).toBe(200);
  expect((await reorder.json()).data.items.map(({ id }: { id: string }) => id)).toEqual([ctaTwo.id, ctaOne.id]);
});
