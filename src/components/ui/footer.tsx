import React from "react";

import { HeartFooterIcon } from "../icons";

interface FooterProps {
  nonce?: string;
}

/**
 * Footer component renders the footer section of the website.
 * It displays a message indicating that the site was made with love in Canada and includes the current year.
 *
 * @param {Object} props - The props for the Footer component.
 * @param {string} [props.nonce] - Optional nonce for the component.
 * @returns {JSX.Element} The rendered Footer component.
 */
export const Footer = ({ nonce }: FooterProps): JSX.Element => {
  return (
    <footer
      className="w-full flex items-center justify-center py-3 text-slate-300 dark:text-slate-700 space-x-1"
      nonce={nonce || undefined}>
      <span>Made with</span>
      <HeartFooterIcon size={20} />
      <span>in Canada</span>
      <span>&copy; {new Date().getFullYear()} Telecon Design</span>
    </footer>
  );
};
