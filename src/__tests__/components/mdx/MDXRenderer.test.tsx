import { evaluate } from "next-mdx-remote-client/rsc";

import { MDXRenderer } from "@/components/mdx/MDXRenderer";

// Mock next-mdx-remote-client/rsc
jest.mock("next-mdx-remote-client/rsc", () => ({
  evaluate: jest.fn(),
}));

describe("MDXRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully renders MDX content with frontmatter", async () => {
    const mockContent = <div>Rendered MDX Content</div>;
    const mockFrontmatter = { title: "Test Title" };

    (evaluate as jest.Mock).mockResolvedValue({
      content: mockContent,
      frontmatter: mockFrontmatter,
    });

    const source = "---\ntitle: Test Title\n---\n# Test Content";
    const result = await MDXRenderer({ source });

    expect(result).toEqual({
      content: mockContent,
      frontmatter: mockFrontmatter,
    });

    expect(evaluate).toHaveBeenCalledWith({
      source,
      options: { parseFrontmatter: true },
      components: expect.objectContaining({
        Callout: expect.any(Function),
        Snippet: expect.any(Function),
        LoadDynamicImage: expect.any(Function),
        Quote: expect.any(Function),
        TableOfContentsMdx: expect.any(Function),
        BugReportNotice: expect.any(Function),
      }),
    });
  });

  it("throws error when evaluation fails", async () => {
    const mockError = new Error("MDX parsing failed");

    (evaluate as jest.Mock).mockResolvedValue({
      error: mockError,
    });

    const source = "Invalid MDX Content";

    await expect(MDXRenderer({ source })).rejects.toThrow(
      "Error loading content: MDX parsing failed",
    );
  });

  it("passes correct options to evaluate", async () => {
    (evaluate as jest.Mock).mockResolvedValue({
      content: <div>Content</div>,
      frontmatter: {},
    });

    const source = "Test Content";

    await MDXRenderer({ source });

    expect(evaluate).toHaveBeenCalledWith(
      expect.objectContaining({
        options: {
          parseFrontmatter: true,
        },
      }),
    );
  });

  it("handles empty frontmatter correctly", async () => {
    (evaluate as jest.Mock).mockResolvedValue({
      content: <div>Content</div>,
      frontmatter: {},
    });

    const source = "Just content without frontmatter";
    const result = await MDXRenderer({ source });

    expect(result.frontmatter).toEqual({});
    expect(result.content).toBeDefined();
  });

  it("provides all required custom components", async () => {
    (evaluate as jest.Mock).mockResolvedValue({
      content: <div>Content</div>,
      frontmatter: {},
    });

    const source = "Test content";

    await MDXRenderer({ source });

    // Verify all custom components are provided
    expect(evaluate).toHaveBeenCalledWith(
      expect.objectContaining({
        components: expect.objectContaining({
          Callout: expect.any(Function),
          Snippet: expect.any(Function),
          LoadDynamicImage: expect.any(Function),
          Quote: expect.any(Function),
          TableOfContentsMdx: expect.any(Function),
          BugReportNotice: expect.any(Function),
        }),
      }),
    );
  });
});
