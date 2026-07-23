import { publicSingletonRead } from "@/modules/school-content/presentation/route-handlers";
export const GET = (request: Request) => publicSingletonRead(request, "profile");
