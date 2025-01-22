import fs from "fs";
import path from "path";

export const docsDirectory = (docType: string) =>
  path.join(process.cwd(), `public/content/${docType}`);

export async function getDocContent(docType: string, slug: string) {
  const filePath = path.join(docsDirectory(docType), `${slug}.mdx`);

  return fs.promises.readFile(filePath, "utf8");
}
