// A separate entry point, so that only React applications need the React plugins installed.
import tanstackQuery from "@tanstack/eslint-plugin-query";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

import { createBaseConfiguration } from "./base.js";
import { barrelFiles, general } from "./restrictedSyntax.js";

/**
 * For React applications.
 *
 * @param {import("./base.js").PresetParams} params
 * @returns {import("eslint").Linter.Config[]}
 */
export function createReactConfiguration({ tsconfigRootDir, project }) {
  return [
    ...createBaseConfiguration({
      tsconfigRootDir,
      project,
      restrictedSyntax: [...general, ...barrelFiles],
      pluginConfigurations: [
        ...tanstackQuery.configs["flat/recommended"],
        {
          name: "openframe/react",
          plugins: { react },
          rules: { ...react.configs.recommended.rules, "react/react-in-jsx-scope": "off", "react/prop-types": "off" },
          settings: { react: { version: "detect" } },
        },
        {
          name: "openframe/react-hooks",
          plugins: { "react-hooks": reactHooks },
          rules: { ...reactHooks.configs.recommended.rules, "react-hooks/exhaustive-deps": "error" },
        },
        jsxA11y.flatConfigs.recommended,
      ],
      allowPascalCaseFunctions: true,
    }),
    {
      // Storybook loads stories and its own configuration through the default export.
      name: "openframe/storybook",
      files: ["**/*.stories.{ts,tsx}", ".storybook/**"],
      rules: { "import-x/no-default-export": "off" },
    },
  ];
}
