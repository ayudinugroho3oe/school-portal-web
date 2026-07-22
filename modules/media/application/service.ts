import { createHash, randomUUID } from "node:crypto";
import type { Actor } from "@/lib/auth/permissions";
import { createCmsRequestContext, type SchoolContextResolver } from "@/modules/cms/application/context";
import { ApplicationError, entityNotFound } from "@/modules/cms/domain/errors";
import type { MediaAssetRepository } from "../domain/repository";
import type { MediaStorage } from "../domain/storage";
import type { MediaUpload } from "../domain/types";
import { generateMediaStorageKey } from "../infrastructure/storage-key";
import { mediaMetadataUpdateSchema, validateMediaUpload } from "../validation/schemas";

export class MediaApplicationService {
  constructor(
    private readonly repository: MediaAssetRepository,
    private readonly storage: MediaStorage,
    private readonly schoolResolver: SchoolContextResolver,
  ) {}

  async list(actor: Actor, requestId: string) {
    const context = await createCmsRequestContext(actor, "cms.media.view", requestId, this.schoolResolver);
    return this.repository.list(context.schoolId);
  }

  async read(actor: Actor, requestId: string, id: string) {
    const context = await createCmsRequestContext(actor, "cms.media.view", requestId, this.schoolResolver);
    const asset = await this.repository.findById(context.schoolId, id);
    if (!asset) throw entityNotFound();
    return asset;
  }

  async upload(actor: Actor, requestId: string, input: MediaUpload) {
    const context = await createCmsRequestContext(actor, "cms.media.create", requestId, this.schoolResolver);
    const validated = validateMediaUpload(input.filename, input.declaredMimeType, input.bytes);
    const checksum = createHash("sha256").update(input.bytes).digest("hex");
    if (await this.repository.findByChecksum(context.schoolId, checksum)) {
      throw new ApplicationError("DUPLICATE_MEDIA", 409, "This media file already exists.");
    }
    const id = randomUUID();
    const storageKey = generateMediaStorageKey(context.schoolId, validated.extension, new Date(), id);
    await this.storage.upload(storageKey, input.bytes, input.declaredMimeType);
    try {
      return await this.repository.create(context.schoolId, {
        id, schoolId: context.schoolId, storageProvider: this.storage.provider, storageKey,
        originalFilename: validated.safeFilename, mimeType: input.declaredMimeType,
        sizeBytes: input.bytes.byteLength, width: null, height: null,
        altText: input.altText?.trim() || null, caption: input.caption?.trim() || null,
        checksum, status: "ACTIVE", createdBy: context.actor.id,
      });
    } catch (error) {
      try { await this.storage.delete(storageKey); }
      catch { throw new ApplicationError("UPLOAD_COMPENSATION_FAILED", 503, "Media metadata failed and storage cleanup requires attention.", { cause: error instanceof Error ? error.name : "Unknown" }); }
      throw error;
    }
  }

  async updateMetadata(actor: Actor, requestId: string, id: string, raw: unknown) {
    const context = await createCmsRequestContext(actor, "cms.media.edit", requestId, this.schoolResolver);
    const input = mediaMetadataUpdateSchema.parse(raw);
    return this.repository.updateMetadata(context.schoolId, id, new Date(input.expectedUpdatedAt), input.altText, input.caption);
  }

  async archive(actor: Actor, requestId: string, id: string, expectedUpdatedAt: string) {
    const context = await createCmsRequestContext(actor, "cms.media.archive", requestId, this.schoolResolver);
    return this.repository.setStatus(context.schoolId, id, new Date(expectedUpdatedAt), "ARCHIVED");
  }

  async resolveUrl(actor: Actor, requestId: string, id: string) {
    const asset = await this.read(actor, requestId, id);
    if (asset.status !== "ACTIVE") throw new ApplicationError("MEDIA_NOT_ACTIVE", 409, "The media asset is not active.");
    return this.storage.resolveUrl(asset.storageKey);
  }
}
