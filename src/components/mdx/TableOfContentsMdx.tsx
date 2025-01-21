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
      const yOffset = -100; // Adjust this value based on your header height or desired offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
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

