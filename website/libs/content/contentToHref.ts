import { Content } from "./getAllContents";

export default function contentToHref(content: Content): string {
  if (content.kind === "file") {
    return "/" + content.path.replace(/\/[0-9]{2}_/, "/").replace(/\.md$/, "");
  } else {
    return "/" + content.path;
  }
}
