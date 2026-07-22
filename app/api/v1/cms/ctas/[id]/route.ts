import { callToActionService } from "@/modules/configuration/application/services";
import { updateConfiguration } from "@/modules/configuration/presentation/route-handlers";
import { callToActionUpdateSchema } from "@/modules/configuration/validation/schemas";

export async function PATCH(request: Request, context: RouteContext<"/api/v1/cms/ctas/[id]">) {
  return updateConfiguration(request, (await context.params).id, callToActionService, callToActionUpdateSchema);
}
