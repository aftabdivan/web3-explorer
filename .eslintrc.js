/* eslint-disable no-undef */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'simple-import-sort', 'import'],
  rules: {
    'no-console': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // React and other built-in libraries first
          ['^react$', '^react', '^@?\\w'],

          // Absolute imports from 'src'
          ['^@components/', '^@assets/', '^@util/', '^@pages/', '^@redux/'],

          // Blank line between third-party imports and local imports
          ['^src/', '^\\./', '^\\.\\.'],

          // Style or asset imports
          ['^.+\\.s?css$', '^.+\\.(svg|png|jpe?g|gif)$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
}
