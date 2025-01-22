import fs from "fs";

import { docsDirectory, getDocContent } from "@/lib/mdxUtils";

// Mock the fs module
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

// Mock process.cwd()
const mockCwd = jest.spyOn(process, "cwd");

mockCwd.mockReturnValue("/fake/root");

describe("mdxUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("docsDirectory", () => {
    it("should return the correct path for a given docType", () => {
      const result = docsDirectory("docs");

      expect(result).toBe("/fake/root/public/content/docs");
    });

    it("should work with different docTypes", () => {
      const result = docsDirectory("tutorials");

      expect(result).toBe("/fake/root/public/content/tutorials");
    });
  });

  describe("getDocContent", () => {
    it("should read the correct file and return its content", async () => {
      const mockContent = "Mock MDX content";

      (fs.promises.readFile as jest.Mock).mockResolvedValue(mockContent);

      const content = await getDocContent("docs", "test-doc");

      expect(fs.promises.readFile).toHaveBeenCalledWith(
        "/fake/root/public/content/docs/test-doc.mdx",
        "utf8",
      );
      expect(content).toBe(mockContent);
    });

    it("should throw an error if the file cannot be read", async () => {
      const mockError = new Error("File not found");

      (fs.promises.readFile as jest.Mock).mockRejectedValue(mockError);

      await expect(getDocContent("docs", "non-existent")).rejects.toThrow(
        "File not found",
      );
    });
  });
});
