# Verticopolis/.github

The organization's shared files. `profile/README.md` is the page at
[github.com/Verticopolis](https://github.com/Verticopolis).

## Defaults for every repository

GitHub uses these in any Verticopolis repository that has no file of its own:

| File | What it is |
| --- | --- |
| `.github/FUNDING.yml` | The Sponsor button |
| `SECURITY.md` | How to report a vulnerability privately |
| `.github/ISSUE_TEMPLATE/` | Generic issue forms (bug, feature, documentation, task) |
| `.github/PULL_REQUEST_TEMPLATE.md` | A generic pull request template |

The game, the engine and the components keep their own issue forms and PR
templates, written for what each one holds.

## Shared checks

Three reusable workflows keep issues, pull requests and labels in the same
shape in every repository. Each repository calls them from a short workflow
of its own and keeps the files they read in its own `.github/`:

| Workflow | Reads | Does |
| --- | --- | --- |
| `pr-template.yml` | `.github/PULL_REQUEST_TEMPLATE.md` | Fails a PR description that drops a `## ` section, leaves one empty, ticks no "Type of change" box or leaves the hot-path record line blank |
| `issue-form.yml` | `.github/ISSUE_TEMPLATE/*.yml` | Adds `needs-form` to an issue whose body does not follow the form its type label names, and removes it once fixed |
| `sync-labels.yml` | `.github/labels.yml` | Creates or updates the listed labels; never deletes one |

A caller looks like this:

```yaml
name: PR template
on:
  pull_request:
    branches: [main]
    types: [opened, edited, reopened, synchronize, ready_for_review]
permissions:
  contents: read
jobs:
  description:
    uses: Verticopolis/.github/.github/workflows/pr-template.yml@main
```

The rules live in `checks/` with their tests. Run a check by hand from a
checkout of this repository, pointing `--root` at the repository you are
writing for:

```sh
node checks/pr-template-check.ts --root ../engine --body-file body.md
node checks/issue-form-check.ts --root ../engine --form bug_report --body-file issue.md
GH_REPO=Verticopolis/engine node checks/sync-labels.ts --root ../engine --dry-run
```

Build and test:

```sh
npm ci
npm run typecheck
npm test
```
