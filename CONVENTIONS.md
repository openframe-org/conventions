# Conventions

We follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html). This file lists only
what Openframe adds to it and what it leaves out, with the reason. On anything it does not mention, Google's guide
applies. How we work is in [GUIDELINES.md](./GUIDELINES.md).

Lint enforces what it can, with ESLint's `recommended` preset, typescript-eslint's `recommendedTypeChecked` preset and
the rules of Google's own linter.

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

## Preset rules we switch off

- `require-await`: removing `async` from a function changes how it fails.
- `unbound-method`, in tests only: it misreads an assertion on a spy.

## Naming

- **Never** abbreviate. `obj`, `i`, `arr` and `mapDDFieldtoOC` are not acceptable names.
- `camelCase` for TypeScript, `snake_case` for Python variables, functions and methods. `PascalCase` for classes,
  types and React components. `SCREAMING_SNAKE_CASE` for global constants.
- A function name starts with a verb and says what the function returns or does: `getUserByEmail`,
  `assembleInvoiceLines`. Not a noun phrase, not a bare adjective.
- A function name never ends in a bare preposition: no `xxxOf()`, `xxxFor()`, `xxxTo()`. Name what follows it:
  `sessionCookieForHeaders(headers)`, not `sessionCookieOf(headers)`.
- `get` returns its result or throws; `find` may return `null`. `assemble` builds a value from parts, `create` makes
  a new thing, `evaluate` decides, `validate` throws on a bad input.
- A constant names what it is, not only its value: `ALLOWED_ROLES`, not `ALLOWED`.
- A class name is descriptive on its own: `PaymentRequirements`, not `Requirements`.
- A list of alternatives says so in its name: `rolesOrGroups`.
- A type parameter carries no `Type` suffix: `Action`, not `ActionType`.
- The type of a parameter object is named `XxxParams`.
- It is Openframe, never OpenFrame.

## Types

- No non-null assertion (`value!`): it is a cast. A test may use it, since a wrong assumption fails the test.
- Prefer a type guard (`isRole`, `isCurrency`) over a cast.

## Functions and classes

- Several identifiers travel as one named object, never as positional strings:
  `new InvoiceLoader({ customerId, invoiceId })`, with the parameter type declared as `InvoiceLoaderParams`. No
  inline object types in a constructor signature; avoid them in method signatures too.
- One class per file, the file named after it.
- No nested ternaries: use `if`, `switch`, or a function.
- No `reduce`: a `for` loop, or a map followed by a combination, is easier to read.
- No `else` after a `return`.
- No variable shadows one of an enclosing scope.
- A template string rather than `+` to build a string.

## Modules

- No barrel files: import a value from the file that declares it. The entry point of a library is the exception.
- A module is imported once per file.
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
- No console output, unless it is the product of the code or of a tool. Where logging is needed, use a logger.
- No unused functions, classes, components or files. Code that is needed later belongs in a branch or in the git
  history; failing that, mark it with `@TODO`.

## Comments

- A comment exists for one of three reasons: the code deliberately does something a reader would not expect, the
  implementation is very complex, or a complicated file or block needs a headline. Anything else goes in a README or
  in `docs/`, or is left out.
- A comment stands on its own: no ticket numbers, unless it is a `@TODO` or the decision would otherwise look like a
  mistake.
- Switching a lint rule off for a line needs a comment with the reason.

## Git and dependencies

- The task ID prefixes the branch (`dev-1234-<description>`) and the pull request title (`DEV-1234: <title>`). Jira
  links a task to its branches this way.
- Pin exact dependency versions and run a plain `npm install`.
- Before asking for a review, `npm run lint` and `npm run tc` pass.

## Other languages

- **Java:** the Google style, checked with [checkstyle](https://checkstyle.sourceforge.io/) through
  `mvn checkstyle:check`.
- **Python:** checked with [ruff](https://github.com/astral-sh/ruff) through `ruff check`.
