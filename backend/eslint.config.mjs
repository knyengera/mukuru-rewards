import js from '@eslint/js';
import ts from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
    },
  },
];


