import { CanonicalSchoolContextResolver } from "@/modules/cms/infrastructure/school-context-resolver";
import { PrismaSchoolContentRepository } from "../infrastructure/prisma-repository";
import { SchoolContentService } from "./service";

export const schoolContentService = new SchoolContentService(new PrismaSchoolContentRepository(), new CanonicalSchoolContextResolver());
