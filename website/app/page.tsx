import { MainNavigation } from "@/components/MainNavigation";
import { css } from "@/styled-system/css";
import { flex } from "@/styled-system/patterns";

export default function Home() {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateAreas: "'navigation main'",
        gridTemplateColumns: "minmax(0, 15rem) 1fr",
        gridGap: "2rem",
        margin: "1rem",
        overflowWrap: "break-word",
      })}
    >
      <aside
        className={flex({
          gridArea: "navigation",
          width: "100%",
          overflow: "auto",
        })}
      >
        <MainNavigation />
      </aside>
      <main
        className={css({
          gridArea: "main",
        })}
      >
        <article>
          <h1>Top Page</h1>
          <p>Hello yncc!</p>
        </article>
      </main>
    </div>
  );
}
