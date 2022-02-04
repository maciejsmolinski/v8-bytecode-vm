module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: 'eslint:recommended',
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    semi: ['error', 'always'],
    camelcase: 'error',
  },
};
