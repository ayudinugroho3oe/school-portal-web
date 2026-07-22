import { CanonicalSchoolContextResolver } from "@/modules/cms/infrastructure/school-context-resolver";
import { MediaApplicationService } from "./service";
import { LocalMediaStorage } from "../infrastructure/local-storage";
import { PrismaMediaAssetRepository } from "../infrastructure/prisma-repository";

export const mediaService = new MediaApplicationService(
  new PrismaMediaAssetRepository(),
  new LocalMediaStorage(),
  new CanonicalSchoolContextResolver(),
);
