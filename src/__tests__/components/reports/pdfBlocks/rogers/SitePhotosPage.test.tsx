import React from "react";
import { render, act } from "@testing-library/react";

import SitePhotosPage from "@/src/components/reports/pdfBlocks/rogers/SitePhotosPage";
import { TowerReport, TOCSections } from "@/src/interfaces/reports";
import { fetchImageBatch } from "@/lib/pdfRenderUtils";

// Mock the fetchImageBatch function
jest.mock("@/lib/pdfRenderUtils", () => ({
  fetchImageBatch: jest.fn().mockResolvedValue({
    "https://example.com/image1.jpg": "data:image/jpeg;base64,mock1",
    "https://example.com/image2.jpg": "data:image/jpeg;base64,mock2",
  }),
}));

// Mock @react-pdf/renderer components
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-text" }, children),
  View: ({ children, style, break: pageBreak }: any) =>
    React.createElement(
      "div",
      { style, className: "pdf-view", "data-break": pageBreak },
      children,
    ),
  Image: ({ src, style }: any) =>
    React.createElement("img", { src, style, className: "pdf-image" }),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock TOCSection component
jest.mock("@/src/components/reports/pdfBlocks/rogers/TOCSection", () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="toc-section">{children}</div>
  ),
}));

// Replace flushPromises with a different implementation
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("SitePhotosPage Component", () => {
  const mockReport: TowerReport = {
    site_images: [
      {
        id: "1",
        url: "https://example.com/image1.jpg",
        label: "First Image",
        imgIndex: 0,
      },
      {
        id: "2",
        url: "https://example.com/image2.jpg",
        label: "Second Image",
        imgIndex: 1,
      },
    ],
  } as TowerReport;

  const mockTocSections: TOCSections[] = [
    { title: "Site Photos", pageNumber: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetchImageBatch mock before each test
    (fetchImageBatch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        "https://example.com/image1.jpg": "data:image/jpeg;base64,mock1",
        "https://example.com/image2.jpg": "data:image/jpeg;base64,mock2",
      }),
    );
  });

  it("renders site photos title", async () => {
    let rendered: any;

    await act(async () => {
      rendered = render(
        <SitePhotosPage
          report={mockReport}
          tocSections={mockTocSections}
          willCaptureToc={true}
        />,
      );
      await flushPromises();
    });

    expect(rendered!.getByTestId("toc-section")).toHaveTextContent(
      "Site Photos",
    );
  });

  it("loads and displays images correctly", async () => {
    let rendered: any;

    await act(async () => {
      rendered = render(
        <SitePhotosPage
          report={mockReport}
          tocSections={mockTocSections}
          willCaptureToc={false}
        />,
      );
      await flushPromises();
    });

    expect(fetchImageBatch).toHaveBeenCalledWith(mockReport.site_images);
    const images = rendered.container.getElementsByClassName("pdf-image");

    expect(images.length).toBe(2);
  });

  it("displays image labels with correct numbering", async () => {
    let rendered: any;

    await act(async () => {
      rendered = render(
        <SitePhotosPage
          report={mockReport}
          tocSections={mockTocSections}
          willCaptureToc={false}
        />,
      );
      await flushPromises();
    });

    expect(rendered.container.textContent).toContain("1. First Image");
    expect(rendered.container.textContent).toContain("2. Second Image");
  });

  it("maintains image order based on imgIndex", async () => {
    const unorderedReport = {
      ...mockReport,
      site_images: [
        {
          id: "2",
          url: "https://example.com/image2.jpg",
          label: "Second Image",
          imgIndex: 1,
        },
        {
          id: "1",
          url: "https://example.com/image1.jpg",
          label: "First Image",
          imgIndex: 0,
        },
      ],
    } as TowerReport;

    let rendered: any;

    await act(async () => {
      rendered = render(
        <SitePhotosPage
          report={unorderedReport}
          tocSections={mockTocSections}
          willCaptureToc={false}
        />,
      );
      await flushPromises();
    });

    const content = rendered.container.textContent;
    const firstIndex = content?.indexOf("First Image");
    const secondIndex = content?.indexOf("Second Image");

    expect(firstIndex).toBeLessThan(secondIndex!);
  });

  it("creates new page breaks for each pair of images", async () => {
    let rendered: any;

    await act(async () => {
      rendered = render(
        <SitePhotosPage
          report={mockReport}
          tocSections={mockTocSections}
          willCaptureToc={false}
        />,
      );
      await flushPromises();
    });

    const pageBreaks = rendered.container.querySelectorAll(
      '[data-break="true"]',
    );

    expect(pageBreaks.length).toBeGreaterThan(0);
  });
});
