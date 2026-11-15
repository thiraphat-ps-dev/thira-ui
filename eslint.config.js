// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'node_modules', '!.storybook'] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
      parserOptions: {
        projectService: { allowDefaultProject: ['eslint.config.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.strict,

  {
    rules: {
      // Type-only imports keep the bundle clean (matches verbatimModuleSyntax).
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Numbers in template literals (e.g. `${id}-message`) are fine.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Components are often passed as values in compound APIs (Dialog.Trigger etc.).
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
    },
  },

  // Tests and stories: relax rules that fight testing patterns.
  {
    files: ['**/*.test.tsx', '**/*.test.ts', 'src/test-setup.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.tsx', '**/*.test.tsx'],
    rules: {
      // `render={<a href="…" />}` passes an empty anchor; Button fills in its content at runtime.
      'jsx-a11y/anchor-has-content': 'off',
    },
  },

  // Plain JS config files: no type-aware rules.
  { files: ['**/*.js'], ...tseslint.configs.disableTypeChecked },

  // Must be last: turns off rules that conflict with Prettier.
  prettier,
);
