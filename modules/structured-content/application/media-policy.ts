import { ApplicationError } from "@/modules/cms/domain/errors";
import type { MediaAssetRepository } from "@/modules/media/domain/repository";

export async function requireUsableMedia(repository:MediaAssetRepository, schoolId:string, mediaId:string|null|undefined) {
  if (!mediaId) return;
  const media = await repository.findById(schoolId,mediaId);
  if (!media) throw new ApplicationError("MEDIA_NOT_FOUND",422,"The selected media does not belong to this School.");
  if (!(["ACTIVE","READY"] as const).includes(media.status as "ACTIVE"|"READY")) throw new ApplicationError("MEDIA_NOT_USABLE",422,"The selected media is not active or ready.");
}
