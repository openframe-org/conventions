// A separate entry point, so that only React applications need the React plugins installed.
import tanstackQuery from "@tanstack/eslint-plugin-query";
import { ESLint } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

import { createBaseConfiguration } from "./base.js";
import { barrelFiles, general } from "./restrictedSyntax.js";

/**
 * @param {string} eslintVersion
 */
export function assertEslintVersionSupportsReact(eslintVersion) {
  if (Number(eslintVersion.split(".")[0]) >= 10) {
    throw new Error(
      "The React preset of @openframe-org/conventions needs ESLint 9: eslint-plugin-react and " +
        `eslint-plugin-jsx-a11y do not support ESLint ${eslintVersion} yet.`,
    );
  }
}

/**
 * For React applications.
 *
 * @param {import("./base.js").PresetParams} params
 * @returns {import("eslint").Linter.Config[]}
 */
export function createReactConfiguration({ tsconfigRootDir, project }) {
  assertEslintVersionSupportsReact(ESLint.version);

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
      // Almost every function of a React application is a component, whose return type says nothing.
      requireReturnTypes: false,
    }),
    {
      // Storybook loads stories and its own configuration through the default export.
      name: "openframe/storybook",
      files: ["**/*.stories.{ts,tsx}", ".storybook/**"],
      rules: { "import-x/no-default-export": "off" },
    },
  ];
}
