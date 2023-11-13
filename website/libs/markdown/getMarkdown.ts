import fs from "fs/promises";

export default async function getMarkdown(href: string) {
  const parts = href.split("/");

  const dir = parts.slice(0, -1).join("/");
  const filename = parts[parts.length - 1] + ".md";

  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.replace(/^[0-9]{2}_/, "") === filename) {
      return await fs.readFile(`${dir}/${entry.name}`, "utf-8");
    }
  }

  throw new Error(`File not found: ${href}`);
}
