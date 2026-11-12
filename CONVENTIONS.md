# Conventions

The rules a change must follow. How we work, and the calls that need judgement, are in
[GUIDELINES.md](./GUIDELINES.md).

A rule marked _lint_ is enforced by the configuration in this repository. The others are enforced in review.

## Baseline

We follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html). The rules below add
to it. Where a rule here and Google's guide disagree, Google's guide wins, except for the three exceptions that
follow.

## What lint enforces

The lint rules come from three places, and nothing else:

1. The standard presets: ESLint's `recommended` and typescript-eslint's `recommendedTypeChecked`.
2. Google: what its own linter enables, and the rules of its style guide that a linter can check.
3. The Openframe rules marked _lint_ in this file.

Two rules of the presets are adjusted. `require-await` is off, because removing `async` from a function changes how
it fails. `unbound-method` is off in tests, where it misreads an assertion on a spy.

## Exceptions to Google's guide

**The backend runs on vanilla Node.** Node strips the types from a file and compiles nothing, so anything that needs
compiling cannot be used. Google allows enums and encourages parameter properties; we use neither.

- No enums. Declare the values in an `as const` array and derive the union type from it. _lint_
- No parameter properties: declare the field and assign it in the constructor. _lint_
- No namespaces. _lint_
- An import that is only used as a type is written `import type`. _lint_
- In a backend service, a relative import carries its `.ts` extension. _lint_

**Every class member is public.** A test must be able to mock any member.

- No `private`, no `protected`, no `#private`. _lint_
- Following Google, the `public` keyword is never written. _lint_
- A static factory may be the intended way to create an instance, but the constructor stays public.

**Formatting is Prettier's.** We use Prettier's defaults at 120 columns, where Google asks for 80 columns and single
quotes. _lint_

## Naming

- A name is descriptive and says how the value is used: `LoginPage`, `UserDetailsModal`, `PdfGeneratorService`,
  `originalConsoleMethods`, `taskIdObjects`, `getUpToDateZipFileOrEnqueue`.
- Never abbreviate. `obj`, `i`, `arr` and `mapDDFieldtoOC` are not acceptable names. _lint, for one-letter names_
- camelCase for variables, functions and methods. PascalCase for classes, types and React components.
  SCREAMING_SNAKE_CASE for global constants. _lint_
- A function name starts with a verb and says what the function returns or does: `getUserByEmail`,
  `assembleInvoiceLines`. Not a noun phrase, not a bare adjective.
- A function name never ends in a bare preposition: no `xxxOf()`, `xxxFor()`, `xxxTo()`. Name what follows it:
  `sessionCookieForHeaders(headers)`, not `sessionCookieOf(headers)`. _lint_
- `get` returns its result or throws; `find` may return `null`. `assemble` builds a value from parts, `create` makes
  a new thing, `evaluate` decides, `validate` throws on a bad input.
- A constant names what it is, not only its value: `ALLOWED_ROLES`, not `ALLOWED`.
- A class name is descriptive on its own: `PaymentRequirements`, not `Requirements`.
- A list of alternatives says so in its name: `rolesOrGroups`.
- A type parameter carries no `Type` suffix: `Action`, not `ActionType`.
- The type of a parameter object is named `XxxParams`.
- It is Openframe, never OpenFrame.

## Types

- No `any`. _lint_
- Avoid casts. Prefer a type guard (`isRole`, `isCurrency`) over `as`. A cast that remains sits at the one
  boundary that validated the value, with a comment. An object literal is annotated, never cast. _lint, for object
  literals_
- No non-null assertion (`value!`) outside tests: it is a cast. _lint_
- A type states whether its value can be absent. Nullable code without a nullable type ends in a null-pointer error.
- Prefer `null` to `undefined`: write `name: string | null` rather than `name?: string`, so that leaving a value out
  is a decision the code shows.

## Promises

- A promise is awaited or handled. One that is deliberately not awaited is marked with `void`:
  `void queryClient.invalidateQueries({ queryKey })`. _lint_
- An asynchronous event handler is started the same way: `onClick={() => void save()}`. _lint_

## Functions and classes

- Several identifiers travel as one named object, never as positional strings:
  `new InvoiceLoader({ customerId, invoiceId })`, with the parameter type declared as `InvoiceLoaderParams`. No
  inline object types in a constructor signature; avoid them in method signatures too.
- One class per file, the file named after it. _lint, for the count_
- No nested ternaries: use `if`, `switch`, or a function. _lint_
- No `reduce`: accumulate with a `for` loop, or map and then combine. _lint_
- No `else` after a `return`. _lint_
- No variable shadows one of an enclosing scope. _lint_
- Always `===`, and always braces around a block. _lint_
- A template string rather than `+` to build a string. _lint_

## Modules

- Named exports only. A default export is allowed where a tool requires it: its configuration file, a Storybook
  story, a lazily loaded component. _lint_
- A module is imported once per file. _lint_
- No barrel files: import a value from the file that declares it. The entry point of a library is the exception.
  _lint_
- Small helpers go in the folder's `utils.ts`, not in one file per function.

## Backend services

- No default parameter values, no optional parameters, no `??=` fallbacks. A value is required, or its absence is a
  real state that the code checks.
- A missing resource is an error with a 404 message, never `null`. A lookup that may legitimately be empty returns
  `[]`.
- Membership of a registry is tested with `Object.hasOwn`, not `in`.
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
  _lint_
- No unused variables, functions, classes, components or files. Code that is needed later belongs in a branch or in
  the git history; failing that, mark it with `@TODO`. _lint, for variables and imports_
- An unused name is removed, not kept behind an underscore: `[, second]` skips a position of an array and `catch {`
  drops the error. To leave a property out of an object, use an `omit` helper or list the properties that stay.
  _lint_
- No `describe.only` or `it.only` left in a test file. _lint_

## Comments

- Say exactly what the code guarantees, no more. A check that compares field names does not "validate schemas".
- When a decision is deliberate, the comment says so and why, so that the next reader does not reopen it.
- A comment stands on its own. Do not cite a ticket or an internal document, unless it is a `@TODO` or the decision
  would otherwise look like a mistake.
- Switching a lint rule off for a line needs a comment with the reason.

When to write a comment at all is in [GUIDELINES.md](./GUIDELINES.md#comments-and-documentation).

## Git and dependencies

- The task ID prefixes the branch (`dev-1234-<description>`) and the pull request title (`DEV-1234: <title>`). Jira
  links a task to its branches this way.
- Pin exact dependency versions and run a plain `npm install`.
- Before asking for a review, `npm run lint` and `npm run tc` pass.

## Other languages

- **Java:** the Google style, checked with [checkstyle](https://checkstyle.sourceforge.io/) through
  `mvn checkstyle:check`. camelCase for variables and methods.
- **Python:** checked with [ruff](https://github.com/astral-sh/ruff) through `ruff check`. snake_case for variables
  and functions.
