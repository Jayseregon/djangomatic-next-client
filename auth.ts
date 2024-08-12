import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";

import { type DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     user: {
//       id: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken?: string;
//     id?: string;
//   }
// }

const authorizedMembers = [
  { name: "Jayseregon", email: "jayseregon@gmail.com" },
  // { name: "User1", email: "user2@example.com" },
];

export const { handlers, auth } = NextAuth({
  providers: [GitHub],
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      const isAuthorized = authorizedMembers.some(
        (member) => member.email === user.email,
      );

      if (isAuthorized) {
        return true; // Allow sign in
      } else {
        return false; // Block sign in
      }
    },
  },
  // debug: process.env.NODE_ENV !== "production",
  debug: true,
});


// const providers: Provider[] = [GitHub];

// export const config = {
//   providers: providers,
//   // pages: {
//   //   signIn: "/signin",
//   // },
//   trustHost: true,
//   basePath: "/api/auth",
//   cookies: {
//     csrfToken: {
//       name: "next-auth.csrf-token",
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production",
//       },
//     },
//   },
//   callbacks: {
//     async signIn({ user, account, profile, email, credentials }) {
//       // Check if the user's email is in the list of authorized members
//       const isAuthorized = authorizedMembers.some(
//         (member) => member.email === user.email
//       );

//       if (isAuthorized) {
//         return true; // Allow sign in
//       } else {
//         // Return false to display a default error message
//         return false;
//         // Or you can return a URL to redirect to:
//         // return '/unauthorized'
//       }
//     },
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         token.accessToken = account.access_token;
//         if (typeof profile.id === "string") {
//           token.id = profile.id;
//         }
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.user.id = token.id as string;

//       return session;
//     },
//     // async redirect({ url, baseUrl }) {
//     //   console.log("Redirect called with:", { url, baseUrl });
//     //   if (url.startsWith("/")) return `${baseUrl}${url}`;
//     //   else if (new URL(url).origin === baseUrl) return url;
//     //   return baseUrl;
//     // },
//     async redirect({ url, baseUrl }) {
//       console.log("Redirect called with:", { url, baseUrl });
//       // Always redirect to the homepage after sign-in
//       return `${baseUrl}/en`;
//     },
//   },
//   // debug: process.env.NODE_ENV !== "production",
//   debug: true,
// } satisfies NextAuthConfig;

// // export const providerMap = providers.map((provider) => {
// //   if (typeof provider === "function") {
// //     const providerData = provider();

// //     return { id: providerData.id, name: providerData.name };
// //   } else {
// //     return { id: provider.id, name: provider.name };
// //   }
// // });

// export const { handlers, auth, signIn, signOut } = NextAuth(config);
