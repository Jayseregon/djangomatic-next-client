import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { RnDTeamTask, Status } from "@/interfaces/lib";

/**
 * Merge Tailwind CSS classes with clsx.
 *
 * @param {...ClassValue[]} inputs - The class values to merge.
 * @returns {string} - The merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or timestamp into a readable date format.
 *
 * @param {string | number} input - The date string or timestamp.
 * @returns {string} - The formatted date string.
 */
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

/**
 * Extract Azure file data from a file path.
 *
 * @param {string} filePath - The file path.
 * @returns {(string | undefined)[]} - An array containing the base name, extension, and directory.
 */
export function extractAzureFileData(filePath: string): (string | undefined)[] {
  const splitParts = filePath.split("/");
  const fileName = splitParts.pop();
  const dir = splitParts[0];
  const baseName = fileName?.split(".")[0];
  const extension = fileName?.split(".")?.pop();

  return [baseName || "", extension || "", dir || ""];
}

/**
 * Format an Azure date string into a readable date format.
 *
 * @param {string} dateString - The Azure date string.
 * @returns {string} - The formatted date string.
 */
export function formatAzureDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Convert a string to title case.
 *
 * @param {string} str - The string to convert.
 * @returns {string} - The title-cased string.
 */
export function titleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Strip HTML tags from a string and return only the text content.
 *
 * @param {string} html - The HTML string to strip tags from.
 * @returns {string} - The plain text content.
 */
export const stripHtmlTags = (html: string): string => {
  if (typeof window === "undefined") {
    return html; // Return the original HTML string if running on the server
  }
  const tempDiv = document.createElement("div");

  tempDiv.innerHTML = html;

  return tempDiv.textContent || tempDiv.innerText || "";
};

export const maskPassword = (password: string): string => {
  return "*".repeat(password.length);
};

// utils/dateUtils.ts
export const convertTaskDates = (task: any): RnDTeamTask => ({
  ...task,
  createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
  completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
});

export const statusColorMap: Record<
  Status,
  "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  [Status.CREATED]: "secondary",
  [Status.PENDING]: "primary",
  [Status.BLOCKED]: "warning",
  [Status.COMPLETED]: "success",
  [Status.CANCELLED]: "danger",
};
