import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { LocalMediaStorage } from "@/modules/media/infrastructure/local-storage";
import { generateMediaStorageKey } from "@/modules/media/infrastructure/storage-key";

const roots: string[] = [];
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe("local media storage", () => {
  it("uploads, inspects, resolves, and deletes", async () => {
    const root = await mkdtemp(join(tmpdir(), "media-test-")); roots.push(root);
    const storage = new LocalMediaStorage(root);
    const key = generateMediaStorageKey("11111111-1111-4111-8111-111111111111", "jpg", new Date("2026-07-20"), "22222222-2222-4222-8222-222222222222");
    await storage.upload(key, Uint8Array.from([0xff,0xd8,0xff]), "image/jpeg");
    expect(await storage.exists(key)).toBe(true);
    expect((await storage.metadata(key))?.contentType).toBe("image/jpeg");
    expect(await storage.resolveUrl(key)).toContain("/uploads/schools/");
    await expect(storage.upload(key, Uint8Array.from([1]), "image/jpeg")).rejects.toThrow();
    await storage.delete(key); expect(await storage.exists(key)).toBe(false);
  });
  it("uses isolated School namespaces and rejects traversal", async () => {
    const a = generateMediaStorageKey("11111111-1111-4111-8111-111111111111", "png");
    const b = generateMediaStorageKey("22222222-2222-4222-8222-222222222222", "png");
    expect(a).not.toBe(b);
    await expect(new LocalMediaStorage("unused").resolveUrl("../secret.jpg")).rejects.toThrow();
  });
});
