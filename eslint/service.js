import { createBaseConfiguration } from "./base.js";
import { barrelFiles, general, objectFunctionNames, vanillaNodeImports } from "./restrictedSyntax.js";

/**
 * For backend services, which run on vanilla Node.
 *
 * @param {import("./base.js").PresetParams} params
 * @returns {import("eslint").Linter.Config[]}
 */
export function createServiceConfiguration({ tsconfigRootDir, project }) {
  return createBaseConfiguration({
    tsconfigRootDir,
    project,
    restrictedSyntax: [...general, ...objectFunctionNames, ...barrelFiles],
    typescriptRestrictedSyntax: vanillaNodeImports,
    pluginConfigurations: [],
    allowPascalCaseFunctions: false,
    requireReturnTypes: true,
  });
}
