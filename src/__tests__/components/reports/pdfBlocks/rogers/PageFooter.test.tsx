import React from "react";
import { render } from "@testing-library/react";

import PageFooter from "@/src/components/reports/pdfBlocks/rogers/PageFooter";

// Mock @react-pdf/renderer components and StyleSheet
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, render, style }: any) => {
    if (render) {
      return render({ pageNumber: 1, totalPages: 10 }); // Mock page numbers
    }

    return React.createElement(
      "div",
      { style, className: "pdf-text" },
      children,
    );
  },
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

describe("PageFooter Component", () => {
  it("renders page numbers correctly without jumping redlines", () => {
    const { container } = render(<PageFooter redlinePages={5} />);

    expect(container.textContent).toContain("Page 1 of 15"); // 10 + 5 redline pages
  });

  it("renders page numbers correctly with jumping redlines", () => {
    const { container } = render(
      <PageFooter jumpRedlines={true} redlinePages={5} />,
    );

    expect(container.textContent).toContain("Page 6 of 15"); // (1 + 5) and (10 + 5)
  });

  it("includes Rogers footer image", () => {
    const { container } = render(<PageFooter redlinePages={0} />);

    expect(container.innerHTML).toContain("rogers-footer.jpg");
  });

  it("applies correct styles to page numbers", () => {
    const { container } = render(<PageFooter redlinePages={0} />);

    expect(container.innerHTML).toContain("pdf-text");
  });

  it("applies correct styles to footer image", () => {
    const { container } = render(<PageFooter redlinePages={0} />);

    expect(container.innerHTML).toContain("pdf-image");
  });
});
