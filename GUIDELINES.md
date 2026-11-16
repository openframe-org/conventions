# Guidelines

How we work, and the calls that need judgement. The rules a change must follow are in
[CONVENTIONS.md](./CONVENTIONS.md).

## Pull requests

- **Ask for a review when you need one.** If the pull request goes stale, remind the reviewer. If it blocks you, say
  so.
- **One task, one pull request.** Keep unrelated tasks in separate branches unless they deeply depend on each other.
  The effort of a review grows much faster than the amount of code in it.
- **Review the code first.** Do not outsource checking the code: everything a reviewer goes through should have gone
  through you first.
  - **Before requesting a review, you must review the code yourself.**
  - **Ensure you are reviewing the latest version of the code.** The reviewer should review what you reviewed.
  - Request reviews from your AI agents. CodeRabbit does an automated review. Iterate with them until you are all
    satisfied with the state of the code. **Review the code yourself too, don't just leave it for the AI agents.**
  - There are conventions and styling notes in some repositories. Use those as a guide, as well as the ones described
    in this repository.
  - Only request a review afterwards.
  - If you disagree with a review comment or are unsure, reply to it and tag the reviewer. Follow it through, don't
    wait for the reviewer to ping you first.
- **`main` always works.** When your change is merged, `main` is stable and runs. Servers "just work" from `main`.
- **So does your branch.** The reviewer must be able to pull it and run it. Tell people about new environment
  variables and requirements, and about database migrations they need to run.
- **Coordinate changes that span frontend and backend.** When a feature breaks both at once, make sure everybody
  knows, and merge in an orderly way.

## Reviewing

Automated reviewers check the code against itself: bugs, edge cases, style. A human reviewer checks what they cannot
know.

- Is this the right change? Does it solve the actual problem, and is there a simpler way?
- Does it fit the system? Is the code in the right place, and does it duplicate something that exists?
- Does it respect the decisions and invariants that are written down nowhere?
- Are the risky parts right: migrations, authorization, deletion of data, public interfaces, anything hard to undo?
- Do the tests cover the behavior that matters?
- Can something be deleted or made simpler?

Approve a change once it improves the code, even if it is not perfect. Say which comments block the merge and which
are suggestions. When a convention covers the point, link it instead of explaining it again. What neither a
convention nor Google's guide covers is the author's call.

## Testing

Our main method of development is [test-driven development](https://www.browserstack.com/guide/what-is-test-driven-development).

- **Backend:** code comes with end-to-end, integration or unit tests. There is almost always an existing test close
  to what you need. Write the test before the code where you can, to avoid confirmation bias.
- **Frontend:** a large feature gets [Playwright](https://playwright.dev/) tests, and a reusable component goes into
  [Storybook](https://storybook.js.org/). Where neither fits, test the change thoroughly by hand, with smoke tests
  if needed.
- Assert what the system did, not what the code under test called: read the database again, render the message and
  check its body. Do not spy on the methods of the service under test.
- Test a state machine backwards as well as forwards: every refused transition has a test next to the allowed ones.
- A fixture or helper is named by what it returns. A test over several cases lists them as named entries, each with
  its expectation beside it.

## Writing code

- **Keep nesting shallow.** Deeply nested code quickly becomes hard to follow.
- **Split long functions.** Not into two hundred functions of two lines, but a function of a hundred lines can
  usually be split into parts that read better and can be tested on their own.
- **Return early.** Inverting a condition takes the main path out of the block:

  ```ts
  if (!conditionIsTrue) {
    return somethingElse;
  }

  // The thirty lines that used to sit inside the condition.
  return somethingOrOther;
  ```

- **Be professional in your code and
  [comments](https://github.com/s626ch/stitch-website-sveltekit/commit/6812c52e94cf2e3aa3b21cb45b94e68f87bb6f41).**
  Comments, names and git messages should not be "[funny](https://latenightcommits.com/)" and should reflect their
  context: `Fixes linting issues`, not `tries to make teh stupid thing work`. Ensure proper spelling, and keep it on
  point.

## Documentation

What does not belong in a [comment](./CONVENTIONS.md#comments) goes in a README or in `docs/`, and stays short there
too. Documentation explains the idea and the reasoning behind the implementation. It does not describe the
implementation step by step. It may be a little more verbose than a comment, but only as far as it takes to avoid
being terse: it stays on the point.

## AI agents

Agents follow the same conventions and guidelines, plus the working rules in [AGENTS.md](./AGENTS.md).
