export const setRequestLocale = jest.fn();

// Add test suite to satisfy Jest's requirement
describe("Next-Intl Server Mock", () => {
  it("exists", () => {
    expect(setRequestLocale).toBeDefined();
  });
});
