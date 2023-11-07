import contentToHref from "@/libs/content/contentToHref";
import { Content, getAllContents } from "@/libs/content/getAllContents";
import markdownToHtml from "@/libs/markdown/markdownToHtml";
import getMarkdown from "@/libs/markdown/getMarkdown";

import "@/app/prism.css";

type Props = {
  params: {
    path: string[];
  };
};

export default async function Page({ params: { path } }: Props) {
  const filepath = decodeURIComponent(`contents/${path.join("/")}.md`);
  const markdown = await getMarkdown(filepath);
  const html = await markdownToHtml(markdown);

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
}

export async function generateStaticParams() {
  const flatten = (content: Content): Content[] => {
    if (content.kind === "file") {
      return [content];
    } else {
      return content.contents.flatMap(flatten);
    }
  };

  const contents = getAllContents("contents").flatMap(flatten);

  const path = contents
    .map((content) => contentToHref(content).split("/").slice(2))
    .map((path) => ({ path }));

  return path;
}
