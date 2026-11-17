<img alt="Openframe ApS" src="https://openframe-public.s3.eu-west-1.amazonaws.com/assets/logo-text-google-admin.png" width="200" />

# Openframe conventions

How Openframe writes code: the written rules, and the configuration that enforces them.

| File                                | What it holds                                                 |
| ----------------------------------- | ------------------------------------------------------------- |
| [CONVENTIONS.md](./CONVENTIONS.md)  | The rules our codebase must follow                            |
| [GUIDELINES.md](./GUIDELINES.md)    | How we work: pull requests, reviews, tests, judgement         |
| [AGENTS.md](./AGENTS.md)            | Instructions for AI agents working in an Openframe repository |
| `eslint/`, `prettier/`, `tsconfig/` | The ESLint presets, Prettier configuration and tsconfig bases |

The baseline is the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html).
`CONVENTIONS.md` lists what Openframe adds and the few places where it differs.

## Using it in a repository

```bash
npm install --save-dev --save-exact @openframe-org/conventions
```

### ESLint

There is one preset per kind of repository. Each takes the tsconfig that covers every linted TypeScript file, because
the rules use type information.

| Preset                                                                    | For                                         |
| ------------------------------------------------------------------------- | ------------------------------------------- |
| `createServiceConfiguration` from `@openframe-org/conventions/eslint`     | Backend services, which run on vanilla Node |
| `createLibraryConfiguration` from `@openframe-org/conventions/eslint`     | Libraries, compiled before publishing       |
| `createReactConfiguration` from `@openframe-org/conventions/eslint/react` | React applications                          |

```js
// eslint.config.js
import { createServiceConfiguration } from "@openframe-org/conventions/eslint";

export default [
  { ignores: ["build/**"] },
  ...createServiceConfiguration({ tsconfigRootDir: import.meta.dirname, project: "./tsconfig.eslint.json" }),
];
```

A repository that needs to differ adds its override after the preset, with a comment saying why. The React preset
needs `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` and `@tanstack/eslint-plugin-query`
installed.

### Prettier

```json
{
  "prettier": "@openframe-org/conventions/prettier"
}
```

Keep the repository's `.editorconfig`, which editors read on their own.

### TypeScript

```json
{
  "extends": "@openframe-org/conventions/tsconfig/service.json",
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

`service.json` is for backend services and `library.json` for libraries. Paths stay in the repository's own
tsconfig: `include`, `exclude`, `rootDir`, `outDir`, and for a library `lib` and `types`. A React application keeps
its own tsconfig, since its options are the bundler's.

### AI agents

The written files ship inside the package, so a repository's own `AGENTS.md` only has to point at them:

```md
Follow `node_modules/@openframe-org/conventions/AGENTS.md`, and the `CONVENTIONS.md` and `GUIDELINES.md` beside it.
```

### A repository's own rules

A repository can add conventions and guidelines of its own. For consistency, they go in the `docs/CONVENTIONS.md` and
`docs/GUIDELINES.md` of that repository.

## Changing a rule

Change a rule and what `CONVENTIONS.md` says about it in the same pull request, so that the two never disagree. If a
rule exists for a specific reason, write that reason as a comment next to the rule.

## Development

```bash
npm install
```

```bash
npm test
```

```bash
npm run lint
```

The tests lint the files in `tests/fixtures` with each preset: `clean.ts` must pass and `violations.ts` must be
reported.

## License

Proprietary. Nobody but Openframe ApS is licensed to use this repository; see [LICENSE](./LICENSE).
