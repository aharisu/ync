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
        <a
          className={css({
            display: "block",
            padding: "0.5rem 0rem 0.5rem 1.0rem",
            borderLeft: "2px solid #696969",
            color: "#cdcdcd",
            _hover: {
              borderLeft: "2px solid #5994ec",
              color: "#5994ec",
            },
          })}
          href={contentToHref(content)}
        >
          {content.name}
        </a>
      </li>
    );
  } else {
    return (
      <li
        className={css({
          padding: "0.5rem 0",
        })}
      >
        <div>
          <div
            className={css({
              fontSize: "1.1rem",
              fontWeight: "bold",
            })}
          >
            {content.name}
          </div>
          <ul>
            {content.contents.map((content) => (
              <Item key={content.path} content={content} />
            ))}
          </ul>
        </div>
      </li>
    );
  }
};
