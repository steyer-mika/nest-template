import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
    },
  },
];
