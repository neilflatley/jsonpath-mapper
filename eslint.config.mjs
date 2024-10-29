import globals from 'globals';
import mocha from 'eslint-plugin-mocha';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  {
    ignores: ['dist/'],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  js.configs.recommended,
  ...ts.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx,mts}'],

    rules: {
      ...config.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  })),
  {
    // enable mocha rules on test files
    files: ['tests/*.mjs'],
    ...mocha.configs.flat.recommended,
    rules: {
      ...mocha.configs.flat.recommended.rules,
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off',
      'mocha/max-top-level-suites': ['warn', { limit: 3 }],
    },
  },
];
