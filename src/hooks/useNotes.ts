import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { Note } from "@/interfaces/reports";

export const useNotes = (initialNotes: Note[] = []) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote = useCallback(() => {
    setNotes((prev) => [
      ...prev,
      {
        id: uuidv4(),
        indexNumber: prev.length + 1,
        comment: "",
      },
    ]);
  }, []);

  const updateNote = useCallback((index: number, field: string, value: any) => {
    if (field === "reorder") {
      const reindexedNotes = value.map((note: Note, idx: number) => ({
        ...note,
        indexNumber: idx + 1,
      }));

      setNotes(reindexedNotes);
    } else {
      setNotes((prev) => {
        const updatedNotes = [...prev];

        updatedNotes[index] = {
          ...updatedNotes[index],
          [field]: value,
        };

        return updatedNotes;
      });
    }
  }, []);

  const removeNote = useCallback((index: number) => {
    setNotes((prev) => {
      const filtered = prev.filter((_, i) => i !== index);

      return filtered.map((note, i) => ({
        ...note,
        indexNumber: i + 1,
      }));
    });
  }, []);

  return {
    notes,
    setNotes,
    addNote,
    updateNote,
    removeNote,
  };
};
