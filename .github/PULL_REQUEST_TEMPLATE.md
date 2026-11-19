<!--
Thanks for contributing to Verticopolis! Fill in the sections below, in
American English and without em-dashes.
Keep every ## heading and write something under each one: "None" or
"n/a: <reason>" where a section does not apply. The PR template check fails a
description that drops a heading. Opening a PR through the API or
`gh pr create --body` skips this template, so start that body from this file.
-->

## What & why

<!-- What does this change do, and what problem does it solve? Link any related issue. -->

Closes #

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature
- [ ] Refactor / internal-only (no behavior change)
- [ ] Docs / tooling

## Quality gates

<!-- The checks this repository's README lists under "Build and test", each green before merge. -->

- [ ] The repository's build and test commands pass

## Complexity

<!--
A change to a hot path (the engine step, rendering, the frame loop, saves and
the other surfaces in section 1 of the hot-path review page,
https://github.com/Verticopolis/web/blob/main/docs/performance/hot-path-review.md)
fills in the note from section 5 of that page. Any other change may replace the
first line below with "n/a: <reason>". The second line links the section 6
review record once a review has posted it on this PR, or says
"no hot-path surface".
-->

Hot paths and call frequency (tier), sizes, complexity before and after, remaining scans and why, caches kept or replaced (HP-8), invalidation evidence, measurements:

Hot-path record (section 6): link

## Notes for reviewers

<!-- Trade-offs, follow-ups, anything that helps the review. "None" if nothing. -->
