import React from "react";

import { Note } from "@/src/types/reports";

import { ListItem } from "./ListElements";

const PageNotes = ({ items }: { items: Note[] }) => (
  <>
    {items.map((item, index) => (
      <ListItem key={index} number={item.indexNumber} text={item.comment} />
    ))}
  </>
);

export default PageNotes;
