import { createLibraryConfiguration } from "./eslint/index.js";

export default [
  // The fixtures break the rules on purpose.
  { ignores: ["tests/fixtures/**"] },
  ...createLibraryConfiguration({ tsconfigRootDir: import.meta.dirname, project: null }),
];
