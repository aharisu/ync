import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypePrism from "rehype-prism-plus";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import rehypeToc from "rehype-toc";
import rehypeSlug from "rehype-slug";

export default async function markdownToHtml(
  markdown: string
): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkDirective)
    .use(myRemarkPlugin)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeToc, {
      position: "beforeend",
      headings: ["h2", "h3", "h4"],
      customizeTOC: customizeTOC,
    })
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

function customizeTOC(toc: any) {
  try {
    const { children } = toc as any;
    const childrenOfChildren = children?.[0]?.children;
    if (!children?.length || !childrenOfChildren?.length) return null;
  } catch (e) {}
  return {
    type: "element",
    tagName: "aside",
    properties: { className: "toc-container" },
    children: [
      {
        type: "element",
        tagName: "section",
        properties: { className: "toc-section" },
        children: [
          {
            type: "element",
            tagName: "header",
            children: [
              {
                type: "element",
                tagName: "h2",
                properties: { className: "toc-title" },
                children: [
                  {
                    type: "text",
                    value: "In this article",
                  },
                ],
              },
              {
                type: "element",
                tagName: "hr",
              },
            ],
          },
          toc,
        ],
      },
    ],
  } as any;
}

// This plugin is an example to let users write HTML with directives.
// It’s informative but rather useless.
// See below for others examples.
function myRemarkPlugin() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree: any) {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {}) as any;

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}
