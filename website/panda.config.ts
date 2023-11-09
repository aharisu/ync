import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  "*": { boxSizing: "border-box", padding: "0", margin: "0" },
  body: {
    color: "var(--text-primary)",
    backgroundColor: "var(--background-primary)",
    fontFamily: `ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
      'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
      'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace`,
  },
  a: {
    color: "inherit",
    textDecoration: "none",
  },
  ":root": {
    "--text-primary": "#FFFFFF",
    "--background-primary": "#efefef",
    "--background-secondary": "#c8c8c8",
    "--background-tertiary": "#a4a4a4",
  },
  "@media (prefers-color-scheme: dark)": {
    ":root": {
      "--text-primary": "rgb(255, 2550, 255)",
      "--background-primary": "#1b1b1b",
      "--background-secondary": "#343434",
      "--background-tertiary": "#4e4e4e",
      "--code-background-inline": "#343434",
      "--code-background-block": "#343434",
      "--color-button-track": "#444444",
      "--color-button-thumb": "#AAAAAA",
    },
    html: { colorScheme: "dark" },
  },

  "::-webkit-scrollbar": {
    width: "10px",
    height: "8px",
  },

  "::-webkit-scrollbar-thumb": {
    background: "var(--color-button-thumb)",
    borderRadius: "10px",
  },

  "::-webkit-scrollbar-track": {
    background: "var(--color-button-track)",
    borderRadius: "10px",
  },
});

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  globalCss,

  // The output directory for your css system
  outdir: "styled-system",
});
