import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],

  build: {
    lib: {
      entry: path.resolve(__dirname, "src", "index.ts"),
      formats: ["es", "cjs"],
      name: "yncc",
      fileName: "[format]/[name]",
    },
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      input: [
        path.resolve(__dirname, "src", "index.ts"),
        path.resolve(__dirname, "src", "Validator", "index.ts"),
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "named",
      },
    },
  },
  test: {
    cache: {
      dir: "node_modules/.cache/vitest",
    },
    coverage: {
      provider: "istanbul", // or 'v8'
      reporter: ["text", "json", "html"],
    },
  },
});
