const createProvider =
  (id: string, name: string) =>
  (config: any = {}) => ({
    id,
    name,
    type: "oauth",
    ...config,
    signinUrl: "/api/auth/signin",
    callbackUrl: "/api/auth/callback",
  });

export const GitHub = createProvider("github", "GitHub");

export const MicrosoftEntraID = createProvider(
  "azure-ad",
  "Microsoft Entra ID",
);

export default MicrosoftEntraID;

// Add test suite
describe("Next Auth Providers Mock", () => {
  it("provides mock providers", () => {
    expect(GitHub).toBeDefined();
    expect(MicrosoftEntraID).toBeDefined();
    const microsoftProvider = MicrosoftEntraID({
      clientId: "test-id",
      clientSecret: "test-secret",
      issuer: "test-issuer",
    });

    expect(microsoftProvider).toHaveProperty("id", "azure-ad");
  });
});
