import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

function buildProviders() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return [];
  }

  return [
    Google({
      clientId,
      clientSecret,
      // clientSecret ありのサーバー OAuth では state のみで十分（PKCE Cookie 問題を回避）
      checks: ["state"],
    }),
  ];
}

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: buildProviders(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/diagnosis");

      if (isProtected) {
        return !!auth?.user;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;
        if (user.image) {
          token.picture = user.image;
        }
      }
      if (trigger === "update" && session?.image && typeof session.image === "string") {
        token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (typeof token.picture === "string") {
        session.user.image = token.picture;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.MONGODB_URI,
  );
}
