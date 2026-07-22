export const roles = ["SUPER_ADMIN", "SCHOOL_ADMIN", "STAFF", "TEACHER"] as const;
export type AppRole = (typeof roles)[number];
export type Permission =
  | "school_settings.initialize"
  | "school_settings.read"
  | "school_settings.update"
  | "cms.configuration.read"
  | "cms.contact_channel.manage"
  | "cms.social_link.manage"
  | "cms.cta.manage"
  | "cms.media.view"
  | "cms.media.create"
  | "cms.media.edit"
  | "cms.media.archive"
  | "cms.media.delete"
  | "cms.media.manage_media"
  | "cms.program.view" | "cms.program.create" | "cms.program.edit" | "cms.program.publish" | "cms.program.archive" | "cms.program.delete" | "cms.program.reorder"
  | "cms.teacher.view" | "cms.teacher.create" | "cms.teacher.edit" | "cms.teacher.publish" | "cms.teacher.archive" | "cms.teacher.delete" | "cms.teacher.reorder"
  | "cms.gallery.view" | "cms.gallery.create" | "cms.gallery.edit" | "cms.gallery.publish" | "cms.gallery.archive" | "cms.gallery.delete" | "cms.gallery.reorder"
  | "cms.testimonial.view" | "cms.testimonial.create" | "cms.testimonial.edit" | "cms.testimonial.publish" | "cms.testimonial.archive" | "cms.testimonial.delete" | "cms.testimonial.reorder";
export type Actor = { id: string; role: AppRole };

const structuredContentAdminPermissions: readonly Permission[] = [
  "cms.program.view", "cms.program.create", "cms.program.edit", "cms.program.publish", "cms.program.archive", "cms.program.reorder",
  "cms.teacher.view", "cms.teacher.create", "cms.teacher.edit", "cms.teacher.publish", "cms.teacher.archive", "cms.teacher.reorder",
  "cms.gallery.view", "cms.gallery.create", "cms.gallery.edit", "cms.gallery.publish", "cms.gallery.archive", "cms.gallery.reorder",
  "cms.testimonial.view", "cms.testimonial.create", "cms.testimonial.edit", "cms.testimonial.publish", "cms.testimonial.archive", "cms.testimonial.reorder",
];
const structuredContentDeletePermissions: readonly Permission[] = ["cms.program.delete", "cms.teacher.delete", "cms.gallery.delete", "cms.testimonial.delete"];

const grants: Record<AppRole, readonly Permission[]> = {
  SUPER_ADMIN: ["school_settings.initialize", "school_settings.read", "school_settings.update", "cms.configuration.read", "cms.contact_channel.manage", "cms.social_link.manage", "cms.cta.manage", "cms.media.view", "cms.media.create", "cms.media.edit", "cms.media.archive", "cms.media.delete", "cms.media.manage_media", ...structuredContentAdminPermissions, ...structuredContentDeletePermissions],
  SCHOOL_ADMIN: ["school_settings.read", "school_settings.update", "cms.configuration.read", "cms.contact_channel.manage", "cms.social_link.manage", "cms.cta.manage", "cms.media.view", "cms.media.create", "cms.media.edit", "cms.media.archive", "cms.media.manage_media", ...structuredContentAdminPermissions],
  STAFF: ["school_settings.read"],
  TEACHER: [],
};

export const can = (role: AppRole, permission: Permission) => grants[role].includes(permission);
