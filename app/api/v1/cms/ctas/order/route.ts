import { callToActionService } from "@/modules/configuration/application/services";
import { reorderConfiguration } from "@/modules/configuration/presentation/route-handlers";

export const PUT = (request: Request) => reorderConfiguration(request, callToActionService);
