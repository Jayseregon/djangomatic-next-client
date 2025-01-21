import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

import { PrismaClient } from "@prisma/client";
import { type DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

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
  { email: "jayseregon@gmail.com" },
  { email: "prevg18@gmail.com" },
  { email: "jeremie.bitsch@telecon.ca" },
  { email: "m-l.betournay@telecon.ca" },
  { email: "gabriel.prevost@telecon.ca" },
  { email: "sebastien.janelle@telecon.ca" },
];

const prisma = new PrismaClient();
const microsoftEntraIDProvider = MicrosoftEntraID({
  clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
  clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
  issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER, // e.g. https://login.microsoftonline.com/<tenant-id>/v2.0
});

const providers: Provider[] = [microsoftEntraIDProvider];

if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
  providers.push(GitHub);
}

export const config = {
  providers: providers,
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email is in the list of authorized members
      const isAuthorized =
        authorizedMembers.some((member) => member.email === user.email) ||
        user.email?.endsWith("@telecon.ca") ||
        user.email?.endsWith("@telecon.com");

      const isAdmin = authorizedMembers.some(
        (member) => member.email === user.email
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
              isAdmin: isAdmin,
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
