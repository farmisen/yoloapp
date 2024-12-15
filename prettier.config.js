/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PluginOptions} */
export default {
  printWidth: 88,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  bracketSameLine: true,
  plugins: ["prettier-plugin-tailwindcss", "@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^~/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
