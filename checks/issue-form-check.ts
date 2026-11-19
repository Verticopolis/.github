/**
 * Checks an issue body against the issue form its labels call for, in the
 * checked repository's `.github/ISSUE_TEMPLATE/`. The rules are in
 * `issueForms.ts`.
 *
 *   node checks/issue-form-check.ts [--root <repo>] (--form <name> | --labels <a,b,...>) [--body-file <path>]
 *
 * `--root` is the checkout of the repository whose forms apply (the current
 * directory when left out). `--form` names a form file without `.yml`, such
 * as `bug_report`. `--labels` picks the form from the issue's labels, trying
 * the forms in `FORM_ORDER` first and any others after them by file name, so
 * a parity bug follows the parity form. The body comes from `--body-file`, or
 * else the `ISSUE_BODY` environment variable (the workflow passes it there,
 * never through the command line).
 *
 * Exit codes: 0 when the body follows the form, 1 when it does not, and 3 when
 * no label names a form (the workflow leaves such an issue alone).
 *
 * Node runs this file directly, so it uses only erasable TypeScript syntax.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { checkIssueBody, formForLabels, parseIssueForm, type IssueForm } from "./issueForms.ts";

/** The order forms are tried in when several match an issue's labels. */
const FORM_ORDER = ["parity_report", "bug_report", "documentation", "feature_request", "task"];

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const formDir = resolve(arg("--root") ?? ".", ".github/ISSUE_TEMPLATE");
const read = (stem: string): IssueForm => parseIssueForm(readFileSync(resolve(formDir, `${stem}.yml`), "utf8"));

/** The repository's forms, `FORM_ORDER` first. */
function formStems(): string[] {
  const present = readdirSync(formDir)
    .filter((f) => f.endsWith(".yml") && f !== "config.yml")
    .map((f) => f.slice(0, -".yml".length));
  const known = FORM_ORDER.filter((s) => present.includes(s));
  return [...known, ...present.filter((s) => !known.includes(s)).sort()];
}

const formName = arg("--form");
const labelArg = arg("--labels");
if (!formName && labelArg === undefined) {
  console.error(
    "usage: node checks/issue-form-check.ts [--root <repo>] (--form <name> | --labels <a,b,...>) [--body-file <path>]",
  );
  process.exit(2);
}
let form: IssueForm | undefined;
if (formName) {
  form = read(formName);
} else {
  const labels = (labelArg ?? "").split(",").map((l) => l.trim()).filter(Boolean);
  form = formForLabels(labels, formStems().map(read));
  if (!form) {
    console.log(`No issue form matches the labels [${labels.join(", ")}]; nothing to check.`);
    process.exit(3);
  }
}

const bodyFile = arg("--body-file");
const body = bodyFile ? readFileSync(bodyFile, "utf8") : (process.env.ISSUE_BODY ?? "");
const problems = checkIssueBody(body, form);
if (problems.length === 0) {
  console.log(`The body follows the "${form.name}" form.`);
  process.exit(0);
}
console.error(`The body does not follow the "${form.name}" form:`);
for (const problem of problems) console.error(`  - ${problem}`);
console.error(
  'Write one "### <field label>" section per form field, in the form\'s order, and answer each required one.',
);
process.exit(1);
