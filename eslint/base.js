import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { importX } from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

import { createNamingConventionOptions } from "./namingConvention.js";

export const TYPESCRIPT_FILES = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
export const TEST_FILES = ["**/*.test.*", "**/*.spec.*", "**/tests/**", "**/__tests__/**"];
export const CONFIGURATION_FILES = ["**/*.config.{js,mjs,cjs,ts,mts,cts}"];

/**
 * @typedef {object} PresetParams
 * @property {string} tsconfigRootDir The directory of the repository's ESLint configuration: `import.meta.dirname`.
 * @property {string | string[] | null} project The tsconfig covering every linted TypeScript file, relative to
 *   `tsconfigRootDir`. `null` lets TypeScript find the nearest `tsconfig.json` of each file.
 */

/**
 * The rules shared by every preset.
 *
 * @param {PresetParams & {
 *   restrictedSyntax: { selector: string, message: string }[],
 *   pluginConfigurations: import("eslint").Linter.Config[],
 *   allowPascalCaseFunctions: boolean,
 * }} params `pluginConfigurations` are placed before the formatting overrides, which must come last.
 * @returns {import("eslint").Linter.Config[]}
 */
export function createBaseConfiguration({
  tsconfigRootDir,
  project,
  restrictedSyntax,
  pluginConfigurations,
  allowPascalCaseFunctions,
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
      name: "openframe/all-files",
      rules: {
        "no-restricted-syntax": ["error", ...restrictedSyntax],
        "no-console": "error",
        eqeqeq: ["error", "always", { null: "ignore" }],
        "no-var": "error",
        "prefer-const": "error",
        "prefer-arrow-callback": "error",
        "prefer-template": "error",
        curly: ["error", "all"],
        "no-nested-ternary": "error",
        "no-else-return": "error",
        "no-shadow": "error",
        "max-classes-per-file": ["error", 1],
        // No abbreviations: a name is a word, never a letter. `x` and `y` are coordinates, not abbreviations.
        "id-length": ["error", { min: 2, exceptions: ["_", "x", "y"], properties: "never" }],
        "id-denylist": ["error", "obj", "arr", "str", "num", "val", "tmp", "idx", "len", "cb", "el", "evt", "btn"],
        "import-x/no-default-export": "error",
        "import-x/no-duplicates": "error",
        "import-x/order": "error",
      },
    },
    {
      name: "openframe/typescript",
      files: TYPESCRIPT_FILES,
      rules: {
        // Members are public by default: the keyword is never written.
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
        // The backend runs on vanilla Node, which strips types and cannot compile a parameter property.
        "@typescript-eslint/parameter-properties": "error",
        // The backend runs on vanilla Node, which keeps every import that is not marked as a type.
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
        "@typescript-eslint/consistent-type-assertions": [
          "error",
          { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
        ],
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/naming-convention": [
          "error",
          ...createNamingConventionOptions({ allowPascalCaseFunctions }),
        ],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none", ignoreRestSiblings: true },
        ],
        "@typescript-eslint/return-await": ["error", "in-try-catch"],
        // Removing `async` from a function changes how it fails: it throws instead of returning a rejected promise.
        "@typescript-eslint/require-await": "off",
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
