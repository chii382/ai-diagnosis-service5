import {
  AGE_RANGE_OPTIONS,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
} from "@/lib/profile-options";

export type DiagnosisProfileContext = {
  name: string;
  gender?: string;
  ageRange?: string;
  occupation?: string;
  /** 職種コード（office_worker, engineer 等） */
  occupationValue?: string;
  bio?: string;
};

function labelFromOptions<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((option) => option.value === value)?.label;
}

/** プロフィールの任意項目に入力がある場合のみ、診断用コンテキストを返す */
export function buildDiagnosisProfileContext(user: {
  name?: string | null;
  gender?: string | null;
  ageRange?: string | null;
  occupation?: string | null;
  bio?: string | null;
}): DiagnosisProfileContext | null {
  const gender = labelFromOptions(GENDER_OPTIONS, user.gender);
  const ageRange = labelFromOptions(AGE_RANGE_OPTIONS, user.ageRange);
  const occupation = labelFromOptions(OCCUPATION_OPTIONS, user.occupation);
  const bio = user.bio?.trim() || undefined;
  const occupationValue = user.occupation?.trim() || undefined;

  const hasProfileInput = Boolean(gender || ageRange || occupation || bio);
  if (!hasProfileInput) return null;

  return {
    name: user.name?.trim() || "ユーザー",
    ...(gender && { gender }),
    ...(ageRange && { ageRange }),
    ...(occupation && { occupation }),
    ...(occupationValue && { occupationValue }),
    ...(bio && { bio }),
  };
}

export function formatProfileContextSection(context: DiagnosisProfileContext): string {
  const lines = [`- 表示名: ${context.name}`];
  if (context.gender) lines.push(`- 性別: ${context.gender}`);
  if (context.ageRange) lines.push(`- 年代: ${context.ageRange}`);
  if (context.occupation) lines.push(`- 職業: ${context.occupation}`);
  if (context.bio) lines.push(`- 自己紹介・補足: ${context.bio}`);
  return lines.join("\n");
}
