export type UserRole = "admin" | "user";

export const DEFAULT_USER_ROLE: UserRole = "user";

export function isAdminRole(role: unknown): role is "admin" {
  return role === "admin";
}

export function normalizeUserRole(role: unknown): UserRole {
  return role === "admin" ? "admin" : "user";
}
