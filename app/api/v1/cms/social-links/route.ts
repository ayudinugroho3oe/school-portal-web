import { socialLinkService } from "@/modules/configuration/application/services";
import { createConfiguration, listConfiguration } from "@/modules/configuration/presentation/route-handlers";
import { socialLinkCreateSchema } from "@/modules/configuration/validation/schemas";

export const GET = (request: Request) => listConfiguration(request, socialLinkService);
export const POST = (request: Request) => createConfiguration(request, socialLinkService, socialLinkCreateSchema);
