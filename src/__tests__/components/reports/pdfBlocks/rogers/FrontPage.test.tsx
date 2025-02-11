import React from "react";
import { render } from "@testing-library/react";

import FrontPage from "@/src/components/reports/pdfBlocks/rogers/FrontPage";
import { TowerReport } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer components and StyleSheet
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-text" }, children),
  View: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-view" }, children),
  Image: ({ src, style }: any) =>
    React.createElement("div", {
      style,
      className: "pdf-image",
      "data-src": src,
    }),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe("FrontPage Component", () => {
  // Mock the timezone to avoid test failures due to different timezones
  const mockDate = new Date("2024-01-15T12:00:00Z"); // Use noon UTC to avoid timezone issues

  const mockReport: TowerReport = {
    site_code: "ON0001",
    tower_site_name: "test_tower_site",
    site_region: "Ontario",
    front_image: [{ url: "https://example.com/image.jpg" }],
    updatedAt: mockDate,
  } as TowerReport;

  // Setup timezone mock before tests
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  // Cleanup after tests
  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders with required props", () => {
    const { container } = render(<FrontPage report={mockReport} />);

    // Check for logos
    expect(container.innerHTML).toContain("telecon-design-logo.png");
    expect(container.innerHTML).toContain("rogers-logo.png");
  });

  it("displays site information correctly", () => {
    const { container } = render(<FrontPage report={mockReport} />);

    // Check for site information
    expect(container.innerHTML).toContain("ON0001");
    expect(container.innerHTML).toContain("Test Tower Site");
    expect(container.innerHTML).toContain("Ontario");
  });

  it("displays the correct date format", () => {
    const { container } = render(<FrontPage report={mockReport} />);
    const expectedDate = mockDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    expect(container.innerHTML).toContain(expectedDate);
  });

  it("uses placeholder image when front_image is empty", () => {
    const reportWithoutImage = {
      ...mockReport,
      front_image: [],
    };

    const { container } = render(<FrontPage report={reportWithoutImage} />);

    // Check for placeholder image
    expect(container.innerHTML).toContain("landscape-placeholder.png");
  });

  it("includes Rogers disclaimer text", () => {
    const { container } = render(<FrontPage report={mockReport} />);

    // Check for disclaimer text
    expect(container.innerHTML).toContain(
      "PROPRIETARY AND CONFIDENTIAL INFORMATION",
    );
    expect(container.innerHTML).toContain("ROGERS COMMUNICATIONS PARTNERSHIP");
  });

  it("includes footer logo", () => {
    const { container } = render(<FrontPage report={mockReport} />);

    // Check for footer logo
    expect(container.innerHTML).toContain("rogers-footer.jpg");
  });
});
