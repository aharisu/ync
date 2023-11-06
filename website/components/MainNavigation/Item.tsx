import { css } from "@/styled-system/css";
import { Content } from "../../libs/content/getAllContents";
import contentToHref from "@/libs/content/contentToHref";

type Item =
  | {
      text: string;
      href: string;
    }
  | {
      text: string;
      items: Item[];
    };

type Props = {
  content: Content;
};

export const Item = ({ content }: Props) => {
  if (content.kind === "file") {
    return (
      <li>
        <a href={contentToHref(content)}>{content.name}</a>
      </li>
    );
  } else {
    return (
      <li>
        <p>フォルダー: {content.name}</p>
        <ul
          className={css({
            marginLeft: "1rem",
          })}
        >
          {content.contents.map((content) => (
            <Item key={content.path} content={content} />
          ))}
        </ul>
      </li>
    );
  }
};
