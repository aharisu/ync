import { flex } from "@/styled-system/patterns";
import { Item } from "./Item";
import { getAllContents } from "../../libs/content/getAllContents";
import { css } from "@/styled-system/css";

import { RxHome } from "react-icons/rx";

export const MainNavigation = () => {
  const contents = getAllContents("contents");
  //console.dir(contents, {
  //  depth: null,
  //});

  return (
    <aside
      className={flex({
        flex: "1 1 auto",
        direction: "column",
        padding: "2rem",
      })}
    >
      <nav
        className={flex({
          direction: "column",
        })}
      >
        <h2
          className={css({
            margin: "1rem 0 -10px 0!important",
          })}
        >
          Menu
        </h2>
        <hr />

        <div
          className={css({
            fontSize: "1.2rem",
            marginLeft: "-0.5rem",
            "& :hover": {
              color: "#5994ec",
            },
          })}
        >
          <a
            className={css({
              display: "inline-flex",
              alignItems: "center",
              padding: "0.25rem 0.5rem",
            })}
            href="/"
          >
            <RxHome />
            <span
              className={css({
                marginLeft: "1rem",
              })}
            >
              Home
            </span>
          </a>
        </div>

        <ul>
          {contents.map((content) => (
            <Item key={content.path} content={content} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};
