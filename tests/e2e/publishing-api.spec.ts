import { expect, test } from "@playwright/test";

test("structured content publish, republish, unpublish, and public reads", async ({ page, request }) => {
  const email = process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Test credentials unavailable");

  expect((await request.get("/api/v1/cms/programs")).status()).toBe(401);

  let signIn = await page.request.post("/api/auth/sign-in/email", { data: { email, password } });
  if (signIn.status() === 429) {
    const retryAfterSeconds = Math.min(Number(signIn.headers()["retry-after"] ?? 10), 60);
    await page.waitForTimeout((retryAfterSeconds * 1_000) + 100);
    signIn = await page.request.post("/api/auth/sign-in/email", { data: { email, password } });
  }
  expect(signIn.status()).toBe(200);

  const suffix = crypto.randomUUID().slice(0, 8);
  const createdResponse = await page.request.post("/api/v1/cms/programs", { data: {
    code: `E2E_${suffix.toUpperCase()}`,
    title: "E2E Program",
    slug: `e2e-${suffix}`,
    summary: "Summary",
    description: "Description",
    sortOrder: 0,
    isActive: true,
  } });
  expect(createdResponse.status()).toBe(201);
  const created = (await createdResponse.json()).data;
  expect(created.status).toBe("DRAFT");

  const massAssignment = await page.request.post("/api/v1/cms/programs", { data: {
    code: "MASS",
    title: "Mass",
    slug: `mass-${suffix}`,
    summary: "S",
    description: "D",
    schoolId: crypto.randomUUID(),
  } });
  expect(massAssignment.status()).toBe(422);

  const publish = await page.request.post(`/api/v1/cms/programs/${created.id}/publish`, {
    data: { expectedUpdatedAt: created.updatedAt },
  });
  expect(publish.status()).toBe(200);
  expect((await publish.json()).data.version).toBe(1);

  const publicRead = await request.get(`/api/v1/public/programs/${created.id}`);
  expect(publicRead.status()).toBe(200);
  expect((await publicRead.json()).data.payload.title).toBe("E2E Program");

  const detail = (await (await page.request.get(`/api/v1/cms/programs/${created.id}`)).json()).data;
  const update = await page.request.patch(`/api/v1/cms/programs/${created.id}`, { data: {
    title: "E2E Program Updated",
    expectedUpdatedAt: detail.updatedAt,
  } });
  expect(update.status()).toBe(200);
  const updated = (await update.json()).data;

  const republish = await page.request.post(`/api/v1/cms/programs/${created.id}/publish`, {
    data: { expectedUpdatedAt: updated.updatedAt },
  });
  expect((await republish.json()).data.version).toBe(2);

  const current = (await (await page.request.get(`/api/v1/cms/programs/${created.id}`)).json()).data;
  const unpublish = await page.request.post(`/api/v1/cms/programs/${created.id}/unpublish`, {
    data: { expectedUpdatedAt: current.updatedAt },
  });
  expect(unpublish.status()).toBe(200);
  expect((await request.get(`/api/v1/public/programs/${created.id}`)).status()).toBe(404);
});
