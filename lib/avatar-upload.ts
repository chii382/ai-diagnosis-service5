export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const AVATAR_API_PATH = "/api/user/profile/avatar";

export const AVATAR_ALLOWED_MIME: Record<string, "jpg" | "png" | "webp" | "gif"> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function buildAvatarImageUrl(updatedAt: Date = new Date()): string {
  return `${AVATAR_API_PATH}?v=${updatedAt.getTime()}`;
}

export function isCustomAvatarPath(image: string | null | undefined): boolean {
  return Boolean(image?.startsWith(`${AVATAR_API_PATH}`));
}

export function isLocalAvatarPath(image: string | null | undefined): boolean {
  return Boolean(image?.startsWith("/uploads/avatars/"));
}

/** 管理画面など、他ユーザーのアイコンを表示するときの URL に変換する */
export function resolveAvatarUrlForUser(
  userId: string,
  image: string | null | undefined,
): string {
  if (!image) return "";
  if (isCustomAvatarPath(image)) {
    const query = image.includes("?") ? image.slice(image.indexOf("?")) : "";
    return `/api/admin/users/${userId}/avatar${query}`;
  }
  return image;
}
