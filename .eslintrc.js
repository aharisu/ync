module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  ignorePatterns: [".eslintrc.js"],
  globals: {
    JSX: true,
  },
  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-empty-function": ["error"],
  },
  overrides: [
    {
      files: ["*.tsx"],
      excludedFiles: ["*.test.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          { args: "none", varsIgnorePattern: "^_" },
        ],
      },
    },
  ],
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
