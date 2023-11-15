import contentToHref from "@/libs/content/contentToHref";
import { Content, getAllContents } from "@/libs/content/getAllContents";
import markdownToHtml from "@/libs/markdown/markdownToHtml";
import getMarkdown from "@/libs/markdown/getMarkdown";

import "@/app/prism.css";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";
import { MainNavigation } from "@/components/MainNavigation";

type Props = {
  params: {
    path: string[];
  };
};

export default async function Page({ params: { path } }: Props) {
  const filepath = decodeURIComponent(`contents/${path.join("/")}`);
  const markdown = await getMarkdown(filepath);
  const [contentsHtml, tocHtml] = await markdownToHtml(markdown);

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: "'navigation main toc'",
        gridTemplateColumns: "minmax(0, 15rem) minmax(0, 1fr) minmax(0, 16rem)",
        gridGap: "2rem",
        margin: "1rem",
        overflowWrap: "break-word",
      })}
    >
      <div
        className={css({
          display: "contents",
          zIndex: "auto",
          ["--offset"]: "2rem",
        })}
      >
        <aside
          className={flex({
            gridArea: "navigation",
            width: "100%",
            overflow: "auto",
            position: "sticky",
            top: "var(--offset)",
            maxHeight: "calc(100vh - var(--offset))",
          })}
        >
          <MainNavigation />
        </aside>

        <aside
          className={css({
            gridArea: "toc",
            position: "sticky",
            top: "var(--offset)",
            maxHeight: "calc(100vh - var(--offset))",
          })}
          dangerouslySetInnerHTML={{ __html: tocHtml }}
        />
      </div>

      <main
        className={css({
          gridArea: "main",
        })}
      >
        <article
          className={css({
            display: "flex",
            flexDirection: "column",
          })}
          dangerouslySetInnerHTML={{ __html: contentsHtml }}
        />
      </main>
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
