import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type UserProfileSnapshot = {
  name: string;
  email: string;
  image: string;
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
  };
}
