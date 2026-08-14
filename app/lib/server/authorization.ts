import { ApiError, type AuthenticatedProfile, supabaseRequest } from "./supabase";

export type Permission =
  | "problem.create" | "problem.update" | "problem.publish" | "problem.manage_topics" | "problem.manage_testcases" | "problem.delete"
  | "submission.view_all" | "submission.view_source" | "user.view" | "user.suspend" | "user.manage_roles"
  | "moderation.basic" | "content.view_management" | "roadmap.manage" | "lesson.manage" | "quiz.manage"
  | "duel.review" | "mastery.configure" | "settings.manage" | "audit.view";

export const ADMIN_DEFAULTS: Permission[] = ["problem.create", "problem.update", "problem.publish", "problem.manage_topics", "problem.manage_testcases", "submission.view_all", "submission.view_source", "user.view", "moderation.basic", "content.view_management"];
export const OWNER_ONLY: Permission[] = ["problem.delete", "user.suspend", "user.manage_roles", "roadmap.manage", "lesson.manage", "quiz.manage", "duel.review", "mastery.configure", "settings.manage", "audit.view"];

export async function permissionsFor(profile: AuthenticatedProfile) {
  if (profile.role === "owner") return new Set<Permission>([...ADMIN_DEFAULTS, ...OWNER_ONLY]);
  if (profile.role !== "admin") return new Set<Permission>();
  const rows = await supabaseRequest<Array<{ permission: Permission }>>(`/rest/v1/admin_permissions?user_id=eq.${encodeURIComponent(profile.id)}&select=permission`, { mode: "service" });
  return new Set<Permission>([...ADMIN_DEFAULTS, ...rows.map((row) => row.permission)]);
}

export async function requirePermission(profile: AuthenticatedProfile, permission: Permission) {
  const permissions = await permissionsFor(profile);
  if (!permissions.has(permission)) throw new ApiError(403, "Permission denied.", "PERMISSION_DENIED");
  return permissions;
}
