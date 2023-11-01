/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  bracketSpacing: true,
  parser: "typescript",
  importOrder: ["<THIRD_PARTY_MODULES>", "@/.+$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = config;
