import React from "react";
import { render } from "@testing-library/react";

import AppendixCTopHeader from "@/components/reports/pdfBlocks/rogers/AppendixCTopHeader";

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

describe("AppendixCTopHeader", () => {
  const mockProps = {
    formNb: "4",
    type: "Civil",
    title: "Antenna Structure and Site Works",
  };

  it("renders without crashing", () => {
    const { container } = render(<AppendixCTopHeader {...mockProps} />);

    expect(container).toBeTruthy();
  });

  it("renders with correct container style", () => {
    const { getByTestId } = render(<AppendixCTopHeader {...mockProps} />);
    const container = getByTestId("pdf-view");

    expect(container).toBeInTheDocument();
  });

  it("displays form number correctly", () => {
    const { getByTestId } = render(<AppendixCTopHeader {...mockProps} />);
    const text = getByTestId("pdf-text");

    expect(text.textContent).toContain(`FORM ${mockProps.formNb}`);
  });

  it("displays type correctly", () => {
    const { getByTestId } = render(<AppendixCTopHeader {...mockProps} />);
    const text = getByTestId("pdf-text");

    expect(text.textContent).toContain(mockProps.type);
  });

  it("displays title correctly", () => {
    const { getByTestId } = render(<AppendixCTopHeader {...mockProps} />);
    const text = getByTestId("pdf-text");

    expect(text.textContent).toContain(mockProps.title);
  });

  it("formats complete header text correctly", () => {
    const { getByTestId } = render(<AppendixCTopHeader {...mockProps} />);
    const text = getByTestId("pdf-text");
    const expectedText = `FORM ${mockProps.formNb}: ${mockProps.type} - ${mockProps.title}`;

    expect(text.textContent).toBe(expectedText);
  });

  it("applies correct text styles", () => {
    const { getByTestId } = render(<AppendixCTopHeader {...mockProps} />);
    const text = getByTestId("pdf-text");

    expect(text).toHaveAttribute("style");
  });

  it("handles empty strings gracefully", () => {
    const emptyProps = {
      formNb: "",
      type: "",
      title: "",
    };
    const { getByTestId } = render(<AppendixCTopHeader {...emptyProps} />);
    const text = getByTestId("pdf-text");

    expect(text.textContent).toBe("FORM :  - "); // Note the extra space after colon
  });
});
