import type { SchoolScopedEntity } from "@/modules/cms/domain/contracts";

export type ContactChannel = SchoolScopedEntity & {
  typeCode: string;
  label: string;
  value: string;
  url: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type SocialLink = SchoolScopedEntity & {
  platformCode: string;
  label: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
};

export type CallToAction = SchoolScopedEntity & {
  code: string;
  label: string;
  targetUrl: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ConfigurationList<T> = {
  items: readonly T[];
  collectionUpdatedAt: string | null;
};

export type ReorderInput = {
  ids: readonly string[];
  expectedCollectionUpdatedAt: string;
  actorUserId: string;
};
