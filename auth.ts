import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

import { PrismaClient } from "@prisma/client";
import { type DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}

const authorizedMembers = [
  { name: "Jayseregon", email: "jayseregon@gmail.com" },
  // { name: "User1", email: "user2@example.com" },
];

const prisma = new PrismaClient();
const providers: Provider[] = [GitHub];

export const config = {
  providers: providers,
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email is in the list of authorized members
      const isAuthorized = authorizedMembers.some(
        (member) => member.email === user.email,
      );

      if (isAuthorized) {
        // check if user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        // console.log("Existing user:", existingUser);

        // create user entry if not exists
        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
            },
          });
          // console.log("User created with:", user);
        } else {
          await prisma.user.update({
            where: { email: user.email! },
            data: { lastLogin: new Date() },
          });
        }

        return true; // Allow sign in
      } else {
        return false; // Block sign in
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        if (typeof profile.id === "string") {
          token.id = profile.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id as string;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hours
    updateAge: 60 * 60, // 1 hour
  },
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig;

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();

    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth(config);
