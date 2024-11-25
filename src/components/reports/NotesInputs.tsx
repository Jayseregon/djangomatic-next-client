import React from "react";

import { NotesInputsProps } from "@/interfaces/reports";
import { TrashButton, AddButton, NoteInput } from "@/components/ui/formInput";

export default function NotesInputs({
  notes,
  onAddNote,
  onNoteChange,
  onRemoveNote,
}: NotesInputsProps) {
  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onNoteChange(index, "comment", event.target.value);
  };

  return (
    <div className="space-y-4">
      {notes.map((note, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="min-w-[50px] text-center text-foreground">
            {index + 1}.
          </span>

          <NoteInput
            id={`note-${index}`}
            value={note.comment}
            onChange={(e) => handleChange(index, e)}
          />

          <TrashButton onClick={() => onRemoveNote(index)} />
        </div>
      ))}
      <AddButton label="Add New Note" onClick={onAddNote} />
    </div>
  );
}
