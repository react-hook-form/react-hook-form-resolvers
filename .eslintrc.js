module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    curly: 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    'no-console': 'error',
  },
  overrides: [
    {
      files: ['config/*.js'],
      rules: { '@typescript-eslint/no-var-requires': 'off' },
    },
  ],
};
