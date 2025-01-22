import React from "react";

export const evaluate = jest.fn().mockImplementation(async () => ({
  content: React.createElement("div", null, "Mocked Content"),
  frontmatter: { title: "Test Title" },
}));

// Add test to satisfy Jest's requirement
describe("next-mdx-remote-client/rsc mock", () => {
  it("exports evaluate function", () => {
    expect(evaluate).toBeDefined();
  });
});
