import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        navigator: "readonly",
        document: "readonly",
        process: "readonly",
        fetch: "readonly",
        console: "readonly",
        URL: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "no-underscore-dangle": "off",
      camelcase: "off",
      "import/extensions": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    settings: {
      react: {
        version: "19.1.0",
      },
    },
  },
];
