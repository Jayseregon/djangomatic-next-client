import React from "react";
import { render } from "@testing-library/react";

import AppendixB from "@/components/reports/pdfBlocks/rogers/AppendixB";
import { TOCSections } from "@/src/interfaces/reports";
import sideImageList from "public/reports/rogers/appendixBSideImageList.json";
import checkingProceduresList from "public/reports/rogers/appendixBCheckingProceduresList.json";

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
    <div data-testid="pdf-view" data-wrap={wrap?.toString()} style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
  Image: ({ src, style }: { src: string; style?: any }) => (
    <img alt="pdf" data-testid="pdf-image" src={src} style={style} />
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock child components
jest.mock("@/components/reports/pdfBlocks/rogers/TOCSection", () => ({
  __esModule: true,
  default: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div data-testid={`toc-section-${id}`}>{children}</div>
  ),
}));

jest.mock("@/components/reports/pdfBlocks/rogers/ListElements", () => ({
  ListTitle: ({ title }: { title: string }) => (
    <div data-testid="list-title">{title}</div>
  ),
  ListItem: ({ number, text }: { number: string; text: string }) => (
    <div data-testid="list-item">{`${number}. ${text}`}</div>
  ),
  ListCheckingTitle: ({ letter, title }: { letter: string; title: string }) => (
    <div data-testid="list-checking-title">{`${letter}. ${title}`}</div>
  ),
  SubListItem: ({ number, text }: { number: string; text: string }) => (
    <div data-testid="sub-list-item">{`${number}. ${text}`}</div>
  ),
}));

describe("AppendixB", () => {
  const mockProps = {
    tocSections: [
      { title: "Appendix B", pageNumber: 1 },
      { title: "Field Inspection Checking Procedures", pageNumber: 2 },
    ] as TOCSections[],
    willCaptureToc: true,
    redlinePages: 5,
  };

  it("renders without crashing", () => {
    const { container } = render(<AppendixB {...mockProps} />);

    expect(container).toBeTruthy();
  });

  it("renders title page with correct TOC sections", () => {
    const { getByTestId } = render(<AppendixB {...mockProps} />);

    expect(getByTestId("toc-section-appendix-b")).toHaveTextContent(
      "Appendix B",
    );
    expect(
      getByTestId("toc-section-field-inspection-checking-procedures"),
    ).toHaveTextContent("Field Inspection Checking Procedures");
  });

  it("renders introduction text", () => {
    const { getAllByTestId } = render(<AppendixB {...mockProps} />);
    const texts = getAllByTestId("pdf-text");

    expect(texts[0].textContent).toContain("The following outlines");
  });

  it("renders side image list with actual content", () => {
    const { getAllByTestId } = render(<AppendixB {...mockProps} />);
    const listTitles = getAllByTestId("list-title");

    expect(listTitles[0]).toHaveTextContent(sideImageList.list1.title);
  });

  it("renders tower schema image", () => {
    const { getByTestId } = render(<AppendixB {...mockProps} />);
    const image = getByTestId("pdf-image");

    expect(image).toHaveAttribute("src", "/reports/rogers/tower-schema.jpg");
  });

  it("renders checking procedures lists", () => {
    const { getAllByTestId } = render(<AppendixB {...mockProps} />);
    const checkingTitles = getAllByTestId("list-checking-title");
    const firstListKey = Object.keys(
      checkingProceduresList,
    )[0] as keyof typeof checkingProceduresList;
    const firstList = checkingProceduresList[firstListKey];

    expect(checkingTitles[0]).toHaveTextContent(
      `${firstList.title.letter}. ${firstList.title.title}`,
    );
  });

  it("handles nested list items correctly", () => {
    const { getAllByTestId } = render(<AppendixB {...mockProps} />);
    const listItems = getAllByTestId("list-item");
    const subListItems = getAllByTestId("sub-list-item");

    expect(listItems).toBeTruthy();
    expect(subListItems).toBeTruthy();
  });

  it("sets wrap={false} on all pages", () => {
    const { getAllByTestId } = render(<AppendixB {...mockProps} />);
    const pages = getAllByTestId("pdf-view");

    pages.forEach((page) => {
      const wrap = page.getAttribute("data-wrap");

      if (wrap !== null) {
        expect(wrap).toBe("false");
      }
    });
  });
});
