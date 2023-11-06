import { Content } from "./getAllContents";

export default function contentToHref(content: Content): string {
  if (content.kind === "file") {
    return "/" + content.path.replace(/\.md$/, "");
  } else {
    return "/" + content.path;
  }
}
