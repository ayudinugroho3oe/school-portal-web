import { cmsSingletonLifecycle } from "@/modules/school-content/presentation/route-handlers";
export const GET = (request: Request) => cmsSingletonLifecycle(request, "identity", "status");
