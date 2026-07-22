import { ApplicationError } from "@/modules/cms/domain/errors";

export class DomainError extends ApplicationError {}

export const unauthenticated = () => new DomainError("UNAUTHENTICATED", 401, "Authentication is required.");
export const forbidden = () => new DomainError("FORBIDDEN", 403, "You do not have permission for this action.");
export const notFound = () => new DomainError("SCHOOL_SETTINGS_NOT_FOUND", 404, "School settings have not been initialized.");
export const alreadyInitialized = () => new DomainError("SCHOOL_SETTINGS_ALREADY_INITIALIZED", 409, "School settings are already initialized.");
export const staleUpdate = () => new DomainError("STALE_UPDATE", 409, "School settings were changed by another user. Reload and try again.");
