// Selectors for `no-restricted-syntax`. ESLint accepts one configuration of that rule per file, so each preset
// builds its list from these groups.

const PREPOSITION_ENDING = "/[a-z0-9](Of|For|To)$/";
const FUNCTION_VALUE = "/^(ArrowFunctionExpression|FunctionExpression)$/";
const PREPOSITION_MESSAGE =
  "A function name never ends in a bare preposition (Of, For, To). Name what follows it: " +
  "`sessionCookieForHeaders(headers)`, not `sessionCookieOf(headers)`.";
const PRIVATE_MEMBER_MESSAGE =
  "Every class member is public, so that tests can mock it. Remove the `private` or `protected` modifier.";
const RELATIVE_JAVASCRIPT_IMPORT_MESSAGE =
  "Relative imports use the `.ts` extension. Node strips types without rewriting import paths, so a `.js` " +
  "specifier points at a file that does not exist at runtime.";

export const general = [
  {
    selector:
      ":matches(PropertyDefinition, MethodDefinition, TSAbstractPropertyDefinition, TSAbstractMethodDefinition, " +
      "AccessorProperty)[accessibility=/^(private|protected)$/]",
    message: PRIVATE_MEMBER_MESSAGE,
  },
  {
    selector: ":matches(PropertyDefinition, MethodDefinition, AccessorProperty) > PrivateIdentifier.key",
    message: "Every class member is public, so that tests can mock it. Do not use `#private` members.",
  },
  {
    // The backend runs on vanilla Node, which strips types and cannot compile an enum.
    selector: "TSEnumDeclaration",
    message:
      "Enums need compiling, and the backend runs on vanilla Node. Declare the values in an `as const` array " +
      "and derive the union type from it.",
  },
  {
    selector: "CallExpression[callee.property.name=/^reduce(Right)?$/]",
    message: "`reduce` is harder to read than a loop or a map. Accumulate with a `for` loop, or map and then combine.",
  },
  { selector: `FunctionDeclaration[id.name=${PREPOSITION_ENDING}]`, message: PREPOSITION_MESSAGE },
  { selector: `MethodDefinition[key.name=${PREPOSITION_ENDING}]`, message: PREPOSITION_MESSAGE },
  {
    selector: `VariableDeclarator[id.name=${PREPOSITION_ENDING}][init.type=${FUNCTION_VALUE}]`,
    message: PREPOSITION_MESSAGE,
  },
  {
    selector: `PropertyDefinition[key.name=${PREPOSITION_ENDING}][value.type=${FUNCTION_VALUE}]`,
    message: PREPOSITION_MESSAGE,
  },
];

// Not applied to React applications, where the messages of a translation are functions named this way.
export const objectFunctionNames = [
  { selector: `Property[key.name=${PREPOSITION_ENDING}][value.type=${FUNCTION_VALUE}]`, message: PREPOSITION_MESSAGE },
];

// The backend runs on vanilla Node, which does not rewrite `.js` import paths to `.ts`.
export const vanillaNodeImports = [
  "ImportDeclaration",
  "ImportExpression",
  "ExportNamedDeclaration",
  "ExportAllDeclaration",
].map((nodeType) => ({
  // `\u002F` is a slash. Older versions of ESLint's selector parser end the pattern at a written one.
  selector: `${nodeType}[source.value=/^\\.\\.?\\u002F.*\\.js$/]`,
  message: RELATIVE_JAVASCRIPT_IMPORT_MESSAGE,
}));

// Not applied to libraries, whose entry point re-exports their public interface.
export const barrelFiles = ["ExportAllDeclaration", "ExportNamedDeclaration[source]"].map((selector) => ({
  selector,
  message: "No barrel files: import a value from the file that declares it.",
}));
