import { createBaseConfiguration } from "./base.js";
import { general } from "./restrictedSyntax.js";

/**
 * For libraries, which are compiled before they are published.
 *
 * @param {import("./base.js").PresetParams} params
 * @returns {import("eslint").Linter.Config[]}
 */
export function createLibraryConfiguration({ tsconfigRootDir, project }) {
  return createBaseConfiguration({
    tsconfigRootDir,
    project,
    restrictedSyntax: general,
    pluginConfigurations: [],
    allowPascalCaseFunctions: false,
  });
}
