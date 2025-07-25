import tseslint from 'typescript-eslint'
import eslintJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslintJs.configs.recommended,

  ...tseslint.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['src/**/*.ts'],
    rules: {},
  },
)
