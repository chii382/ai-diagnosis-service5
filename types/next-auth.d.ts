import { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/user/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    picture?: string;
    role?: UserRole;
  }
}
