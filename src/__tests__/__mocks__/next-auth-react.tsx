import React from "react";

// Client-side exports (next-auth/react)
export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;

export const useSession = jest.fn(() => ({
  data: null,
  status: "unauthenticated",
}));

// Server-side exports (next-auth)
export const auth = jest.fn().mockImplementation(() =>
  Promise.resolve({
    user: {
      name: "Test User",
      email: "test@example.com",
      id: "test-id",
    },
  }),
);

export const signIn = jest.fn(() => Promise.resolve());
export const signOut = jest.fn(() => Promise.resolve());
export const handlers = {
  GET: () => new Response(),
  POST: () => new Response(),
};

export const providers = {
  github: { id: "github", name: "GitHub", type: "oauth" },
  "azure-ad": { id: "azure-ad", name: "Microsoft Entra ID", type: "oauth" },
};

// Update NextAuth to properly handle configuration
export const NextAuth = (config: any = {}) => ({
  auth,
  handlers,
  signIn,
  signOut,
  providers: config.providers || Object.values(providers),
});

// Export same auth functions for @/auth path
export {
  auth as default,
  signIn as defaultSignIn,
  signOut as defaultSignOut,
  handlers as defaultHandlers,
};

// Add test suite to satisfy Jest's requirement
describe("NextAuth Mock", () => {
  it("exists", () => {
    expect(SessionProvider).toBeDefined();
    expect(useSession).toBeDefined();
    expect(auth).toBeDefined();
    expect(signIn).toBeDefined();
    expect(signOut).toBeDefined();
    expect(handlers).toBeDefined();
    expect(providers).toBeDefined();
  });
});
