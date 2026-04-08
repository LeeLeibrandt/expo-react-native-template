const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['.expo/**', 'dist/**', 'node_modules/**', 'android/**', 'ios/**', 'src/**'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,cjs,mjs}'],
    rules: {
      'import/no-default-export': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
