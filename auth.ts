import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import { authConfig } from "@/auth.config";
import { getMongoClientPromise, getUsersCollection, isMongoConfigured } from "@/lib/mongodb";

const adapter = isMongoConfigured()
  ? MongoDBAdapter(getMongoClientPromise())
  : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(adapter ? { adapter } : {}),
  ...(adapter
    ? {
        events: {
          async createUser({ user }) {
            if (!user.id) return;
            const users = await getUsersCollection();
            const now = new Date();
            await users.updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { createdAt: now, updatedAt: now } },
            );
          },
        },
      }
    : {}),
});
