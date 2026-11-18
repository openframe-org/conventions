# Conventions

Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) unless this document
states an exception. A repository's `docs/CONVENTIONS.md` may add rules or document a justified exception. More
specific rules take precedence.

This file lists only what Openframe adds to Google's guide and what it leaves out, with the reason. How we work is in
[GUIDELINES.md](./GUIDELINES.md).

Lint starts from ESLint's `recommended` preset and typescript-eslint's `recommendedTypeChecked` preset, with the
changes listed below.

## Declare the intention

Code should make its intentions explicit. Whoever owns a choice should make it explicitly. Defaults and omissions
should be used only when their meaning is part of the contract, and readers should not have to guess what was
intended. This is one of our most important principles, and several of the rules below follow from it.

- Prefer required properties and parameters, so that callers make their choices explicitly. When a value belongs to
  the contract but may be absent, use `Value | null`: write `website: string | null`, not `website?: string`.
- Use an optional property or parameter only when omission itself has a defined meaning, distinct from supplying a
  value or `null`. Do not make something optional merely to save callers from providing it, and make the meaning of
  omission clear in the contract.
- Prefer required parameters. Use a default only when it is part of the operation's defined behavior, such as a
  standard page size. Require an explicit value when the choice belongs to the caller, such as a user's locale,
  company or transaction. Do not add a default merely to avoid updating call sites.
- When `null` has a distinct meaning, preserve it. Remember that `value ?? fallback` replaces both `null` and
  `undefined`.
- All class members must be public and include the `public` keyword. This makes their accessibility explicit, in
  keeping with our preference for declaring intentions.

## Exceptions to Google's guide

- All non-frontend code runs on vanilla Node, which strips the types from a file and compiles nothing:
  - No enums. Declare the values in an `as const` array and derive the union type from it.
  - No parameter properties: declare the field and assign it in the constructor.
  - An import that is only used as a type should be written `import type`.
  - In a backend service, a relative import should carry its `.ts` extension.
- What [Declare the intention](#declare-the-intention) asks for: `null` rather than an optional property, and the
  `public` keyword.
- Do not use `private`, `protected` or JavaScript private fields. We keep class members publicly accessible for
  testing.
- Use type aliases for data shapes, including parameter objects, and for unions, intersections and function types.
  Use an `interface` only for a contract that classes implement, never merely to describe a data object:

  ```ts
  type CompanyParams = {
    name: string;
    website: string | null;
  };

  interface CompanyRepository {
    findCompanyByIdentifier(identifier: string): Promise<Company | null>;
  }
  ```

- A default export where a tool requires it: its configuration file, a Storybook story, a lazily loaded component.
- The Prettier defaults at 120 columns instead of the Google 80 columns. It's just more comfortable.
- Double quotes, the Prettier default, rather than single quotes.

## Lint rules we add

- `no-restricted-syntax` for `private`, `protected` and `#private` members: we keep class members publicly
  accessible for testing.
- `explicit-member-accessibility`: a member should state that it is `public`, so that the intention is explicit.
- `parameter-properties`, `consistent-type-imports`, `consistent-type-exports`, `no-import-type-side-effects`, and
  `no-restricted-syntax` for enums and for relative `.js` imports in the TypeScript files of services: vanilla Node.
- `array-type`, `consistent-type-assertions`, `naming-convention`, `eqeqeq`, `curly`,
  `block-scoped-var`, `no-var`, `prefer-const`, `prefer-arrow-callback`, `import-x/no-default-export`, and
  `no-restricted-properties` for `describe.only` and `it.only`: Google's guide and linter.
- `no-nested-ternary`, `no-else-return`, `prefer-template`, and `no-restricted-syntax` for `reduce`: they make code
  harder to read.
- `explicit-function-return-type` in services and libraries: a function should declare what it returns, so that
  changing it is a decision. Not in React applications, where almost every function is a component.
- `no-shadow`: a shadowed name hides the outer one.
- `no-non-null-assertion`: `!` is a cast.
- `id-length`: no one-letter names.
- `no-console`: output should go through a logger.
- `max-classes-per-file`: one class per file.
- `import-x/no-duplicates`: a module should be imported once per file.
- `no-restricted-syntax` for function names ending in `Of`, `For`, `To` or `Until`: name what follows the preposition,
  `sessionCookieForHeaders(headers)`, `setLoginLockedUntilDate(date)`. A React application may name a function of an
  object literal this way, as the messages of a translation are.
- `no-restricted-syntax` for `export *` and `export { x } from` in services and React applications: no barrel files.

## Preset rules we switch off

- `require-await`: removing `async` from a function changes how it fails.
- `unbound-method`, in tests only: it misreads an assertion on a spy.
- `no-non-null-assertion`, in tests only: a wrong assumption fails the test.

## Comments

- A comment should exist for one of three reasons only: the code deliberately does something a reader would not
  expect, the implementation is very complex, or a complicated file or block needs a headline. Anything else should go
  in a README or in `docs/`, or be left out. A README or a document does not need to be terse, but it should still be
  kept reasonably short.
- When a decision is deliberate, the comment should say so and explain why, so the next reader does not reopen it.
- A comment should stand on its own: no ticket numbers, unless it is a `@TODO` or the decision would otherwise look
  like a mistake.
- Switching a lint rule off for a line needs a comment with the reason.

## Naming

- **Never** abbreviate. `obj`, `i`, `arr` and `mapDDFieldtoOC` are not acceptable names.
- `camelCase` for TypeScript, `snake_case` for Python variables, functions and methods. `PascalCase` for classes,
  types and React components. `SCREAMING_SNAKE_CASE` for global constants.
- A function name should start with a verb and say what the function returns or does: `getUserByEmail`,
  `assembleInvoiceLines`. Not a noun phrase, not a bare adjective.
- Use `get` for a function that returns its result or throws, and `find` for one that may return `null`. Use
  `assemble` for building a value from parts, `create` for making a new thing, `evaluate` for deciding and `validate`
  for throwing on a bad input.
- A constant should name what it is, not only its value: `ALLOWED_ROLES`, not `ALLOWED`.
- A class name should be descriptive on its own: `PaymentRequirements`, not `Requirements`.
- A list of alternatives should say so in its name: `rolesOrGroups`.
- A type parameter should carry no `Type` suffix: `Action`, not `ActionType`.
- The type of a parameter object should be named `XxxParams`.
- It is Openframe, never OpenFrame.

## Types

- Prefer a type guard (`isRole`, `isCurrency`) over a cast. In particular, validate values from outside the
  application, such as requests, environment variables and third-party responses, before treating them as application
  types. A type guard must check the properties that establish the type, and a schema validator can do the same. A
  cast performs no validation.

## Functions and classes

- Several identifiers should travel as one named object: `new InvoiceLoader({ customerId, invoiceId })`, typed
  `InvoiceLoaderParams`. No inline object types in a constructor signature, and avoid them in method signatures too.
- A class file should be named after the class, with its kind as a suffix: `invoice.service.ts`,
  `invoice.repository.ts`, `resourceNotFound.error.ts`.

## Utility functions

- Use utility functions sparingly, for small, repetitive operations. Put them in the folder's `utils.ts`. When
  utilities need separate modules, group them by concept or domain under `utils/`: `utils/secrets.ts`, not
  `utils/encryptData.ts`. Never create a file named after the single function it contains.
- Larger behavior should live in a service or repository, so that consumers can replace that dependency in tests.
  Choose between the two by responsibility: repositories own data access.

## Errors

- An error message should be specific (`Company with ID xxx not found`, not `Entity not found`) and carry the right
  status code: that one is a 404, not a 500.
- Catch an error only to recover, translate it at a boundary, or add useful context. Preserve its cause when wrapping
  it. Never silently discard a failure.

## Logging

- Do not log credentials, access tokens or sensitive payloads. Include enough operational context to diagnose a
  failure.

## React

- Express reusable or substantial UI as components, not as functions that return JSX or callbacks that construct a
  component tree. Declare components at module scope, usually in their own files, and pass their inputs as props.
  Components may use hooks directly.
- Do not memoize components or JSX with `memo`, `useMemo` or `useCallback`. When rendering logic becomes complex,
  extract a component.

## Identifiers of entities

- No numeric IDs. Use UUIDv4 everywhere.
- An entity that is referred to by its ID from outside, such as a task whose ID appears in a URL, may use
  `ShortUniqueId` (25 characters) or `CUID` (11 characters).

## Keeping the code clean

- No commented-out code. A `@TODO` that points at a specific commented-out fragment is fine.
- No unused functions, classes, components or files. Code that is needed later should live in a branch or in the git
  history; failing that, mark it with `@TODO`.

## Git and dependencies

- The task ID should prefix the branch (`dev-1234-<description>`) and the pull request title (`DEV-1234: <title>`).
  Jira links a task to its branches this way.
- Pin exact dependency versions and run a plain `npm install`.
- Before asking for a review, the lint and typecheck scripts of the repository should pass.

## Other languages

- **Java:** the Google style, checked with [checkstyle](https://checkstyle.sourceforge.io/) through
  `mvn checkstyle:check`.
- **Python:** checked with [ruff](https://github.com/astral-sh/ruff) through `ruff check`.
