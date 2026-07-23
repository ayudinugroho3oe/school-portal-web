import { cmsSingletonRead, cmsSingletonUpdate } from "@/modules/school-content/presentation/route-handlers";
import { schoolIdentityUpdateSchema } from "@/modules/school-content/validation/schemas";
export const GET = (request: Request) => cmsSingletonRead(request, "identity");
export const PUT = (request: Request) => cmsSingletonUpdate(request, "identity", schoolIdentityUpdateSchema);
