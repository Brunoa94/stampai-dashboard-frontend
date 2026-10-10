import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      "vue/padding-line-between-blocks": ["error", "always"],
      "vue/padding-line-between-tags": [
        "error",
        [{ blankLine: "always", prev: "*", next: "*" }],
      ],
      "no-undef": "off",
      "vue/require-default-prop": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/multi-word-component-names": "off",
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-indent": "off",
      "vue/html-closing-bracket-newline": "off",
    },
  },
  { files: ["**/*.test.ts"], rules: { "vue/one-component-per-file": "off" } },
  {
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
      ],
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
    },
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        URL: "readonly",
        Blob: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        crypto: "readonly",
        Intl: "readonly",
      },
    },
  },
);
