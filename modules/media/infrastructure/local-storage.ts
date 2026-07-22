import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import type { MediaStorage, StoredObjectMetadata } from "../domain/storage";

export class LocalMediaStorage implements MediaStorage {
  readonly provider = "LOCAL";
  private readonly root: string;

  constructor(rootDirectory = resolve(process.cwd(), "public", "uploads")) {
    this.root = resolve(rootDirectory);
  }

  async upload(key: string, bytes: Uint8Array, contentType: string) {
    void contentType;
    const path = this.pathFor(key);
    if (await this.exists(key)) throw new Error("Storage key already exists.");
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(path, bytes, { flag: "wx" });
  }

  async delete(key: string) {
    await rm(this.pathFor(key), { force: true });
  }

  async exists(key: string) {
    try { return (await stat(this.pathFor(key))).isFile(); } catch { return false; }
  }

  async metadata(key: string): Promise<StoredObjectMetadata | null> {
    try {
      const sizeBytes = (await stat(this.pathFor(key))).size;
      const bytes = await readFile(this.pathFor(key));
      const contentType = bytes[0] === 0x89 ? "image/png" : String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" ? "image/webp" : "image/jpeg";
      return { sizeBytes, contentType };
    } catch { return null; }
  }

  async resolveUrl(key: string) {
    this.pathFor(key);
    return `/uploads/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  private pathFor(key: string) {
    if (!/^[a-zA-Z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/.test(key)) throw new Error("Unsafe storage key.");
    const path = resolve(this.root, ...key.split("/"));
    if (!path.startsWith(`${this.root}${sep}`)) throw new Error("Storage key escapes the media root.");
    return path;
  }
}
