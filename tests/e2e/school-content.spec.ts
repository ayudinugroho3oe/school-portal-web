import { expect, test } from "@playwright/test";

test("School Identity and Profile CMS lifecycle and public snapshot APIs", async ({ page, request }) => {
  expect((await request.get("/api/v1/cms/school-identity")).status()).toBe(401);
  const email=process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL,password=process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD;
  if(!email||!password)throw new Error("Test credentials unavailable");
  let signIn=await page.request.post("/api/auth/sign-in/email",{data:{email,password}});
  if(signIn.status()===429){const wait=Math.min(Number(signIn.headers()["retry-after"]??10),60);await page.waitForTimeout(wait*1000+100);signIn=await page.request.post("/api/auth/sign-in/email",{data:{email,password}});}
  expect(signIn.status()).toBe(200);
  const identity=(await (await page.request.get("/api/v1/cms/school-identity")).json()).data;
  const updateIdentity=await page.request.put("/api/v1/cms/school-identity",{data:{schoolName:identity.schoolName,shortName:identity.shortName,tagline:identity.tagline,logoMediaId:identity.logoMediaId,logoDarkMediaId:identity.logoDarkMediaId,faviconMediaId:identity.faviconMediaId,expectedUpdatedAt:identity.updatedAt}});
  expect(updateIdentity.status()).toBe(200);const savedIdentity=(await updateIdentity.json()).data;
  expect((await page.request.post("/api/v1/cms/school-identity/publish",{data:{expectedUpdatedAt:savedIdentity.updatedAt}})).status()).toBe(200);
  expect((await request.get("/api/v1/public/school-identity")).status()).toBe(200);
  const profile=(await (await page.request.get("/api/v1/cms/school-profile")).json()).data;
  const updateProfile=await page.request.put("/api/v1/cms/school-profile",{data:{summary:profile.summary,history:profile.history,vision:profile.vision||"Visi sekolah",mission:profile.mission||"Misi sekolah",principalName:profile.principalName,principalPhotoMediaId:profile.principalPhotoMediaId,principalGreeting:profile.principalGreeting,valuesJson:profile.valuesJson,expectedUpdatedAt:profile.updatedAt}});
  expect(updateProfile.status()).toBe(200);const savedProfile=(await updateProfile.json()).data;
  expect((await page.request.post("/api/v1/cms/school-profile/publish",{data:{expectedUpdatedAt:savedProfile.updatedAt}})).status()).toBe(200);
  expect((await request.get("/api/v1/public/school-profile")).status()).toBe(200);
  const current=(await (await page.request.get("/api/v1/cms/school-profile")).json()).data;
  expect((await page.request.post("/api/v1/cms/school-profile/unpublish",{data:{expectedUpdatedAt:current.updatedAt}})).status()).toBe(200);
  expect((await request.get("/api/v1/public/school-profile")).status()).toBe(404);
});
