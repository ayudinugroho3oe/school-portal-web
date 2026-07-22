import { contactChannelService } from "@/modules/configuration/application/services";
import { createConfiguration, listConfiguration } from "@/modules/configuration/presentation/route-handlers";
import { contactChannelCreateSchema } from "@/modules/configuration/validation/schemas";

export const GET = (request: Request) => listConfiguration(request, contactChannelService);
export const POST = (request: Request) => createConfiguration(request, contactChannelService, contactChannelCreateSchema);
