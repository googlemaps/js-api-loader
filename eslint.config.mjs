import globals from "globals";
import tseslint from "typescript-eslint";
import pluginJest from "eslint-plugin-jest";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "docs/", "src/bootstrap.js"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        google: "readonly",
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
    },
    rules: {
      "no-var": "error",
      "prefer-arrow-callback": "error",
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/member-ordering": "warn",
      "@typescript-eslint/explicit-member-accessibility": [
        "warn",
        {
          accessibility: "explicit",
          overrides: {
            accessors: "explicit",
            constructors: "no-public",
            methods: "explicit",
            properties: "explicit",
            parameterProperties: "explicit",
          },
        },
      ],
    },
  },
  {
    ...pluginJest.configs["flat/recommended"],
    files: ["**/*.test.ts"],
    rules: {
      ...pluginJest.configs["flat/recommended"].rules,
    },
  },
  eslintConfigPrettier,
);