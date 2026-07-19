export const roles = ["SUPER_ADMIN", "SCHOOL_ADMIN", "STAFF", "TEACHER"] as const;
export type AppRole = (typeof roles)[number];
export type Permission = "school_settings.initialize" | "school_settings.read" | "school_settings.update";
export type Actor = { id: string; role: AppRole };

const grants: Record<AppRole, readonly Permission[]> = {
  SUPER_ADMIN: ["school_settings.initialize", "school_settings.read", "school_settings.update"],
  SCHOOL_ADMIN: ["school_settings.read", "school_settings.update"],
  STAFF: ["school_settings.read"],
  TEACHER: [],
};

export const can = (role: AppRole, permission: Permission) => grants[role].includes(permission);
