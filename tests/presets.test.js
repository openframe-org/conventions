import assert from "node:assert/strict";
import { join } from "node:path";
import process from "node:process";
import { describe, test } from "node:test";

import { ESLint } from "eslint";

import { createLibraryConfiguration, createServiceConfiguration } from "../eslint/index.js";
import { assertEslintVersionSupportsReact, createReactConfiguration } from "../eslint/react.js";

// typescript-eslint assumes one lint run per process when `CI` is set, and keeps the program of the first run. These
// tests lint the same files with several presets, so they need a program per run.
process.env.TSESTREE_SINGLE_RUN = "false";

const fixturesDirectory = join(import.meta.dirname, "fixtures");
const presetParams = { tsconfigRootDir: fixturesDirectory, project: "./tsconfig.json" };

const presets = [
  { name: "service", configuration: createServiceConfiguration(presetParams) },
  { name: "library", configuration: createLibraryConfiguration(presetParams) },
  { name: "react", configuration: createReactConfiguration(presetParams) },
];

// What `violations.ts` breaks under every preset. A `no-restricted-syntax` report is named by its message.
const violationsOfEveryPreset = [
  "@typescript-eslint/explicit-member-accessibility",
  "@typescript-eslint/no-explicit-any",
  "@typescript-eslint/no-floating-promises",
  "@typescript-eslint/no-non-null-assertion",
  "@typescript-eslint/no-shadow",
  "@typescript-eslint/no-unused-vars",
  "@typescript-eslint/parameter-properties",
  "id-length",
  "import-x/no-default-export",
  "no-console",
  "no-nested-ternary",
  "A function name never ends in a bare preposition",
  "Enums need compiling",
  "Every class member is public",
  "`reduce` is harder to read",
];
const relativeJavascriptImportViolation = "Relative imports use the `.ts` extension";
const barrelFileViolation = "No barrel files";
const prepositionViolation = "A function name never ends in a bare preposition";

async function lintFixture({ configuration, fileName }) {
  const eslint = new ESLint({ cwd: fixturesDirectory, overrideConfigFile: true, overrideConfig: configuration });
  const [result] = await eslint.lintFiles([fileName]);

  return result.messages.map((message) =>
    message.ruleId === "no-restricted-syntax" ? message.message : message.ruleId,
  );
}

function hasViolation({ reports, violation }) {
  return reports.some((report) => report.startsWith(violation));
}

for (const { name, configuration } of presets) {
  describe(`${name} preset`, () => {
    test("accepts code that follows the conventions", async () => {
      const reports = await lintFixture({ configuration, fileName: "clean.ts" });

      assert.deepEqual(reports, []);
    });

    test("reports each broken convention", async () => {
      const reports = await lintFixture({ configuration, fileName: "violations.ts" });

      for (const violation of violationsOfEveryPreset) {
        assert.ok(hasViolation({ reports, violation }), `${violation} is not reported`);
      }
    });
  });
}

describe("rules that differ between presets", () => {
  test("only services must import relative files with the `.ts` extension", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "violations.ts" });

      assert.equal(hasViolation({ reports, violation: relativeJavascriptImportViolation }), name === "service", name);
    }
  });

  test("only libraries may re-export a whole module", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "violations.ts" });

      assert.equal(hasViolation({ reports, violation: barrelFileViolation }), name !== "library", name);
    }
  });

  test("only libraries may re-export a value by name", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "namedReExport.ts" });

      assert.equal(hasViolation({ reports, violation: barrelFileViolation }), name !== "library", name);
    }
  });

  test("only React applications may leave out the return type of a function", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "missingReturnType.ts" });

      assert.deepEqual(reports, name === "react" ? [] : ["@typescript-eslint/explicit-function-return-type"], name);
    }
  });

  test("only React applications may leave out the return type of a function that returns a function", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "higherOrderFunction.ts" });

      assert.deepEqual(reports, name === "react" ? [] : ["@typescript-eslint/explicit-function-return-type"], name);
    }
  });

  test("a computed key is not the name of a function", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "computedKeys.ts" });

      assert.deepEqual(reports, [], name);
    }
  });

  test("only React applications may name a function of an object literal with a trailing preposition", async () => {
    for (const { name, configuration } of presets) {
      const reports = await lintFixture({ configuration, fileName: "objectFunctionNames.ts" });

      assert.equal(hasViolation({ reports, violation: prepositionViolation }), name !== "react", name);
    }
  });
});

describe("the React preset and ESLint versions", () => {
  test("accepts ESLint 9", () => {
    assert.doesNotThrow(() => assertEslintVersionSupportsReact("9.39.4"));
  });

  test("refuses ESLint 10, which the React plugins do not support", () => {
    assert.throws(() => assertEslintVersionSupportsReact("10.4.1"), /needs ESLint 9/);
  });
});
