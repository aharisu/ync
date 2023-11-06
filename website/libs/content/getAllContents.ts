import fs from "fs";

export type Content =
  | {
      kind: "directory";
      name: string;
      path: string;
      contents: Content[];
    }
  | {
      kind: "file";
      name: string;
      path: string;
    };

export function getAllContents(dirPath: string): Content[] {
  const contents: Content[] = [];

  //dirPath以下のディレクトリとファイルをすべて取得
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
    const name = entry.name;
    const path = `${dirPath}/${name}`;

    if (entry.isFile()) {
      //nameの末尾が.mdのファイルのみ取得
      if (name.endsWith(".md")) {
        contents.push({
          kind: "file",
          name,
          path,
        });
      }
    } else if (entry.isDirectory()) {
      const nestContents = getAllContents(path);
      if (nestContents.length > 0) {
        contents.push({
          kind: "directory",
          name,
          path,
          contents: nestContents,
        });
      }
    }
  });

  return contents;
}
