const createProvider =
  (id: string, name: string) =>
  (config = {}) => ({
    id,
    name,
    type: "oauth",
    ...config,
  });

export const GitHub = createProvider("github", "GitHub");

export const MicrosoftEntraID = createProvider(
  "azure-ad",
  "Microsoft Entra ID",
);

const providers = {
  GitHub,
  MicrosoftEntraID,
};

export default providers;

describe("Next Auth Providers Mock", () => {
  it("exists", () => {
    expect(GitHub).toBeDefined();
    expect(MicrosoftEntraID).toBeDefined();
  });
});
