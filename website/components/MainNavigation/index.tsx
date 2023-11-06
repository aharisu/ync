import { flex } from "@/styled-system/patterns";
import { Item } from "./Item";
import { getAllContents } from "../../libs/content/getAllContents";

export const MainNavigation = () => {
  const contents = getAllContents("contents");
  //console.dir(contents, {
  //  depth: null,
  //});

  return (
    <nav
      className={flex({
        flex: "1 1 auto",
        direction: "column",
      })}
    >
      <h2>Main Navigation</h2>
      <ul>
        {contents.map((content) => (
          <Item key={content.path} content={content} />
        ))}
      </ul>
    </nav>
  );
};
