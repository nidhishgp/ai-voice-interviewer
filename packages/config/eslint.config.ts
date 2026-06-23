import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import-x";

export default [
  // 1. JS recommended baseline
  js.configs.recommended,

  // 2. TypeScript rules
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },

  // 3. React rules — scoped to tsx/jsx files only
  {
    files: ["**/*.tsx", "**/*.jsx"],
    ...reactPlugin.configs.flat.recommended!,
    ...reactPlugin.configs.flat["jsx-runtime"]!,
    plugins: {
      ...reactPlugin.configs.flat.recommended!.plugins,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended!.rules,
      ...reactPlugin.configs.flat["jsx-runtime"]!.rules,
      ...reactHooksPlugin.configs["recommended-latest"].rules,
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // 4. Import rules
  // eslint-disable-next-line import-x/no-named-as-default-member
  importPlugin.configs["flat/recommended"],
  {
    rules: {
      "import-x/no-duplicates": "error",
      "import-x/order": ["error", { "newlines-between": "always" }],
    },
  },

  // 5. Global ignores
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/*.config.js"],
  },
];
