"use client";

import React from "react";

interface TOCItem {
  title: string;
  id: string;
}

interface TableOfContentsMdxProps {
  items: TOCItem[];
  title: string;
}

export default function TableOfContentsMdx({
  items,
  title,
}: TableOfContentsMdxProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="table-of-contents">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
