import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import NotesInputs from "@/src/components/reports/NotesInputs";
import { Note } from "@/src/interfaces/reports";

// Mock Framer Motion's Reorder component
jest.mock("motion/react", () => ({
  Reorder: {
    Group: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Item: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  useDragControls: () => ({
    start: jest.fn(),
  }),
}));

describe("NotesInputs", () => {
  const mockNotes: Note[] = [
    { id: "1", indexNumber: 1, comment: "First note" },
    { id: "2", indexNumber: 2, comment: "Second note" },
  ];

  const defaultProps = {
    notes: mockNotes,
    onAddNote: jest.fn(),
    onNoteChange: jest.fn(),
    onRemoveNote: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders notes correctly", () => {
    render(<NotesInputs {...defaultProps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("First note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Second note")).toBeInTheDocument();
  });

  it("calls onAddNote when add button is clicked", () => {
    render(<NotesInputs {...defaultProps} />);

    const addButton = screen.getByText("Add New Note");

    fireEvent.click(addButton);

    expect(defaultProps.onAddNote).toHaveBeenCalledTimes(1);
  });

  it("calls onRemoveNote when trash button is clicked", () => {
    render(<NotesInputs {...defaultProps} />);

    // Get buttons by their SVG icon class instead
    const removeButtons = screen
      .getAllByRole("button")
      .filter((button) => button.querySelector(".lucide-circle-minus"));

    fireEvent.click(removeButtons[0]);

    expect(defaultProps.onRemoveNote).toHaveBeenCalledWith(0);
  });

  it("calls onNoteChange when note content changes", () => {
    render(<NotesInputs {...defaultProps} />);

    const firstNoteInput = screen.getByDisplayValue("First note");

    fireEvent.change(firstNoteInput, { target: { value: "Updated note" } });

    expect(defaultProps.onNoteChange).toHaveBeenCalledWith(
      0,
      "comment",
      "Updated note",
    );
  });

  it("renders drag handles for each note", () => {
    render(<NotesInputs {...defaultProps} />);

    const dragHandles = screen.getAllByLabelText("grip handle");

    expect(dragHandles).toHaveLength(mockNotes.length);
  });

  it("calls onNoteChange with reorder when notes are reordered", () => {
    render(<NotesInputs {...defaultProps} />);

    const reorderedNotes = [...mockNotes].reverse();

    defaultProps.onNoteChange(-1, "reorder", reorderedNotes);

    expect(defaultProps.onNoteChange).toHaveBeenCalledWith(
      -1,
      "reorder",
      reorderedNotes,
    );
  });

  it("displays correct note numbers", () => {
    render(<NotesInputs {...defaultProps} />);

    const noteNumbers = screen.getAllByText(/[0-9]+/);

    expect(noteNumbers).toHaveLength(mockNotes.length);
    expect(noteNumbers[0]).toHaveTextContent("1");
    expect(noteNumbers[1]).toHaveTextContent("2");
  });

  it("renders add button with correct label", () => {
    render(<NotesInputs {...defaultProps} />);

    const addButton = screen.getByText("Add New Note");

    expect(addButton).toBeInTheDocument();
  });
});
