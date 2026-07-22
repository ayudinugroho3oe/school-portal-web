import { randomUUID } from "node:crypto";

export function generateMediaStorageKey(schoolId: string, extension: string, now = new Date(), assetId = randomUUID()) {
  if (!/^[0-9a-f-]{36}$/i.test(schoolId) || !/^(?:jpg|jpeg|png|webp)$/.test(extension)) throw new Error("Invalid storage key input.");
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `schools/${schoolId}/${year}/${month}/${assetId}/original.${extension}`;
}
