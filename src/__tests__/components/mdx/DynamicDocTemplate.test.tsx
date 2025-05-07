import fs from "fs";

import React from "react";
import { render, screen } from "@testing-library/react";
import { evaluate } from "next-mdx-remote-client/rsc";

import DynamicDocTemplate, {
  generateMetadataTemplate,
  generateStaticParamsTemplate,
} from "@/components/mdx/DynamicDocTemplate";
import { WithPermissionOverlayDocs } from "@/src/components/auth/withPermissionOverlay";
import { getDocContent } from "@/src/lib/mdxUtils";
import { DynamicDocTemplateProps } from "@/interfaces/mdx";
import DownloadLinkedFile from "@/src/components/mdx/DownloadLinkedFile";

// Mock dependencies
jest.mock("next-mdx-remote-client/rsc");
jest.mock("@/src/lib/mdxUtils");
jest.mock("@/src/components/auth/withPermissionOverlay");
jest.mock("@/src/components/mdx/DownloadLinkedFile", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="download-file-button" />),
}));
jest.mock("fs");

// Mock implementations
(WithPermissionOverlayDocs as jest.Mock).mockImplementation(({ children }) => (
  <div>{children}</div>
));
(evaluate as jest.Mock).mockResolvedValue({
  content: React.createElement("div", null, "Mocked Content"),
  frontmatter: { title: "Test Title" },
});
(getDocContent as jest.Mock).mockResolvedValue("mock content");

describe("DynamicDocTemplate", () => {
  const mockProps: DynamicDocTemplateProps = {
    slug: "test-slug",
    docType: "test-doc",
    permission: "isAdmin",
    session: {
      user: {
        email: "test@example.com",
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("DynamicDocTemplate component", () => {
    it("renders content with correct title and layout", async () => {
      const { container } = render(await DynamicDocTemplate(mockProps));

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(container.querySelector(".prose")).toBeInTheDocument();
    });

    it("should not render DownloadLinkedFile when linkedFile is not present", async () => {
      (evaluate as jest.Mock).mockResolvedValueOnce({
        content: React.createElement("div", null, "Mocked Content"),
        frontmatter: { title: "Test Title" },
      });

      render(await DynamicDocTemplate(mockProps));

      expect(DownloadLinkedFile).not.toHaveBeenCalled();
      expect(
        screen.queryByTestId("download-file-button"),
      ).not.toBeInTheDocument();
    });

    it("should render DownloadLinkedFile when linkedFile is present", async () => {
      (evaluate as jest.Mock).mockResolvedValueOnce({
        content: React.createElement("div", null, "Mocked Content"),
        frontmatter: { title: "Test Title", linkedFile: "test-file.zip" },
      });

      render(await DynamicDocTemplate(mockProps));

      expect(DownloadLinkedFile).toHaveBeenCalled();
      expect((DownloadLinkedFile as jest.Mock).mock.calls[0][0]).toEqual({
        filename: "test-file.zip",
      });
      expect(screen.getByTestId("download-file-button")).toBeInTheDocument();
    });

    it("calls getDocContent with correct parameters", async () => {
      render(await DynamicDocTemplate(mockProps));

      expect(getDocContent).toHaveBeenCalledWith("test-doc", "test-slug");
    });

    it("passes correct props to WithPermissionOverlayDocs", async () => {
      render(await DynamicDocTemplate(mockProps));

      const lastCall = (WithPermissionOverlayDocs as jest.Mock).mock
        .calls[0][0];

      expect(lastCall.email).toBe("test@example.com");
      expect(lastCall.permission).toBe("isAdmin");
    });
  });

  describe("generateMetadataTemplate", () => {
    it("returns correct metadata object", async () => {
      const metadata = await generateMetadataTemplate({
        slug: "test-slug",
        docType: "test-doc",
      });

      expect(metadata).toEqual({
        title: "Test Title",
      });
    });

    it("calls getDocContent with correct parameters", async () => {
      await generateMetadataTemplate({
        slug: "test-slug",
        docType: "test-doc",
      });

      expect(getDocContent).toHaveBeenCalledWith("test-doc", "test-slug");
    });
  });

  describe("generateStaticParamsTemplate", () => {
    beforeEach(() => {
      (fs.readdirSync as jest.Mock).mockReturnValue(["file1.mdx", "file2.mdx"]);
    });

    it("returns correct params array", async () => {
      const params = await generateStaticParamsTemplate("test-doc");

      expect(params).toEqual([{ slug: "file1" }, { slug: "file2" }]);
    });

    it("handles empty directory", async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      const params = await generateStaticParamsTemplate("test-doc");

      expect(params).toEqual([]);
    });

    it("filters non-mdx files correctly", async () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(["file1.mdx", "file2.txt"]);

      const params = await generateStaticParamsTemplate("test-doc");

      expect(params).toEqual([{ slug: "file1" }]);
    });
  });

  describe("Error handling", () => {
    it("handles MDXRenderer errors gracefully", async () => {
      (evaluate as jest.Mock).mockRejectedValueOnce(new Error("MDX Error"));

      await expect(DynamicDocTemplate(mockProps)).rejects.toThrow("MDX Error");
    });

    it("handles getDocContent errors gracefully", async () => {
      (getDocContent as jest.Mock).mockRejectedValueOnce(
        new Error("Content Error"),
      );

      await expect(DynamicDocTemplate(mockProps)).rejects.toThrow(
        "Content Error",
      );
    });
  });
});
