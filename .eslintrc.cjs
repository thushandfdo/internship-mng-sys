/* eslint-env node */

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "no-unused-vars": [
        "warn",
        {
            "vars": "all", // all | local | none

            "varsIgnorePattern": "[iI]gnored", // ignore unused vars containing "ignored"

            "args": "all", // all | after-used | none

            "argsIgnorePattern": "^_", // ignore unused args starting with _

            "ignoreRestSiblings": false
        }
    ],
    "react/prop-types": [1, { "skipUndeclared": true }]
  },
}
