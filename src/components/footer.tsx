import React from "react";

import { HeartFooterIcon } from "./icons";

interface FooterProps {
  nonce?: string;
}

export const Footer = ({ nonce }: FooterProps) => {
  return (
    <footer
      className="w-full flex items-center justify-center py-3 text-slate-300 dark:text-slate-700 space-x-1"
      nonce={nonce || undefined}
    >
      <span>Made with</span>
      <HeartFooterIcon size={20} />
      <span>in Canada</span>
      <span>&copy; {new Date().getFullYear()} Telecon Design</span>
    </footer>
  );
};
