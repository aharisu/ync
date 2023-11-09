import contentToHref from "@/libs/content/contentToHref";
import { Content, getAllContents } from "@/libs/content/getAllContents";
import markdownToHtml from "@/libs/markdown/markdownToHtml";
import getMarkdown from "@/libs/markdown/getMarkdown";

import "@/app/prism.css";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

type Props = {
  params: {
    path: string[];
  };
};

export default async function Page({ params: { path } }: Props) {
  const filepath = decodeURIComponent(`contents/${path.join("/")}.md`);
  const markdown = await getMarkdown(filepath);
  const html = await markdownToHtml(markdown);

  return (
    <div
      className={css({
        flex: "1 1 auto",
        width: 0,
        padding: "1rem",
        overflowWrap: "break-word",
        overflowY: "auto",
      })}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "minmax(0, 2.5fr) minmax(0, 16rem)",
          gridGap: "1rem",
          "& > .contents": {
            gridColumn: "1 / 2",
          },
          "& > .toc-container": {
            gridColumn: "2 / 3",
            height: "fit-content",
            position: "sticky",
            top: "1rem",
            padding: "1rem",
          },
        })}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
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
