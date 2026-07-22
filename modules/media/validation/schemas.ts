import { z } from "zod";
import { ApplicationError } from "@/modules/cms/domain/errors";

export const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
const allowed = {
  "image/jpeg": { extension: ["jpg", "jpeg"], signature: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { extension: ["png"], signature: (b: Uint8Array) => b.length >= 8 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((v, i) => b[i] === v) },
  "image/webp": { extension: ["webp"], signature: (b: Uint8Array) => b.length >= 12 && String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP" },
} as const;

export const mediaIdSchema = z.string().uuid();
export const mediaMetadataUpdateSchema = z.strictObject({
  altText: z.string().trim().min(5).max(250).nullable(),
  caption: z.string().trim().max(500).nullable(),
  expectedUpdatedAt: z.string().datetime({ offset: true }),
});

export function validateMediaUpload(filename: string, declaredMimeType: string, bytes: Uint8Array) {
  if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) throw invalid("Unsafe filename.");
  const parts = filename.toLowerCase().split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) throw invalid("Unsafe or double file extension.");
  if (bytes.byteLength === 0) throw invalid("Empty files are not allowed.");
  if (bytes.byteLength > MAX_MEDIA_BYTES) throw new ApplicationError("PAYLOAD_TOO_LARGE", 413, "The file exceeds the media size limit.");
  const rule = allowed[declaredMimeType as keyof typeof allowed];
  if (!rule) throw new ApplicationError("UNSUPPORTED_MEDIA_TYPE", 415, "The media type is not supported.");
  if (!(rule.extension as readonly string[]).includes(parts[1]) || !rule.signature(bytes)) {
    throw new ApplicationError("UNSUPPORTED_MEDIA_TYPE", 415, "The file content does not match its declared type.");
  }
  return { extension: parts[1], safeFilename: `${parts[0].replace(/[^a-z0-9_-]+/g, "-").slice(0, 80)}.${parts[1]}` };
}

function invalid(message: string) {
  return new ApplicationError("VALIDATION_ERROR", 400, message);
}
