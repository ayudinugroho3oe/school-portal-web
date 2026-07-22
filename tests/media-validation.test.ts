import { describe, expect, it } from "vitest";
import { MAX_MEDIA_BYTES, validateMediaUpload } from "@/modules/media/validation/schemas";

const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xdb]);
const png = Uint8Array.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
const webp = Uint8Array.from([...Buffer.from("RIFF"), 0,0,0,0, ...Buffer.from("WEBP")]);

describe("media upload validation", () => {
  it.each([["photo.jpg", "image/jpeg", jpeg], ["photo.png", "image/png", png], ["photo.webp", "image/webp", webp]])("accepts %s", (name, mime, bytes) => {
    expect(validateMediaUpload(name, mime, bytes).extension).toBe(name.split(".").at(-1));
  });
  it.each([
    ["x.svg", "image/svg+xml", Uint8Array.from([1])], ["x.pdf", "application/pdf", Uint8Array.from([1])],
    ["x.html", "text/html", Uint8Array.from([1])], ["../x.jpg", "image/jpeg", jpeg],
    ["x.php.jpg", "image/jpeg", jpeg], ["x.jpg", "image/png", jpeg], ["x.jpg", "image/jpeg", new Uint8Array()],
  ])("rejects unsafe input %s", (name, mime, bytes) => expect(() => validateMediaUpload(name, mime, bytes)).toThrow());
  it("rejects oversized files", () => expect(() => validateMediaUpload("x.jpg", "image/jpeg", new Uint8Array(MAX_MEDIA_BYTES + 1))).toThrow());
});
