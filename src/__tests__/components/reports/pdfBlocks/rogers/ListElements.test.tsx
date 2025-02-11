import React from "react";
import { render } from "@testing-library/react";

import {
  ListTitle,
  ListCheckingTitle,
  ListItem,
  SubListItem,
} from "@/src/components/reports/pdfBlocks/rogers/ListElements";

// Mock @react-pdf/renderer components and StyleSheet
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-text" }, children),
  View: ({ children, style }: any) =>
    React.createElement("div", { style, className: "pdf-view" }, children),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock pdfRenderUtils
jest.mock("@/lib/pdfRenderUtils", () => ({
  parseTextBold: (text: string) => [text], // Simple mock that returns text as is
}));

describe("List Elements Components", () => {
  describe("ListTitle", () => {
    it("renders title text correctly", () => {
      const { container } = render(<ListTitle title="Test Title" />);

      expect(container.textContent).toBe("Test Title");
    });
  });

  describe("ListCheckingTitle", () => {
    it("renders checking procedure title with correct format", () => {
      const { container } = render(
        <ListCheckingTitle letter="a" title="Safety Check" />,
      );

      expect(container.textContent).toBe("Checking Procedure A - Safety Check");
    });

    it("converts letter to uppercase", () => {
      const { container } = render(
        <ListCheckingTitle letter="b" title="Test Check" />,
      );

      expect(container.textContent).toBe("Checking Procedure B - Test Check");
    });
  });

  describe("ListItem", () => {
    it("renders number and text correctly", () => {
      const { container } = render(
        <ListItem number={1} text="Test list item" />,
      );

      expect(container.textContent).toBe("1.Test list item");
    });

    it("handles string numbers", () => {
      const { container } = render(
        <ListItem number="1.1" text="Test list item" />,
      );

      expect(container.textContent).toBe("1.1.Test list item");
    });

    it("processes bold text markers", () => {
      const { container } = render(
        <ListItem number={1} text="Test **bold** text" />,
      );

      expect(container.innerHTML).toContain("Test **bold** text");
    });
  });

  describe("SubListItem", () => {
    it("converts number to letter and renders text correctly", () => {
      const { container } = render(
        <SubListItem number="0" text="First sub item" />,
      );

      expect(container.textContent).toBe("a.First sub item");
    });

    it("handles different number inputs correctly", () => {
      const { container } = render(
        <SubListItem number="1" text="Second sub item" />,
      );

      expect(container.textContent).toBe("b.Second sub item");
    });

    it("maintains correct letter sequence", () => {
      const { container: c1 } = render(<SubListItem number="0" text="a" />);
      const { container: c2 } = render(<SubListItem number="1" text="b" />);
      const { container: c3 } = render(<SubListItem number="2" text="c" />);

      expect(c1.textContent).toBe("a.a");
      expect(c2.textContent).toBe("b.b");
      expect(c3.textContent).toBe("c.c");
    });
  });
});
