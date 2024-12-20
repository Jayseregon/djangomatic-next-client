import React from "react";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;

export const useSession = jest.fn(() => ({
  data: null,
  status: "unauthenticated",
}));

describe("NextAuth Mock", () => {
  it("exists", () => {
    expect(SessionProvider).toBeDefined();
    expect(useSession).toBeDefined();
  });
});
