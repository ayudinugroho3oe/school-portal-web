import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { duplicateCode, entityNotFound, staleUpdate } from "@/modules/cms/domain/errors";
import type { CreateMediaMetadata, MediaAssetRepository } from "../domain/repository";
import type { MediaStatus } from "../domain/types";

const select = { id:true, schoolId:true, storageProvider:true, storageKey:true, originalFilename:true, mimeType:true, sizeBytes:true, width:true, height:true, altText:true, caption:true, checksum:true, status:true, createdBy:true, createdAt:true, updatedAt:true } as const;

export class PrismaMediaAssetRepository implements MediaAssetRepository {
  list(schoolId: string, status?: MediaStatus) {
    return prisma.mediaAsset.findMany({ where: { schoolId, ...(status ? { status } : {}) }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select });
  }
  findById(schoolId: string, id: string) { return prisma.mediaAsset.findFirst({ where: { schoolId, id }, select }); }
  findByChecksum(schoolId: string, checksum: string) { return prisma.mediaAsset.findFirst({ where: { schoolId, checksum, status: "ACTIVE" }, select }); }
  async create(schoolId: string, input: CreateMediaMetadata) {
    try { return await prisma.mediaAsset.create({ data: { ...input, schoolId }, select }); }
    catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw duplicateCode(); throw error; }
  }
  async updateMetadata(schoolId: string, id: string, expectedUpdatedAt: Date, altText: string | null, caption: string | null) {
    const result = await prisma.mediaAsset.updateMany({ where: { schoolId, id, updatedAt: expectedUpdatedAt }, data: { altText, caption } });
    if (!result.count) await this.updateFailure(schoolId, id);
    return (await this.findById(schoolId, id))!;
  }
  async setStatus(schoolId: string, id: string, expectedUpdatedAt: Date, status: MediaStatus) {
    const result = await prisma.mediaAsset.updateMany({ where: { schoolId, id, updatedAt: expectedUpdatedAt }, data: { status } });
    if (!result.count) await this.updateFailure(schoolId, id);
    return (await this.findById(schoolId, id))!;
  }
  private async updateFailure(schoolId: string, id: string): Promise<never> {
    if (!(await this.findById(schoolId, id))) throw entityNotFound();
    throw staleUpdate();
  }
}
