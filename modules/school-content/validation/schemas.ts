import { z } from "zod";

const nullableUuid = z.string().uuid().nullable().optional();
const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();
const concurrency = { expectedUpdatedAt: z.string().datetime({ offset: true }) };

export const schoolIdentityUpdateSchema = z.strictObject({
  schoolName: z.string().trim().min(1).max(160),
  shortName: nullableText(80),
  tagline: nullableText(150),
  logoMediaId: nullableUuid,
  logoDarkMediaId: nullableUuid,
  faviconMediaId: nullableUuid,
  ...concurrency,
});

export const schoolProfileUpdateSchema = z.strictObject({
  summary: nullableText(500),
  history: nullableText(10000),
  vision: z.string().trim().min(1).max(5000),
  mission: z.string().trim().min(1).max(5000),
  principalName: nullableText(120),
  principalPhotoMediaId: nullableUuid,
  principalGreeting: nullableText(5000),
  valuesJson: z.array(z.string().trim().min(1).max(160)).max(30).nullable().optional(),
  ...concurrency,
});

export type SchoolIdentityUpdate = z.infer<typeof schoolIdentityUpdateSchema>;
export type SchoolProfileUpdate = z.infer<typeof schoolProfileUpdateSchema>;
