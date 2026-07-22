export type ApplicationErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "STALE_UPDATE"
  | "DUPLICATE_CODE"
  | "INVALID_CONFIGURATION"
  | "DEPENDENCY_UNAVAILABLE";

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode | (string & {}),
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export const unauthenticated = () => new ApplicationError("UNAUTHENTICATED", 401, "Authentication is required.");
export const forbidden = () => new ApplicationError("FORBIDDEN", 403, "You do not have permission for this action.");
export const entityNotFound = () => new ApplicationError("NOT_FOUND", 404, "The requested resource was not found.");
export const staleUpdate = () => new ApplicationError("STALE_UPDATE", 409, "The resource changed. Reload and try again.");
export const duplicateCode = () => new ApplicationError("DUPLICATE_CODE", 409, "The configuration code is already in use.");
export const invalidConfiguration = (details?: unknown) => new ApplicationError(
  "INVALID_CONFIGURATION",
  422,
  "The configuration is not supported.",
  details,
);
