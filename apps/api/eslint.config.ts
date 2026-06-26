import baseConfig from "@aivi/config/eslint";

export default [
  ...baseConfig,
  {
    rules: {
      "import-x/no-unresolved": "off",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
