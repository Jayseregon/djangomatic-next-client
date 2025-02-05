import React from "react";
import { render, act } from "@testing-library/react";

import DeficienciesPage from "@/components/reports/pdfBlocks/rogers/DeficienciesPage";
import { TowerReport, TowerReportImage } from "@/interfaces/reports";
import * as pdfRenderUtils from "@/lib/pdfRenderUtils";

// Mock the pdfRenderUtils
jest.mock("@/lib/pdfRenderUtils", () => ({
  fetchImageBatch: jest.fn(),
  parseTextBold: jest.fn(),
}));

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  View: ({
    children,
    style,
    wrap,
  }: {
    children: React.ReactNode;
    style?: any;
    wrap?: boolean;
  }) => (
    <div data-testid="pdf-view" data-wrap={wrap} style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
  Image: ({ src, style }: { src: string; style?: any }) => (
    <img alt="" data-testid="pdf-image" src={src} style={style} />
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock TOCSectionPDF component
jest.mock("@/components/reports/pdfBlocks/rogers/TOCSection", () => ({
  __esModule: true,
  default: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: any;
  }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
}));

describe("DeficienciesPage", () => {
  const mockDeficiencyImages: TowerReportImage[] = [
    {
      id: "1",
      url: "http://example.com/image1.jpg",
      label: "Test Image 1",
      deficiency_check_procedure: "Procedure 1",
      deficiency_recommendation: "Recommendation 1",
      imgIndex: 0,
      azureId: "azure1",
    },
    {
      id: "2",
      url: "http://example.com/image2.jpg",
      label: "Test Image 2",
      deficiency_check_procedure: "Procedure 2",
      deficiency_recommendation: "Recommendation 2",
      imgIndex: 1,
      azureId: "azure2",
    },
  ];

  const mockReport: Partial<TowerReport> = {
    deficiency_images: mockDeficiencyImages,
    notes_deficiency: [{ id: "1", indexNumber: 1, comment: "Test Note 1" }],
  };

  const mockTocSections = [
    { title: "Summary of Deficiencies", pageNumber: 1 },
    { title: "Deficiency Photos", pageNumber: 2 },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the fetchImageBatch to return some test data
    (pdfRenderUtils.fetchImageBatch as jest.Mock).mockResolvedValue({
      "http://example.com/image1.jpg": "data:image/jpeg;base64,test1",
      "http://example.com/image2.jpg": "data:image/jpeg;base64,test2",
    });
  });

  it("renders without crashing", async () => {
    let container;

    await act(async () => {
      const result = render(
        <DeficienciesPage
          report={mockReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );

      container = result.container;
    });
    expect(container).toBeTruthy();
  });

  it("renders summary section correctly", async () => {
    let getAllByTestId: any;

    await act(async () => {
      const result = render(
        <DeficienciesPage
          report={mockReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );

      getAllByTestId = result.getAllByTestId;
    });

    const textElements = getAllByTestId("pdf-text");
    const summaryElement = textElements.find(
      (el: { textContent: string }) =>
        el.textContent?.trim() === "Summary of Deficiencies",
    );

    expect(summaryElement).toBeTruthy();
  });

  it("renders deficiency photos introduction page", async () => {
    let getAllByTestId: any;

    await act(async () => {
      const result = render(
        <DeficienciesPage
          report={mockReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );

      getAllByTestId = result.getAllByTestId;
    });

    const textElements = getAllByTestId("pdf-text");
    const photosElement = textElements.find(
      (el: { textContent: string }) =>
        el.textContent?.trim() === "Deficiency Photos",
    );

    expect(photosElement).toBeTruthy();
  });

  it("renders all deficiency images", async () => {
    let getAllByTestId: any;

    await act(async () => {
      const result = render(
        <DeficienciesPage
          report={mockReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );

      getAllByTestId = result.getAllByTestId;
    });

    // Wait for useEffect and state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const imageElements = getAllByTestId("pdf-image");

    expect(imageElements).toHaveLength(mockDeficiencyImages.length);
    expect(pdfRenderUtils.fetchImageBatch).toHaveBeenCalledWith(
      mockDeficiencyImages,
    );
  });

  it("loads images using fetchImageBatch", async () => {
    await act(async () => {
      render(
        <DeficienciesPage
          report={mockReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );
    });

    // Wait for useEffect and state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(pdfRenderUtils.fetchImageBatch).toHaveBeenCalledWith(
      mockDeficiencyImages,
    );
  });

  it("renders deficiency notes correctly", async () => {
    let getAllByTestId: any;

    await act(async () => {
      const result = render(
        <DeficienciesPage
          report={mockReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );

      getAllByTestId = result.getAllByTestId;
    });

    const textElements = getAllByTestId("pdf-text");

    expect(
      textElements.some(
        (el: { textContent: string }) =>
          el.textContent === "Additional comments:",
      ),
    ).toBeTruthy();
  });

  it("sorts images by imgIndex", async () => {
    const unsortedImages = [
      { ...mockDeficiencyImages[0], imgIndex: 1 },
      { ...mockDeficiencyImages[1], imgIndex: 0 },
    ];

    const unsortedReport = {
      ...mockReport,
      deficiency_images: unsortedImages,
    };

    let getAllByTestId: any;

    await act(async () => {
      const result = render(
        <DeficienciesPage
          report={unsortedReport as TowerReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );

      getAllByTestId = result.getAllByTestId;
    });

    // Wait for useEffect and state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const labels = getAllByTestId("pdf-text")
      .filter((el: { textContent: string | string[] }) =>
        el.textContent?.includes("Test Image"),
      )
      .map((el: { textContent: string }) => el.textContent?.trim());

    expect(labels).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Test Image 2"),
        expect.stringContaining("Test Image 1"),
      ]),
    );
    expect(pdfRenderUtils.fetchImageBatch).toHaveBeenCalled();
  });
});
