export class SchoolRootError extends Error {
  constructor(
    public readonly code: "SCHOOL_ROOT_NOT_FOUND" | "AMBIGUOUS_SCHOOL_ROOT" | "SCHOOL_SETTINGS_CONFLICT",
    message: string,
  ) {
    super(message);
    this.name = "SchoolRootError";
  }
}

export const schoolRootNotFound = () => new SchoolRootError(
  "SCHOOL_ROOT_NOT_FOUND",
  "The canonical School root has not been provisioned.",
);

export const ambiguousSchoolRoot = () => new SchoolRootError(
  "AMBIGUOUS_SCHOOL_ROOT",
  "The installation does not have exactly one unambiguous canonical School root.",
);

export const schoolSettingsConflict = () => new SchoolRootError(
  "SCHOOL_SETTINGS_CONFLICT",
  "SchoolSettings is linked to a different canonical School root.",
);
