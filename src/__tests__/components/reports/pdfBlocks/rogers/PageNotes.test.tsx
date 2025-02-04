import React from "react";
import { render } from "@testing-library/react";

import PageNotes from "@/src/components/reports/pdfBlocks/rogers/PageNotes";
import { Note } from "@/src/interfaces/reports";

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

// Mock pdfRenderUtils since ListItem uses it
jest.mock("@/lib/pdfRenderUtils", () => ({
  parseTextBold: (text: string) => [text],
}));

describe("PageNotes Component", () => {
  const mockNotes: Note[] = [
    {
      indexNumber: 1, // Changed from string to number
      comment: "First note",
      id: "",
    },
    {
      indexNumber: 2, // Changed from string to number
      comment: "Second note",
      id: "",
    },
    {
      indexNumber: 3, // Changed from string to number
      comment: "Third note with **bold** text",
      id: "",
    },
  ];

  it("renders all notes correctly", () => {
    const { container } = render(<PageNotes items={mockNotes} />);

    mockNotes.forEach((note) => {
      expect(container.textContent).toContain(note.comment);
      expect(container.textContent).toContain(`${note.indexNumber}.`); // Add dot and convert to string
    });
  });

  it("renders empty list when no notes provided", () => {
    const { container } = render(<PageNotes items={[]} />);

    expect(container.children.length).toBe(0);
  });

  it("preserves note order", () => {
    const { container } = render(<PageNotes items={mockNotes} />);
    const content = container.textContent;

    // Check that notes appear in correct order
    const firstIndex = content?.indexOf("First note");
    const secondIndex = content?.indexOf("Second note");
    const thirdIndex = content?.indexOf("Third note");

    expect(firstIndex).toBeLessThan(secondIndex!);
    expect(secondIndex).toBeLessThan(thirdIndex!);
  });

  it("handles notes with special formatting", () => {
    const specialNotes: Note[] = [
      {
        indexNumber: 1, // Changed from string to number
        comment: "Note with **bold** text",
        id: "",
      },
    ];

    const { container } = render(<PageNotes items={specialNotes} />);

    expect(container.textContent).toContain("Note with **bold** text");
  });
});
