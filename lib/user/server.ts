import { DEFAULT_USER_PLAN, normalizeUserPlan, type UserPlan } from "@/lib/plan";
import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type UserProfileSnapshot = {
  name: string;
  email: string;
  image: string;
  plan: UserPlan;
};

type StripePlanFields = {
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

/** 画面表示用に MongoDB から最新のユーザー情報を取得する */
export async function fetchUserProfileForUser(
  userId: string,
): Promise<UserProfileSnapshot | null> {
  if (!ObjectId.isValid(userId)) return null;

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) return null;

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    plan: normalizeUserPlan(user.plan),
  };
}

/** MongoDB からユーザーの現在プランを取得する */
export async function fetchUserPlanForUser(userId: string): Promise<UserPlan> {
  if (!ObjectId.isValid(userId)) return DEFAULT_USER_PLAN;

  const users = await getUsersCollection();
  const user = await users.findOne(
    { _id: new ObjectId(userId) },
    { projection: { plan: 1 } },
  );
  if (!user) return DEFAULT_USER_PLAN;

  return normalizeUserPlan(user.plan);
}

/** ユーザー ID でプランを更新する（Webhook 用） */
export async function updateUserPlanById(
  userId: string,
  plan: UserPlan,
  stripeFields?: StripePlanFields,
): Promise<boolean> {
  if (!ObjectId.isValid(userId)) return false;

  const users = await getUsersCollection();
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        plan,
        updatedAt: new Date(),
        ...(stripeFields?.stripeCustomerId
          ? { stripeCustomerId: stripeFields.stripeCustomerId }
          : {}),
        ...(stripeFields?.stripeSubscriptionId
          ? { stripeSubscriptionId: stripeFields.stripeSubscriptionId }
          : {}),
      },
    },
  );

  return result.matchedCount > 0;
}

/** メールアドレスでプランを更新する（フォールバック用） */
export async function updateUserPlanByEmail(
  email: string,
  plan: UserPlan,
  stripeFields?: StripePlanFields,
): Promise<boolean> {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) return false;

  const users = await getUsersCollection();
  const user = await users.findOne({
    email: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  });
  if (!user?._id) return false;

  return updateUserPlanById(user._id.toString(), plan, stripeFields);
}
