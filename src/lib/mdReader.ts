import path from "path";
import fs from "fs";

/**
 * Get a list of Markdown files in a specified subdirectory.
 *
 * @param {string} [subDir=""] - The subdirectory to search for Markdown files.
 * @returns {string[]} - An array of Markdown file names.
 */
export const getListOfFiles = (subDir: string = ""): string[] => {
  const contentDir = path.join(process.cwd(), "content", subDir);
  const files = fs.readdirSync(contentDir);

  return files.filter((file) => file.endsWith(".md"));
};
