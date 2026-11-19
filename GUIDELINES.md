# Guidelines

How we work, and the calls that need judgement. The rules our codebase must follow are in
[CONVENTIONS.md](./CONVENTIONS.md).

A repository can add guidelines of its own, in its `docs/GUIDELINES.md`.

## Pull requests

- **Ask for a review when you need one.** If the pull request goes stale, remind the reviewer. If it blocks you, say
  so.
- **One task, one pull request.** Keep unrelated tasks in separate branches unless they deeply depend on each other.
  The effort of a review grows much faster than the amount of code in it.
- **Review the code first.** Do not outsource checking the code: everything a reviewer goes through should have gone
  through you first.
  - **Before requesting a review, you must review the code yourself.**
  - **Ensure you are reviewing the latest version of the code.** The reviewer should review what you reviewed.
  - Request reviews from your own AI agents. CodeRabbit also reviews every pull request automatically, on top of
    theirs. Iterate with all of them until you are all satisfied with the state of the code. **Review the code
    yourself too, don't just leave it for the AI agents.**
  - There are conventions and styling notes in some repositories. Use those as a guide, as well as the ones described
    in this repository.
  - Only request a review afterwards.
  - If you disagree with a review comment or are unsure, reply to it and tag the reviewer. Follow it through, don't
    wait for the reviewer to ping you first.
- **`main` should always be in a working state.** It is up to you to make sure that, once your change is merged,
  `main` is stable and runs. Servers should "just work" from `main`.
- **Your branch should work when it is reviewed.** The reviewer must be able to pull it and run it. Tell people about
  new environment variables and requirements, and about database migrations they need to run.
- **Coordinate changes that span frontend and backend.** When a feature breaks both at once, make sure everybody
  knows, and merge in an orderly way.

## Reviewing

We follow Google's [code review guide](https://google.github.io/eng-practices/review/). This is its core, and how
the work is split between people and AI reviewers.

**What a review is for**

- Keeping the codebase healthy. Approve a change once it clearly improves the code, even if it is not perfect.
- Making sure that more than one person understands every change.
- Catching mistakes. Reviews catch fewer of them than people expect, so they do not replace tests.

**What the human reviewer should look at**, in this order:

1. Design: is this the right change, in the right place, and does it fit the rest of the system?
2. Functionality: does it do what was intended, and is that good for the people who use it?
3. Complexity: can it be simpler? Does it solve a problem that does not exist yet?
4. Tests: are they there, and do they test the behavior that matters?
5. Risk: whatever is expensive to get wrong or hard to undo, such as a migration, a permission check, code that
   deletes data, or a change to a public interface.

**What the AI reviewers should look at**

Everything the human reviewer does, and more: the conventions of this repository, and every line for slips such as a
missing null check, an unhandled error, an edge case, a typo or duplicated code. The linter covers formatting and
the lint rules.

**What the human reviewer should leave to them**

The line-by-line work. Do not go looking for slips, and do not repeat what a tool has already said. A bug you do
notice is still worth a comment. If a tool keeps missing something, add a lint rule or a convention instead of
another comment. An AI approval must never replace a person's.

**How**

- Keep pull requests small. The bigger one is, the longer it takes to review, the fewer bugs are found, and the more
  tedious the review becomes.
- Try to review code as soon as you receive it - and try to implement the required changes as soon as possible too.
- Say which comments block the merge, and prefix an optional one with "Nit:".
- When you and the author disagree, a technical reason should win over a preference. A question of style should be
  settled by the conventions. If they do not cover it, the author's choice should stand.

## Testing

Our main method of development is [test-driven development](https://www.browserstack.com/guide/what-is-test-driven-development).

- **Backend:** code should come with end-to-end, integration or unit tests. There is almost always an existing test
  close to what you need. Write the test before the code where you can, to avoid confirmation bias.
- **Frontend:** a large feature should get [Playwright](https://playwright.dev/) tests, and a reusable component
  should go into [Storybook](https://storybook.js.org/). Where neither fits, test the change thoroughly by hand, with
  smoke tests if needed.
- Assert what the system did, not what the code under test called: read the database again, render the message and
  check its body. Do not spy on the methods of the service under test.
- Test a state machine backwards as well as forwards: every refused transition should have a test next to the allowed
  ones.
- Tests must not depend on execution order or on shared mutable state. Each test should own its setup and clean up the
  state it creates. Control time and randomness when they affect the result. An end-to-end journey may contain
  dependent steps, but the journey as a whole should run independently.
- A fixture or helper should be named by what it returns. A test over several cases should list them as named entries,
  each with its expectation beside it.

## Writing code

- **Use a library when one exists.** Do not reinvent the wheel: text editors, date functions, HTTP errors, WebSocket
  handlers and other solved problems should come from a maintained library. The exception is a small need in a simple
  codebase, where the library would be a heavy dependency for what it gives: a few lines of our own code are better
  than a large package used for one function. When you skip a library deliberately, say so in the pull request.
- **Keep nesting shallow.** Deeply nested code quickly becomes hard to follow.
- **Split long functions.** Not into two hundred functions of two lines, but a function of a hundred lines can
  usually be split into parts that read better and can be tested on their own.
- **Use conditionals and returns to your advantage.** For example, the following:

  ```tsx
  if (conditionIsTrue) {
    // 30 lines of code! Deeply nested!
    return somethingOrOther;
  }

  return somethingElse;
  ```

  Can instead be written as:

  ```tsx
  if (!conditionIsTrue) {
    return somethingElse;
  }

  // 30 lines of code! A bit less deeply nested!
  return somethingOrOther;
  ```

  Inverting conditionals and splitting code into methods and functions helps keep code nesting to a minimum, which
  makes it more readable and easier to work with.

- **Only inline when it aids readability.** This is harder to read and more likely to introduce bugs:

  ```ts
  for (const portfolioId of portfolioIds.filter((id) => !managedPortfolioIds.includes(id))) {
  ```

  than this:

  ```ts
  const filteredPortfolioIds = portfolioIds.filter((id) => !managedPortfolioIds.includes(id));
  for (const portfolioId of filteredPortfolioIds) {
  ```

- **Be professional in your code and
  [comments](https://github.com/s626ch/stitch-website-sveltekit/commit/6812c52e94cf2e3aa3b21cb45b94e68f87bb6f41).**
  Comments, names and git messages should not be "[funny](https://latenightcommits.com/)" and should reflect their
  context: `Fixes linting issues`, not `tries to make teh stupid thing work`. Ensure proper spelling, and keep it on
  point.

## Documentation

What does not belong in a [comment](./CONVENTIONS.md#comments) should go in a README or in `docs/`, and should stay
short there too. Documentation should explain the idea and the reasoning behind the implementation. It should not
describe the implementation step by step. It may be a little more verbose than a comment, but only as far as it takes
to avoid being terse: it should stay on the point.

## AI agents

Agents should follow the same conventions and guidelines, plus the working rules in [AGENTS.md](./AGENTS.md).
