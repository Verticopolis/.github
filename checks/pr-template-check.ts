/**
 * Checks a pull request description against the checked repository's
 * `.github/PULL_REQUEST_TEMPLATE.md`. The rules are in `prTemplate.ts`.
 *
 *   node checks/pr-template-check.ts [--root <repo>] [--body-file <path>] [--branch <name>] [--author <login>]
 *
 * `--root` is the checkout of the repository whose template applies (the
 * current directory when left out). The description comes from `--body-file`,
 * or else the `PR_BODY` environment variable (the workflow passes it there,
 * never through the command line). Release PRs (`release/` branches),
 * Dependabot branches and bot authors are skipped: their descriptions are
 * written by their tools.
 *
 * Node runs this file directly, so it uses only erasable TypeScript syntax.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { checkPrBody } from "./prTemplate.ts";

const TEMPLATE = ".github/PULL_REQUEST_TEMPLATE.md";
/** Branches whose PR descriptions their tools write. */
const RELEASE_BRANCH = /^release\//;
const BOT_BRANCH = /^dependabot\//;

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const root = resolve(arg("--root") ?? ".");
const branch = arg("--branch") ?? "";
const author = arg("--author") ?? "";
if (RELEASE_BRANCH.test(branch) || BOT_BRANCH.test(branch) || author.endsWith("[bot]")) {
  console.log(`Skipped: ${branch || author} writes its own description.`);
  process.exit(0);
}

const bodyFile = arg("--body-file");
const body = bodyFile ? readFileSync(bodyFile, "utf8") : (process.env.PR_BODY ?? "");
const problems = checkPrBody(body, readFileSync(resolve(root, TEMPLATE), "utf8"));
if (problems.length === 0) {
  console.log(`The description follows ${TEMPLATE}.`);
  process.exit(0);
}
console.error(`The description does not follow ${TEMPLATE}:`);
for (const problem of problems) console.error(`  - ${problem}`);
console.error(
  "Start the body from the template, keep every ## heading, and fill each section " +
    '("None" or "n/a: <reason>" where it does not apply).',
);
process.exit(1);
