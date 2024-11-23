const path = require('path')

module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: path.resolve(__dirname, 'tsconfig.json'),
  },
  rules: {
    // Cypress uses the `.then()` syntax a bunch, but we do not want to treat
    // them as promises and have a bunch of linting errors.
    // @see {@link https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/catch-or-return.md}
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',

    // Cypress uses namespace types to define their chainable API. To extend it
    // (e.g. in `support/commands.ts`), we need to override their namespace.
    // @see {@link https://typescript-eslint.io/rules/no-namespace}
    '@typescript-eslint/no-namespace': 'off',
  },
}
