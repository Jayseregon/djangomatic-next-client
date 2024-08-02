import path from "path";
import fs from "fs";

export const getListOfFiles = (subDir: string = "") => {
  const contentDir = path.join(process.cwd(), "content", subDir);
  const files = fs.readdirSync(contentDir);

  return files.filter((file) => file.endsWith(".md"));
};
