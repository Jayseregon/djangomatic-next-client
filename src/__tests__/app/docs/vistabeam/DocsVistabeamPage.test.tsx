import { render, screen } from "@testing-library/react";

import DocsVistabeamPage from "@/app/docs/vistabeam/[slug]/page";

// Mock next/navigation for metadata
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock UnAuthenticated component
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

// Mock DynamicDocTemplate component and its exports
jest.mock("@/components/mdx/DynamicDocTemplate", () => ({
  __esModule: true,
  default: ({
    docType,
    permission,
    session,
    slug,
  }: {
    docType: string;
    permission: string;
    session: any;
    slug: string;
  }) => (
    <div
      data-doc-type={docType}
      data-email={session?.user?.email}
      data-permission={permission}
      data-slug={slug}
      data-testid="dynamic-doc-template"
    >
      Dynamic Doc Template
    </div>
  ),
  generateMetadataTemplate: jest
    .fn()
    .mockResolvedValue({ title: "Test Title" }),
  generateStaticParamsTemplate: jest
    .fn()
    .mockReturnValue([{ slug: "test-slug" }]),
}));

// Mock auth
jest.mock(
  "../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("DocsVistabeamPage", () => {
  const mockProps = {
    params: Promise.resolve({ slug: "test-doc" }),
  };

  const renderDocsVistabeamPage = async (session: any = null) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await DocsVistabeamPage(mockProps));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderDocsVistabeamPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(
      screen.queryByTestId("dynamic-doc-template"),
    ).not.toBeInTheDocument();
  });

  it("renders DynamicDocTemplate when authenticated", async () => {
    const mockSession = {
      user: {
        email: "user@example.com",
      },
    };

    await renderDocsVistabeamPage(mockSession);

    const template = screen.getByTestId("dynamic-doc-template");

    expect(template).toBeInTheDocument();
    expect(template).toHaveAttribute("data-doc-type", "vistabeam");
    expect(template).toHaveAttribute(
      "data-permission",
      "canAccessDocsVistabeam",
    );
    expect(template).toHaveAttribute("data-email", "user@example.com");
    expect(template).toHaveAttribute("data-slug", "test-doc");
  });

  describe("Metadata Generation", () => {
    it("generates metadata correctly", async () => {
      const { generateMetadata } = require("@/app/docs/vistabeam/[slug]/page");
      const metadata = await generateMetadata(mockProps);

      expect(metadata).toEqual({ title: "Test Title" });
    });
  });

  describe("Static Params Generation", () => {
    it("generates static params correctly", async () => {
      const {
        generateStaticParams,
      } = require("@/app/docs/vistabeam/[slug]/page");
      const params = await generateStaticParams();

      expect(params).toEqual([{ slug: "test-slug" }]);
    });
  });
});
