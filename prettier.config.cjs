module.exports = {
  useTabs: false,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 120,
  quoteProps: 'consistent',
  pluginSearchDirs: ['.'],
  plugins: ['prettier-plugin-jsdoc'],
  jsdocSeparateReturnsFromParam: true,
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
