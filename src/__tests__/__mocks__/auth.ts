export const auth = jest.fn(() => ({
  user: {
    name: "Test User",
    email: "test@example.com",
    id: "test-id",
  },
}));

export const signIn = jest.fn();
export const signOut = jest.fn();

// Add test suite to satisfy Jest's requirement
describe("Auth Mock", () => {
  it("exists", () => {
    expect(auth).toBeDefined();
    expect(signIn).toBeDefined();
    expect(signOut).toBeDefined();
  });
});
