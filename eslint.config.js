// import js from '@eslint/js'
// import pluginVue from 'eslint-plugin-vue'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// export default [
//   {
//     name: 'app/files-to-lint',
//     files: ['**/*.{js,mjs,jsx,vue}'],
//   },

//   {
//     name: 'app/files-to-ignore',
//     ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
//   },

//   js.configs.recommended,
//   ...pluginVue.configs['flat/essential'],
//   skipFormatting,
// ]


import eslint from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  // Base ESLint recommended config
  eslint.configs.recommended,

  // Vue 3 plugin configuration
  {
    files: ['**/*.vue'],
    ...vuePlugin.configs['flat/recommended'],
  },

  // TypeScript plugin configuration
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    ...tsPlugin.configs.recommended,
    languageOptions: {
      parser: vuePlugin.parser,
      parserOptions: {
        parser: tsPlugin.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 2021,
      },
    },
  },

  // Global project configuration
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // "no-console": process.env.DEBUG ? "warn" : "off",
      // "no-debugger": process.env.DEBUG ? "warn" : "off",
      // "@typescript-eslint/interface-name-prefix": "off",
      // "@typescript-eslint/explicit-function-return-type": "off",
      // "@typescript-eslint/explicit-module-boundary-types": "off",
      // "@typescript-eslint/no-explicit-any": "off",
      // "@typescript-eslint/no-non-null-assertion": "off",
      // "@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
    }
  }
];
