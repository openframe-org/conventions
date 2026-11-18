import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

import { createNamingConventionOptions } from "./namingConvention.js";

export const TYPESCRIPT_FILES = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
export const TEST_FILES = ["**/*.test.*", "**/*.spec.*", "**/tests/**", "**/__tests__/**", "**/.playwright/**"];
export const CONFIGURATION_FILES = ["**/*.config.{js,mjs,cjs,ts,mts,cts}"];

/**
 * @typedef {object} PresetParams
 * @property {string} tsconfigRootDir The directory of the repository's ESLint configuration: `import.meta.dirname`.
 * @property {string | string[] | null} project The tsconfig covering every linted TypeScript file, relative to
 *   `tsconfigRootDir`. `null` lets TypeScript find the nearest `tsconfig.json` of each file.
 */

/**
 * The rules shared by every preset. They come from three places, in this order: the standard presets (ESLint's
 * `recommended` and typescript-eslint's `recommendedTypeChecked`), the rules of Google's own linter and style guide,
 * and the Openframe rules written in CONVENTIONS.md.
 *
 * @param {PresetParams & {
 *   restrictedSyntax: { selector: string, message: string }[],
 *   pluginConfigurations: import("eslint").Linter.Config[],
 *   allowPascalCaseFunctions: boolean,
 *   requireReturnTypes: boolean,
 * }} params `pluginConfigurations` are placed before the formatting overrides, which must come last.
 * @returns {import("eslint").Linter.Config[]}
 */
export function createBaseConfiguration({
  tsconfigRootDir,
  project,
  restrictedSyntax,
  pluginConfigurations,
  allowPascalCaseFunctions,
  requireReturnTypes,
}) {
  const parserOptions = project === null ? { projectService: true, tsconfigRootDir } : { project, tsconfigRootDir };

  return [
    js.configs.recommended,
    { name: "openframe/plugins", plugins: { "@typescript-eslint": tseslint.plugin, "import-x": importX } },
    ...tseslint.configs.recommendedTypeChecked.map((configuration) => ({ ...configuration, files: TYPESCRIPT_FILES })),
    { name: "openframe/type-information", files: TYPESCRIPT_FILES, languageOptions: { parserOptions } },
    ...pluginConfigurations,
    // Formatting belongs to Prettier: this switches off every rule that would disagree with it.
    prettier,
    {
      // What Google's linter (gts) enables on top of the presets, and the rules of Google's style guide.
      name: "openframe/google",
      rules: {
        "block-scoped-var": "error",
        // Google's guide allows `== null`, which covers both null and undefined.
        eqeqeq: ["error", "always", { null: "ignore" }],
        "no-var": "error",
        "prefer-const": "error",
        "prefer-arrow-callback": "error",
        "no-restricted-properties": [
          "error",
          { object: "describe", property: "only" },
          { object: "it", property: "only" },
        ],
        curly: ["error", "all"],
        "import-x/no-default-export": "error",
      },
    },
    {
      name: "openframe/google-typescript",
      files: TYPESCRIPT_FILES,
      rules: {
        // Members are public by default: the keyword is never written.
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
        "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
        "@typescript-eslint/consistent-type-assertions": [
          "error",
          { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          ...createNamingConventionOptions({ allowPascalCaseFunctions }),
        ],
      },
    },
    {
      name: "openframe/all-files",
      rules: {
        "no-restricted-syntax": ["error", ...restrictedSyntax],
        "no-console": "error",
        "no-nested-ternary": "error",
        "no-else-return": "error",
        "prefer-template": "error",
        "no-shadow": "error",
        "max-classes-per-file": ["error", 1],
        // No abbreviations: a name is a word, never a letter. `x` and `y` are coordinates, not abbreviations.
        "id-length": ["error", { min: 2, exceptions: ["_", "x", "y"], properties: "never" }],
        "import-x/no-duplicates": "error",
      },
    },
    {
      name: "openframe/typescript",
      files: TYPESCRIPT_FILES,
      rules: {
        // The backend runs on vanilla Node, which strips types and cannot compile a parameter property.
        "@typescript-eslint/parameter-properties": "error",
        // The backend runs on vanilla Node, which keeps every import that is not marked as a type.
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        // Removing `async` from a function changes how it fails: it throws instead of returning a rejected promise.
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/explicit-function-return-type": requireReturnTypes ? "error" : "off",
      },
    },
    {
      name: "openframe/tests",
      files: TEST_FILES,
      rules: {
        // A wrong assumption fails the test, which is what a test is for.
        "@typescript-eslint/no-non-null-assertion": "off",
        // Asserting on a spied method reads it unbound.
        "@typescript-eslint/unbound-method": "off",
      },
    },
    {
      // Tools load their configuration through the default export.
      name: "openframe/configuration-files",
      files: CONFIGURATION_FILES,
      rules: { "import-x/no-default-export": "off" },
    },
  ];
}
