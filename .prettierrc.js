module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  parser: "typescript",
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "@/.+$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
