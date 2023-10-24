import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],

  build: {
    lib: {
      entry: path.resolve(__dirname, "src", "index.ts"),
      formats: ["es", "cjs"],
      name: "ync",
      fileName: (ext) => `index.${ext}.js`,
    },
    target: "esnext",
    sourcemap: true,
  },
  test: {
    cache: {
      dir: "node_modules/.cache/vitest",
    },
  },
});
