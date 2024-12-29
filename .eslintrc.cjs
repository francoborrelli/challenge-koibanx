module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb', 'plugin:jest/recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignores: ['dist', 'node_modules'],
  rules: {
    indent: ['error', 2],
    'max-len': ['error', 120],
    'linebreak-style': ['windows', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'jest/expect-expect': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
};
