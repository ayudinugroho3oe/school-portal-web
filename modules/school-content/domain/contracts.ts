import type { SchoolIdentityUpdate, SchoolProfileUpdate } from "../validation/schemas";

export type SingletonKind = "identity" | "profile";
export interface SchoolContentRepository {
  read(kind: SingletonKind, schoolId: string): Promise<unknown | null>;
  updateIdentity(schoolId: string, actorUserId: string, requestId: string, input: SchoolIdentityUpdate): Promise<unknown>;
  updateProfile(schoolId: string, actorUserId: string, requestId: string, input: SchoolProfileUpdate): Promise<unknown>;
}
