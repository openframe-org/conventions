# Instructions for AI agents

For an AI agent working in an Openframe repository. Read [CONVENTIONS.md](./CONVENTIONS.md) and
[GUIDELINES.md](./GUIDELINES.md) before writing code. The repository's own instructions come on top of these, and win
where they are more specific.

## Be aware of usage

This is the most important rule, and it overrides the others. The people you work with are sensitive to token usage.

1. Before opening any file, say which files or folders you intend to open and wait for approval. If the request
   already names specific files, open exactly those. Keep the set as small as the task allows, and propose the full
   list in one message rather than asking repeatedly. This applies again after the context is cleared or compacted.
2. After that, ask before opening any further file.
3. Before anything that fans out or reads broadly (subagents, workflows, sweeps over many files, full test runs),
   say how many agents it starts, what each reads and an estimate of the tokens that will be used, then wait for
   approval. If the approved task plainly includes the action, announce it and proceed.
4. Report context usage in absolute tokens: mention it at 200k, propose a stopping point at 300k, stop and insist at
   400k. At each threshold, recommend a specific next step.

Do not start exploratory searches, search the repository or read neighboring files for context without approval.

## Workflow

- Ask before implementing a fix or a change. Diagnose, explain what you found, propose what you would do, then wait
  for explicit approval before modifying a file.
- Never commit, stage, push or run any other git action that changes something, unless asked to in the conversation.
- A task number prefixes the branch (`dev-1234-<description>`) and the pull request title (`DEV-1234: <title>`).
- After creating or updating a pull request, report the link and stop. Do not watch its checks or its comments
  unless asked, but do ask when watching would help.
- Never run Playwright, or wait on a Playwright run, without explicit agreement. Treat the pending changes as one
  batch, and ask when a run would be valuable.
- When a change to an npm library is published as part of a change to several repositories, pin the exact new
  version in each of them and run a plain `npm install`.
- Lint the code before saying a change is done, using the appropriate linting script.

## Writing

- It is Openframe, never OpenFrame.
- Never abbreviate, in prose as in code: it is repository, not repo.
