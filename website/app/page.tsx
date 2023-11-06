import Image from "next/image";
import styles from "./page.module.css";
import { css } from "@/styled-system/css";

const cardStyle = css({
  padding: "1rem 1.2rem",
  borderRadius: "var(--border-radius)",
  background: "rgba(var(--card-rgb), 0)",
  border: "1px solid rgba(var(--card-border-rgb), 0)",
  transition: "background 200ms, border 200ms",
  "& span": {
    display: "inline-block",
    transition: "transform 200ms",
  },
  "& h2": {
    fontWeight: 600,
    marginBottom: "0.7rem",
  },
  "& p": {
    margin: "0",
    opacity: 0.6,
    fontSize: "0.9rem",
    lineHeight: 1.5,
    maxWidth: "30ch",
  },
});

export default function Home() {
  return (
    <main
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6rem",
        minHeight: "100vh",
      })}
    >
      <div
        className={css({
          display: "inherit",
          justifyContent: "inherit",
          alignItems: "inherit",
          fontSize: "0.85rem",
          maxWidth: "var(--max-width)",
          width: "100%",
          zIndex: 2,
          fontFamily: "var(--font-mono)",
          "& a": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          },
          "& p": {
            position: "relative",
            margin: "0",
            padding: "1rem",
            backgroundColor: "rgba(var(--callout-rgb), 0.5)",
            border: "1px solid rgba(var(--callout-border-rgb), 0.3)",
            borderRadius: "var(--border-radius)",
          },
        })}
      >
        <p>
          Get started by editing&nbsp;
          <code
            className={css({
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
            })}
          >
            app/page.tsx
          </code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "4rem 0",
          "&::before": {
            background: "var(--secondary-glow)",
            borderRadius: "50%",
            width: "480px",
            height: "360px",
            marginLeft: "-400px",
          },
          "&::after": {
            background: "var(--primary-glow)",
            width: "240px",
            height: "180px",
            zIndex: -1,
          },
          "&::before, &::after": {
            content: "''",
            left: "50%",
            position: "absolute",
            filter: "blur(45px)",
            transform: "translateZ(0)",
          },
        })}
      >
        <Image
          className={css({
            position: "relative",
          })}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(25%, auto))",
          maxWidth: "100%",
          width: "var(--max-width)",
          "@media (max-width: 700px)": {
            gridTemplateColumns: "1fr",
            marginBottom: "120px",
            maxWidth: "320px",
            textAlign: "center",
          },
        })}
      >
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardStyle}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardStyle}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardStyle}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={cardStyle}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
