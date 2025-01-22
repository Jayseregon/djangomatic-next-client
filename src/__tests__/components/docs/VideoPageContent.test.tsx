import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import { VideoPageContent } from "@/src/components/docs/VideoPageContent";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({
    category: "admin",
  }),
}));

// Mock next-intl with proper translation keys
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: { [key: string]: string } = {
      "videoPage.subtitle": "Video Tutorials",
      "videoPage.loading": "Loading videos...",
    };

    return translations[key] || key;
  },
}));

// Mock WithPermissionOverlayDocs component
jest.mock("@/src/components/auth/withPermissionOverlay", () => ({
  WithPermissionOverlayDocs: ({
    children,
    permission,
  }: {
    children: React.ReactNode;
    permission: string;
  }) => (
    <div data-permission={permission} data-testid="permission-overlay">
      {children}
    </div>
  ),
}));

// Mock VideosGrids component
jest.mock("@/components/docs/VideosGrids", () => ({
  VideosGrids: ({ selectedCategory }: { selectedCategory: string }) => (
    <div data-testid="videos-grid">Mock Videos Grid: {selectedCategory}</div>
  ),
}));

// Mock heroui Spinner component
jest.mock("@heroui/react", () => ({
  Spinner: ({ label }: { label: string }) => (
    <div data-testid="loading-spinner">{label}</div>
  ),
}));

describe("VideoPageContent", () => {
  const mockSession = {
    user: {
      email: "test@example.com",
    },
  };

  it("renders with correct permission overlay", () => {
    const { getByTestId } = render(<VideoPageContent session={mockSession} />);
    const overlay = getByTestId("permission-overlay");

    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("data-permission", "canAccessVideoAdmin");
  });

  it("displays correct category title and subtitle", () => {
    render(<VideoPageContent session={mockSession} />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Video Tutorials")).toBeInTheDocument();
  });

  it("renders videos grid with correct category", () => {
    render(<VideoPageContent session={mockSession} />);

    expect(screen.getByTestId("videos-grid")).toBeInTheDocument();
    expect(screen.getByText("Mock Videos Grid: admin")).toBeInTheDocument();
  });

  it("shows loading spinner when category is not available", () => {
    // Override useParams mock for this test
    jest.spyOn(require("next/navigation"), "useParams").mockReturnValue({});

    render(<VideoPageContent session={mockSession} />);

    const spinner = screen.getByTestId("loading-spinner");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveTextContent("Loading videos...");
  });

  it("applies correct styling to titles when category is available", () => {
    // Ensure category is available
    jest
      .spyOn(require("next/navigation"), "useParams")
      .mockReturnValue({ category: "admin" });

    const { container } = render(<VideoPageContent session={mockSession} />);

    // Use container query since heading might not be accessible
    const titleContainer = container.querySelector("h1");

    expect(titleContainer).toBeInTheDocument();
    expect(titleContainer).toHaveClass("grid", "grid-cols-1", "gap-2");
  });

  describe("Category mapping", () => {
    const testCases = [
      {
        category: "admin",
        mapping: "Admin",
        permission: "canAccessVideoAdmin",
      },
      { category: "gis", mapping: "GIS", permission: "canAccessVideoGIS" },
      {
        category: "autocad",
        mapping: "AutoCAD",
        permission: "canAccessVideoCAD",
      },
    ];

    testCases.forEach(({ category, mapping, permission }) => {
      it(`correctly maps ${category} to ${mapping} with ${permission}`, () => {
        jest
          .spyOn(require("next/navigation"), "useParams")
          .mockReturnValue({ category: category.toLowerCase() });

        const { getByTestId } = render(
          <VideoPageContent session={mockSession} />,
        );

        expect(screen.getByText(mapping)).toBeInTheDocument();
        expect(getByTestId("permission-overlay")).toHaveAttribute(
          "data-permission",
          permission,
        );
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
