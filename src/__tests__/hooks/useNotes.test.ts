import { renderHook, act } from "@testing-library/react";

import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/interfaces/reports";

// Mock uuid to have predictable ids in tests
jest.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

describe("useNotes", () => {
  const mockInitialNotes: Note[] = [
    {
      id: "1",
      indexNumber: 1,
      comment: "First note",
    },
    {
      id: "2",
      indexNumber: 2,
      comment: "Second note",
    },
  ];

  it("should initialize with empty array when no initial notes provided", () => {
    const { result } = renderHook(() => useNotes());

    expect(result.current.notes).toEqual([]);
  });

  it("should initialize with provided initial notes", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));

    expect(result.current.notes).toEqual(mockInitialNotes);
  });

  it("should add new note correctly", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));
    const initialLength = result.current.notes.length;

    act(() => {
      result.current.addNote();
    });

    expect(result.current.notes.length).toBe(initialLength + 1);
    expect(result.current.notes[initialLength]).toEqual({
      id: "test-uuid",
      indexNumber: initialLength + 1,
      comment: "",
    });
  });

  it("should update note field correctly", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));

    act(() => {
      result.current.updateNote(0, "comment", "Updated comment");
    });

    expect(result.current.notes[0].comment).toBe("Updated comment");
  });

  it("should handle note reordering", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));
    const reorderedNotes = [...mockInitialNotes].reverse();

    act(() => {
      result.current.updateNote(0, "reorder", reorderedNotes);
    });

    expect(result.current.notes[0].indexNumber).toBe(1);
    expect(result.current.notes[1].indexNumber).toBe(2);
    expect(result.current.notes[0].id).toBe(mockInitialNotes[1].id);
  });

  it("should remove note and reindex remaining notes", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));

    act(() => {
      result.current.removeNote(0);
    });

    expect(result.current.notes.length).toBe(mockInitialNotes.length - 1);
    expect(result.current.notes[0].indexNumber).toBe(1);
    expect(result.current.notes[0].id).toBe(mockInitialNotes[1].id);
  });

  it("should set notes directly using setNotes", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.setNotes(mockInitialNotes);
    });

    expect(result.current.notes).toEqual(mockInitialNotes);
  });

  it("should maintain correct indexing when adding multiple notes", () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote();
      result.current.addNote();
      result.current.addNote();
    });

    expect(result.current.notes.map((note) => note.indexNumber)).toEqual([
      1, 2, 3,
    ]);
  });

  it("should preserve other fields when updating a specific field", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));
    const originalNote = { ...mockInitialNotes[0] };

    act(() => {
      result.current.updateNote(0, "comment", "New comment");
    });

    expect(result.current.notes[0].comment).toBe("New comment");
    expect(result.current.notes[0].id).toBe(originalNote.id);
    expect(result.current.notes[0].indexNumber).toBe(originalNote.indexNumber);
  });

  it("should handle removing notes from any position", () => {
    const { result } = renderHook(() => useNotes(mockInitialNotes));

    act(() => {
      result.current.removeNote(1); // Remove last note
    });

    expect(result.current.notes.length).toBe(1);
    expect(result.current.notes[0].indexNumber).toBe(1);
    expect(result.current.notes[0].id).toBe(mockInitialNotes[0].id);
  });
});
