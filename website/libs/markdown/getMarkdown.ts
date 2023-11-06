import fs from "fs/promises";

export default async function getMarkdown(path: string) {
  return fs.readFile(path, "utf-8");
}
