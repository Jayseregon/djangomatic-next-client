import React from "react";
import { render } from "@testing-library/react";

import ScopeOfWorkPage from "@/src/components/reports/pdfBlocks/rogers/ScopeOfWorkPage";
import { TOCSections, TowerReport } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer components
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-text" }, children),
  View: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-view" }, children),
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

describe("ScopeOfWorkPage Component", () => {
  const mockReport: TowerReport = {
    design_standard: "CSA S37-18",
    jde_job: "123456",
    assigned_peng: "John Smith, P.Eng.",
  } as TowerReport;

  const mockTocSections: TOCSections[] = [
    { title: "Scope of Work", pageNumber: 1 },
  ];

  it("renders scope of work title", () => {
    const { getByTestId } = render(
      <ScopeOfWorkPage
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={true}
      />,
    );

    expect(getByTestId("toc-section")).toHaveTextContent("Scope of Work");
  });

  it("displays design standard correctly", () => {
    const { container } = render(
      <ScopeOfWorkPage
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={false}
      />,
    );

    expect(container.textContent).toContain("CSA S37-18");
  });

  it("shows project number", () => {
    const { container } = render(
      <ScopeOfWorkPage
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={false}
      />,
    );

    expect(container.textContent).toContain("#123456");
  });

  it("displays assigned P.Eng.", () => {
    const { container } = render(
      <ScopeOfWorkPage
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={false}
      />,
    );

    expect(container.textContent).toContain("John Smith, P.Eng.");
  });

  it("includes standard compliance text", () => {
    const { container } = render(
      <ScopeOfWorkPage
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={false}
      />,
    );

    expect(container.textContent).toContain(
      "Telecon Design Inc. has carried out an inspection",
    );
    expect(container.textContent).toContain(
      "Rogers Post Construction Inspection requirements",
    );
  });

  it("shows report approval section", () => {
    const { container } = render(
      <ScopeOfWorkPage
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={false}
      />,
    );

    expect(container.textContent).toContain("Report approved by:");
  });
});
