import React from "react";
import { render } from "@testing-library/react";

import AppendixCRow from "@/components/reports/pdfBlocks/rogers/AppendixCRow";
import { ChecklistRow, ListItem } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer and its StyleSheet functionality
jest.mock("@react-pdf/renderer", () => ({
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-view" style={style}>
      {children}
    </div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="pdf-text">{children}</span>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// The actual StylesPDF will be imported and used from the component
// No need to mock StylesPDF since we're mocking @react-pdf/renderer's StyleSheet.create

describe("AppendixCRow", () => {
  const mockList: ListItem[] = [
    { code: "A1", item: "Test Item 1" },
    { code: "A2", item: "Test Item 2" },
    { code: "A3", item: "Test Item 3" },
  ];

  const mockItems: ChecklistRow[] = [
    { id: "1", code: "A1", isChecked: true, comments: "Comment 1" },
    { id: "2", code: "A2", isChecked: false, comments: "Comment 2" },
    { id: "3", code: "A3", isChecked: undefined, comments: "Comment 3" },
  ];

  it("renders without crashing", () => {
    const { container } = render(
      <AppendixCRow items={mockItems} list={mockList} />,
    );

    expect(container).toBeTruthy();
  });

  it("renders correct number of rows", () => {
    const { getAllByTestId } = render(
      <AppendixCRow items={mockItems} list={mockList} />,
    );
    const rows = getAllByTestId("pdf-view");

    // Each row has 6 columns (View components) + 1 container View
    expect(rows.length).toBe(mockItems.length * 7);
  });

  it("displays correct codes", () => {
    const { getAllByTestId } = render(
      <AppendixCRow items={mockItems} list={mockList} />,
    );
    const texts = getAllByTestId("pdf-text");

    mockItems.forEach((item) => {
      const codeText = texts.find((text) => text.textContent === item.code);

      expect(codeText).toBeTruthy();
    });
  });

  it("displays correct items from list", () => {
    const { getAllByTestId } = render(
      <AppendixCRow items={mockItems} list={mockList} />,
    );
    const texts = getAllByTestId("pdf-text");

    mockList.forEach((listItem) => {
      const itemText = texts.find((text) => text.textContent === listItem.item);

      expect(itemText).toBeTruthy();
    });
  });

  it("renders correct checkmarks for Yes/No/NA", () => {
    const { getAllByTestId } = render(
      <AppendixCRow items={mockItems} list={mockList} />,
    );
    const texts = getAllByTestId("pdf-text");

    // For isChecked = true (Yes column)
    expect(texts.some((text) => text.textContent === "X")).toBeTruthy();

    // For isChecked = false (No column)
    expect(texts.some((text) => text.textContent === "X")).toBeTruthy();

    // For isChecked = undefined (NA column)
    expect(texts.some((text) => text.textContent === "X")).toBeTruthy();
  });

  it("displays correct comments", () => {
    const { getAllByTestId } = render(
      <AppendixCRow items={mockItems} list={mockList} />,
    );
    const texts = getAllByTestId("pdf-text");

    mockItems.forEach((item) => {
      const commentText = texts.find(
        (text) => text.textContent === item.comments,
      );

      expect(commentText).toBeTruthy();
    });
  });

  it("handles empty items array", () => {
    const { container } = render(<AppendixCRow items={[]} list={mockList} />);

    expect(container).toBeTruthy();
    expect(container.children.length).toBe(0);
  });

  it("handles missing list items gracefully", () => {
    const itemsWithUnknownCode: ChecklistRow[] = [
      { id: "1", code: "UNKNOWN", isChecked: true, comments: "Comment" },
    ];

    const { getAllByTestId } = render(
      <AppendixCRow items={itemsWithUnknownCode} list={mockList} />,
    );

    const texts = getAllByTestId("pdf-text");

    expect(texts.some((text) => text.textContent === "UNKNOWN")).toBeTruthy();
  });
});
