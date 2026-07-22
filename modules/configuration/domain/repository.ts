import type { SchoolId } from "@/modules/cms/domain/contracts";
import type { CallToAction, ConfigurationList, ContactChannel, ReorderInput, SocialLink } from "./types";

export interface ConfigurationRepository<TEntity, TCreate, TUpdate> {
  list(schoolId: SchoolId): Promise<ConfigurationList<TEntity>>;
  findById(schoolId: SchoolId, id: string): Promise<TEntity | null>;
  create(schoolId: SchoolId, actorUserId: string, input: TCreate): Promise<TEntity>;
  update(schoolId: SchoolId, id: string, actorUserId: string, expectedUpdatedAt: Date, input: TUpdate): Promise<TEntity>;
  setActive(schoolId: SchoolId, id: string, actorUserId: string, expectedUpdatedAt: Date, isActive: boolean): Promise<TEntity>;
  reorder(schoolId: SchoolId, input: ReorderInput): Promise<ConfigurationList<TEntity>>;
}

export type ContactChannelCreate = Omit<ContactChannel, "id" | "schoolId" | "createdAt" | "updatedAt">;
export type ContactChannelUpdate = Pick<ContactChannel, "label" | "value" | "url" | "sortOrder" | "isActive">;
export type SocialLinkCreate = Omit<SocialLink, "id" | "schoolId" | "createdAt" | "updatedAt">;
export type SocialLinkUpdate = Pick<SocialLink, "label" | "url" | "sortOrder" | "isActive">;
export type CallToActionCreate = Omit<CallToAction, "id" | "schoolId" | "createdAt" | "updatedAt">;
export type CallToActionUpdate = Pick<CallToAction, "label" | "targetUrl" | "description" | "sortOrder" | "isActive">;

export type ContactChannelRepository = ConfigurationRepository<ContactChannel, ContactChannelCreate, Partial<ContactChannelUpdate>>;
export type SocialLinkRepository = ConfigurationRepository<SocialLink, SocialLinkCreate, Partial<SocialLinkUpdate>>;
export type CallToActionRepository = ConfigurationRepository<CallToAction, CallToActionCreate, Partial<CallToActionUpdate>>;
