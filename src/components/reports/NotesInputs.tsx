import React from "react";
import { Reorder, useDragControls } from "motion/react";
import { NotesInputsProps } from "@/interfaces/reports";
import { TrashButton, AddButton, NoteInput } from "@/components/ui/formInput";
import { Grip } from "lucide-react";

export default function NotesInputs({
  notes,
  onAddNote,
  onNoteChange,
  onRemoveNote,
}: NotesInputsProps) {
  const dragControls = useDragControls();
  return (
    <div className="space-y-4">
      <Reorder.Group
        axis="y"
        values={notes}
        className="space-y-4"
        onReorder={(newNotes) => onNoteChange(-1, "reorder", newNotes)}>
        {notes.map((note, index) => (
          <Reorder.Item
            key={note.id || index}
            value={note}
            dragControls={dragControls}>
            <div className="flex items-center space-x-2">
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="cursor-grab">
                <Grip color="#4b5563" />
              </div>
              <span className="min-w-[50px] text-center text-foreground">
                {index + 1}
              </span>
              <NoteInput
                id={`note-${index}`}
                value={note.comment}
                onChange={(e) => onNoteChange(index, "comment", e.target.value)}
              />
              <TrashButton onClick={() => onRemoveNote(index)} />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <AddButton
        label="Add New Note"
        onClick={onAddNote}
      />
    </div>
  );
}
