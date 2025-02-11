import React from "react";
import { render } from "@testing-library/react";

import TableOfContentsPage from "@/src/components/reports/pdfBlocks/rogers/TableOfContentsPage";
import { TOCSections } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer components
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, style, id }: any) => (
    <div data-id={id} data-testid="pdf-text" style={style}>
      {children}
    </div>
  ),
  View: ({ children, style }: any) => (
    <div data-testid="pdf-view" style={style}>
      {children}
    </div>
  ),
  Link: ({ children, src, style }: any) => (
    <a data-testid="pdf-link" href={src} style={style}>
      {children}
    </a>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe("TableOfContentsPage Component", () => {
  const mockTocSections: TOCSections[] = [
    { title: "Front Page", pageNumber: 1 },
    { title: "Table of Contents", pageNumber: 2 },
    { title: "Scope of Work", pageNumber: 3 },
    { title: "Appendix A", pageNumber: 4 },
  ];

  it("renders the title correctly", () => {
    const { container } = render(
      <TableOfContentsPage tocSections={mockTocSections} />,
    );

    const title = container.querySelector('[data-id="table-of-contents"]');

    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe("Table of contents");
  });

  it("renders all sections", () => {
    const { getAllByTestId } = render(
      <TableOfContentsPage tocSections={mockTocSections} />,
    );

    const sections = getAllByTestId("pdf-text");

    expect(sections.length).toBeGreaterThan(mockTocSections.length); // Account for dots and page numbers
    mockTocSections.forEach((section) => {
      expect(
        sections.some((el) => el.textContent?.includes(section.title)),
      ).toBeTruthy();
    });
  });

  it("generates correct links for non-appendix sections", () => {
    const { getAllByTestId } = render(
      <TableOfContentsPage tocSections={mockTocSections} />,
    );

    const links = getAllByTestId("pdf-link");

    expect(links).toHaveLength(mockTocSections.length - 1); // All except Appendix

    expect(links[0]).toHaveAttribute("href", "#front-page");
    expect(links[1]).toHaveAttribute("href", "#table-of-contents");
    expect(links[2]).toHaveAttribute("href", "#scope-of-work");
  });

  it("renders appendix sections without links", () => {
    const { container } = render(
      <TableOfContentsPage tocSections={mockTocSections} />,
    );

    const appendixText = Array.from(
      container.querySelectorAll('[data-testid="pdf-text"]'),
    ).find((el) => el.textContent === "Appendix A");

    expect(appendixText).toBeTruthy();
    expect(appendixText?.closest('[data-testid="pdf-link"]')).toBeFalsy();
  });

  it("generates dots between title and page number", () => {
    const { getAllByTestId } = render(
      <TableOfContentsPage tocSections={mockTocSections} />,
    );

    const dots = getAllByTestId("pdf-text").filter((el) =>
      el.textContent?.includes("."),
    );

    // Should have dots for non-appendix sections
    expect(dots.length).toBeGreaterThan(0);
    dots.forEach((dot) => {
      expect(dot.textContent?.includes(".")).toBeTruthy();
    });
  });
});
