import { DefaultSession } from "next-auth";
import type { UserPlan } from "@/lib/plan";
import type { UserRole } from "@/lib/user/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      plan: UserPlan;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    picture?: string;
    role?: UserRole;
    plan?: UserPlan;
  }
}
