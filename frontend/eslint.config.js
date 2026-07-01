// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  eslintConfigPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Regra experimental (voltada ao React Compiler): dá falso positivo em qualquer
      // função async chamada de um efeito para popular estado (ex: reload() dentro de
      // useEffect em um hook), mesmo quando o setState só ocorre depois do await — o
      // padrão seguro de fetch-on-mount usado neste projeto. Mantida em warn.
      'react-hooks/set-state-in-effect': 'warn',
    },
  }
);
