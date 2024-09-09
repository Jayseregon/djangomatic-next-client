import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Sanitize the file name by replacing spaces and special characters.
 *
 * @param {string} fileName - The original file name.
 * @returns {string} - The sanitized file name.
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "")
    .toLowerCase();
}

export function extractAzureFileData(filePath: string): (string | undefined)[] {
  const splitParts = filePath.split("/");
  const fileName = splitParts.pop();
  const dir = splitParts[0];
  const baseName = fileName?.split(".")[0];
  const extension = fileName?.split(".")?.pop();

  return [baseName, extension, dir] || ["", "", ""];
}

export function formatAzureDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function titleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
