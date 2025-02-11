import React from "react";
import { render } from "@testing-library/react";

import AuthorPage from "@/components/reports/pdfBlocks/rogers/AuthorPage";
import { TowerReport } from "@/interfaces/reports";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-view" style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe("AuthorPage", () => {
  const mockReport: Partial<TowerReport> = {
    site_code: "TEST123",
    tower_site_name: "Test Tower",
    site_region: "Test Region",
    client_name: "John Doe",
  };

  it("renders without crashing", () => {
    const { container } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );

    expect(container).toBeTruthy();
  });

  it("renders the title correctly", () => {
    const { getAllByTestId } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );
    const textElements = getAllByTestId("pdf-text");

    const titleElement = textElements.find(
      (element) =>
        element.textContent === "post construction inspection report",
    );

    expect(titleElement).toBeTruthy();
  });

  it("displays site information correctly", () => {
    const { getAllByTestId } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );
    const textElements = getAllByTestId("pdf-text");

    const siteInfoElement = textElements.find(
      (element) =>
        element.textContent ===
        `${mockReport.site_code} - ${mockReport.tower_site_name}, ${mockReport.site_region}`,
    );

    expect(siteInfoElement).toBeTruthy();
  });

  it("renders Telecon Design information", () => {
    const { getAllByTestId } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );
    const textElements = getAllByTestId("pdf-text");

    const teleconElement = textElements.find(
      (element) => element.textContent === "Telecon Design Inc.",
    );

    expect(teleconElement).toBeTruthy();

    const addressElement = textElements.find(
      (element) => element.textContent === "7777 Weston Rd., Vaughan, ON",
    );

    expect(addressElement).toBeTruthy();
  });

  it("renders Rogers information correctly", () => {
    const { getAllByTestId } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );
    const textElements = getAllByTestId("pdf-text");

    const clientNameElement = textElements.find(
      (element) => element.textContent === mockReport.client_name,
    );

    expect(clientNameElement).toBeTruthy();

    const companyElement = textElements.find(
      (element) => element.textContent === "Rogers Communications Inc",
    );

    expect(companyElement).toBeTruthy();

    const addressElements = textElements.filter(
      (element) =>
        element.textContent === "8200 Dixie Rd" ||
        element.textContent === "Brampton, ON L6T 0C1",
    );

    expect(addressElements).toHaveLength(2);
  });

  it("renders section headers", () => {
    const { getAllByTestId } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );
    const textElements = getAllByTestId("pdf-text");

    const byElement = textElements.find(
      (element) => element.textContent === "by:",
    );

    expect(byElement).toBeTruthy();

    const presentedToElement = textElements.find(
      (element) => element.textContent === "presented to:",
    );

    expect(presentedToElement).toBeTruthy();
  });

  it("applies correct container style", () => {
    const { getByTestId } = render(
      <AuthorPage report={mockReport as TowerReport} />,
    );
    const container = getByTestId("pdf-view");

    expect(container).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      lineHeight: 1.5,
    });
  });
});
