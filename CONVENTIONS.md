# Conventions

We follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html). This file lists only
what Openframe adds to it and what it leaves out, with the reason. On anything it does not mention, Google's guide
applies. How we work is in [GUIDELINES.md](./GUIDELINES.md).

A repository can add conventions of its own, in its `docs/CONVENTIONS.md`.

Lint starts from ESLint's `recommended` preset and typescript-eslint's `recommendedTypeChecked` preset, with the
changes listed below.

## Exceptions to Google's guide

- All non-frontend code runs on vanilla Node, which strips the types from a file and compiles nothing:
  - No enums. Declare the values in an `as const` array and derive the union type from it.
  - No parameter properties: declare the field and assign it in the constructor.
  - An import that is only used as a type is written `import type`.
  - In a backend service, a relative import carries its `.ts` extension.
- No `private`, no `protected`, no `#private`. A test must be able to mock any member.
- Declare the intention. A value that can be absent is `null`, not `undefined`: write `name: string | null`, not
  `name?: string`, so that leaving it out is a decision the caller makes explicitly. `?` is for what is truly
  optional, such as an option most callers do not set.
- A type alias rather than an `interface` for the shape of an object. A type alias is easier to extend and combine.
- A default export where a tool requires it: its configuration file, a Storybook story, a lazily loaded component.
- The Prettier defaults at 120 columns instead of the Google 80 columns. It's just more comfortable.
- Double quotes, the Prettier default, rather than single quotes.

## Lint rules we add

- `no-restricted-syntax` for `private`, `protected` and `#private` members: a test must be able to mock any member.
- `parameter-properties`, `consistent-type-imports`, `consistent-type-exports`, `no-import-type-side-effects`, and
  `no-restricted-syntax` for enums and for relative `.js` imports in services: vanilla Node.
- `explicit-member-accessibility`, `array-type`, `consistent-type-assertions`, `naming-convention`, `eqeqeq`, `curly`,
  `block-scoped-var`, `no-var`, `prefer-const`, `prefer-arrow-callback`, `import-x/no-default-export`, and
  `no-restricted-properties` for `describe.only` and `it.only`: Google's guide and linter.
- `no-nested-ternary`, `no-else-return`, `prefer-template`, and `no-restricted-syntax` for `reduce`: they make code
  harder to read.
- `explicit-function-return-type` in services and libraries: a function declares what it returns, so that a
  change of it is a decision. Not in React applications, where almost every function is a component.
- `no-shadow`: a shadowed name hides the outer one.
- `no-non-null-assertion`: `!` is a cast.
- `id-length`: no one-letter names.
- `no-console`: output goes through a logger.
- `max-classes-per-file`: one class per file.
- `import-x/no-duplicates`: a module is imported once per file.
- `no-restricted-syntax` for function names ending in `Of`, `For` or `To`: name what follows the preposition,
  `sessionCookieForHeaders(headers)`. A React application may name a function of an object literal this way, as the
  messages of a translation are.
- `no-restricted-syntax` for `export *` and `export { x } from` in services and React applications: no barrel files.

## Preset rules we switch off

- `require-await`: removing `async` from a function changes how it fails.
- `unbound-method`, in tests only: it misreads an assertion on a spy.
- `no-non-null-assertion`, in tests only: a wrong assumption fails the test.

## Comments

- A comment exists for one of three reasons: the code deliberately does something a reader would not expect, the
  implementation is very complex, or a complicated file or block needs a headline. Anything else goes in a README or
  in `docs/`, or is left out. A README or a document does not need to be terse, but it is still kept reasonably short.
- When a decision is deliberate, the comment says so and why, so the next reader does not reopen it.
- A comment stands on its own: no ticket numbers, unless it is a `@TODO` or the decision would otherwise look like a
  mistake.
- Switching a lint rule off for a line needs a comment with the reason.

## Naming

- **Never** abbreviate. `obj`, `i`, `arr` and `mapDDFieldtoOC` are not acceptable names.
- `camelCase` for TypeScript, `snake_case` for Python variables, functions and methods. `PascalCase` for classes,
  types and React components. `SCREAMING_SNAKE_CASE` for global constants.
- A function name starts with a verb and says what the function returns or does: `getUserByEmail`,
  `assembleInvoiceLines`. Not a noun phrase, not a bare adjective.
- `get` returns its result or throws; `find` may return `null`. `assemble` builds a value from parts, `create` makes
  a new thing, `evaluate` decides, `validate` throws on a bad input.
- A constant names what it is, not only its value: `ALLOWED_ROLES`, not `ALLOWED`.
- A class name is descriptive on its own: `PaymentRequirements`, not `Requirements`.
- A list of alternatives says so in its name: `rolesOrGroups`.
- A type parameter carries no `Type` suffix: `Action`, not `ActionType`.
- The type of a parameter object is named `XxxParams`.
- It is Openframe, never OpenFrame.

## Types

- Prefer a type guard (`isRole`, `isCurrency`) over a cast.

## Functions and classes

- Several identifiers travel as one named object: `new InvoiceLoader({ customerId, invoiceId })`, typed
  `InvoiceLoaderParams`. No inline object types in a constructor signature, and avoid them in method signatures too.
- A class file is named after the class, with its kind as a suffix: `invoice.service.ts`, `invoice.repository.ts`,
  `resourceNotFound.error.ts`.

## Utility functions

- Use them sparingly, and only for small, repetitive tasks. Anything larger belongs in a service or repository, where
  it can be mocked.
- Do not create a file to hold a single function. Small helpers go in the folder's `utils.ts`. If there is more of
  it, in `utils/<overall concept>.ts`: `utils/secrets.ts`, not `utils/encryptData.ts`.

## Errors

- An error message is specific (`Company with ID xxx not found`, not `Entity not found`) and carries the right
  status code: that one is a 404, not a 500.

## React

- Do not memoize components. A component lives at the top level of a file. A complex node inside `memo`, `useMemo`
  or `useCallback` should be its own component, usually in its own file.

## Identifiers of entities

- No numeric IDs. Use UUIDv4 everywhere.
- An entity that is referred to by its ID from outside, such as a task whose ID appears in a URL, may use
  `ShortUniqueId` (25 characters) or `CUID` (11 characters).

## Keeping the code clean

- No commented-out code. A `@TODO` that points at a specific commented-out fragment is fine.
- No unused functions, classes, components or files. Code that is needed later belongs in a branch or in the git
  history; failing that, mark it with `@TODO`.

## Git and dependencies

- The task ID prefixes the branch (`dev-1234-<description>`) and the pull request title (`DEV-1234: <title>`). Jira
  links a task to its branches this way.
- Pin exact dependency versions and run a plain `npm install`.
- Before asking for a review, the lint and typecheck scripts of the repository pass.

## Other languages

- **Java:** the Google style, checked with [checkstyle](https://checkstyle.sourceforge.io/) through
  `mvn checkstyle:check`.
- **Python:** checked with [ruff](https://github.com/astral-sh/ruff) through `ruff check`.
