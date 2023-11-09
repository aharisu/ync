import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypePrism from "rehype-prism-plus";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import { h } from "hastscript";
import { visit } from "unist-util-visit";

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
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
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
