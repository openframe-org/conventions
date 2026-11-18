// Options for `@typescript-eslint/naming-convention`: camelCase for values, PascalCase for types and classes,
// SCREAMING_SNAKE_CASE allowed for constants.

/**
 * @param {{ allowPascalCaseFunctions: boolean }} params React components are PascalCase functions.
 */
export function createNamingConventionOptions({ allowPascalCaseFunctions }) {
  const functionFormats = allowPascalCaseFunctions ? ["camelCase", "PascalCase"] : ["camelCase"];

  return [
    { selector: "default", format: ["camelCase"], leadingUnderscore: "forbid", trailingUnderscore: "forbid" },
    { selector: "variable", format: [...functionFormats, "UPPER_CASE"] },
    { selector: "function", format: functionFormats },
    { selector: "parameter", format: functionFormats },
    // An unused name is reported by `no-unused-vars`, whatever its spelling: once is enough.
    { selector: ["parameter", "variable"], modifiers: ["unused"], format: ["camelCase"], leadingUnderscore: "allow" },
    // A destructured name is decided by the shape it is taken from.
    { selector: ["parameter", "variable"], modifiers: ["destructured"], format: null },
    { selector: "import", format: ["camelCase", "PascalCase", "UPPER_CASE"] },
    { selector: "typeLike", format: ["PascalCase"] },
    { selector: "interface", format: ["PascalCase"], custom: { regex: "^I[A-Z]", match: false } },
    { selector: "classProperty", modifiers: ["static", "readonly"], format: ["camelCase", "UPPER_CASE"] },
    // Property names of object literals and types often mirror an external shape: headers, payloads, columns.
    { selector: ["objectLiteralProperty", "objectLiteralMethod", "typeProperty", "typeMethod"], format: null },
    // A name that needs quotes is not an identifier, so no casing applies to it.
    { selector: "default", modifiers: ["requiresQuotes"], format: null },
  ];
}
