import{CanonicalSchoolContextResolver}from"@/modules/cms/infrastructure/school-context-resolver";
import{PrismaPublishingRepository}from"../infrastructure/prisma-publishing-repository";
import{PublicPublishingService,PublishingApplicationService}from"./service";

const repository=new PrismaPublishingRepository();const resolver=new CanonicalSchoolContextResolver();
export const publishingService=new PublishingApplicationService(repository,resolver);
export const publicPublishingService=new PublicPublishingService(repository,resolver);
