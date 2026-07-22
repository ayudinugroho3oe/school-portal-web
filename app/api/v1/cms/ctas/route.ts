import { callToActionService } from "@/modules/configuration/application/services";
import { createConfiguration, listConfiguration } from "@/modules/configuration/presentation/route-handlers";
import { callToActionCreateSchema } from "@/modules/configuration/validation/schemas";

export const GET = (request: Request) => listConfiguration(request, callToActionService);
export const POST = (request: Request) => createConfiguration(request, callToActionService, callToActionCreateSchema);
