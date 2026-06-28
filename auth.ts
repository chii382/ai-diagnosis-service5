import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import { authConfig } from "@/auth.config";
import { bootstrapAdminByEmail, getAdminBootstrapEmails } from "@/lib/admin/server";
import { DEFAULT_USER_PLAN, normalizeUserPlan } from "@/lib/plan";
import { getMongoClientPromise, getUsersCollection, isMongoConfigured } from "@/lib/mongodb";
import { DEFAULT_USER_ROLE, normalizeUserRole, type UserRole } from "@/lib/user/types";

const adapter = isMongoConfigured()
  ? MongoDBAdapter(getMongoClientPromise())
  : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(adapter ? { adapter } : {}),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      const nextToken = await authConfig.callbacks.jwt!({ token, user, trigger, session });

      if (
        nextToken.id &&
        typeof nextToken.id === "string" &&
        ObjectId.isValid(nextToken.id) &&
        isMongoConfigured()
      ) {
        try {
          const users = await getUsersCollection();
          const doc = await users.findOne(
            { _id: new ObjectId(nextToken.id) },
            { projection: { role: 1, email: 1, plan: 1 } },
          );
          if (doc) {
            nextToken.role = normalizeUserRole(doc.role);
            nextToken.plan = normalizeUserPlan(doc.plan);
            const adminEmails = getAdminBootstrapEmails();
            const userEmail = typeof doc.email === "string" ? doc.email : "";
            if (adminEmails.includes(userEmail) && nextToken.role !== "admin") {
              await bootstrapAdminByEmail(userEmail);
              nextToken.role = "admin";
            }
          }
        } catch {
          nextToken.role = (nextToken.role as UserRole | undefined) ?? "user";
          nextToken.plan = normalizeUserPlan(nextToken.plan);
        }
      }

      return nextToken;
    },
    async session(params) {
      const nextSession = await authConfig.callbacks.session!(params);
      nextSession.user.role = normalizeUserRole(params.token.role);
      nextSession.user.plan = normalizeUserPlan(params.token.plan);
      return nextSession;
    },
  },
  ...(adapter
    ? {
        events: {
          async createUser({ user }) {
            if (!user.id) return;
            const users = await getUsersCollection();
            const now = new Date();
            await users.updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { createdAt: now, updatedAt: now, role: DEFAULT_USER_ROLE, plan: DEFAULT_USER_PLAN } },
            );
          },
          async signIn({ user }) {
            if (!user.id) return;
            const users = await getUsersCollection();
            const now = new Date();
            await users.updateOne(
              { _id: new ObjectId(user.id) },
              { $set: { lastLoginAt: now, updatedAt: now } },
            );
          },
        },
      }
    : {}),
});
