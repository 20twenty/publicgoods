# Contributing

## The most useful thing you can do: file an issue

This isn't a typical code repo. The skills here are instruction files for AI agents, and the most valuable contribution is telling us about your experience — what you were trying to do, what happened, and what a good answer would have looked like.

If something didn't work, or you hit a gap in what this skill can handle, [open an issue](https://github.com/20twenty/publicgoods/issues/new/choose). Use the template that fits best. The more context you give about the *why* behind what you were trying to do, the more useful it is.

## On pull requests

PRs are welcome, but a PR without context is hard to evaluate. Before opening one, file an issue first and describe the problem you're solving. A PR that arrives with a clear issue behind it — explaining what the user was trying to accomplish, what went wrong, and why the change fixes it — is easy to review and merge. A PR without that context is not.

If you do open a PR, make sure:
- There's a linked issue explaining the motivation
- The change is focused — one problem, one fix
- Any new CLI commands or behaviors are reflected in `skills/fred/SKILL.md`
- You've tested it against real FRED API responses, not just static data

## Adding a new skill

If you want to contribute a new skill to the `publicgoods` collection, open an issue first to discuss it. Skills in this repo should be focused on public-goods data — openly available datasets from governments, central banks, international institutions, or similar sources. Propose the data source and use case, and we'll go from there.
