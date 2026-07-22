import { CanonicalSchoolContextResolver } from "@/modules/cms/infrastructure/school-context-resolver";
import { ConfigurationApplicationService, validateContactChannelUpdate } from "./service";
import {
  PrismaCallToActionRepository,
  PrismaContactChannelRepository,
  PrismaSocialLinkRepository,
} from "../infrastructure/prisma-repositories";

const schoolResolver = new CanonicalSchoolContextResolver();

export const contactChannelService = new ConfigurationApplicationService(
  new PrismaContactChannelRepository(),
  schoolResolver,
  { read: "cms.configuration.read", manage: "cms.contact_channel.manage" },
  validateContactChannelUpdate,
);

export const socialLinkService = new ConfigurationApplicationService(
  new PrismaSocialLinkRepository(),
  schoolResolver,
  { read: "cms.configuration.read", manage: "cms.social_link.manage" },
);

export const callToActionService = new ConfigurationApplicationService(
  new PrismaCallToActionRepository(),
  schoolResolver,
  { read: "cms.configuration.read", manage: "cms.cta.manage" },
);
