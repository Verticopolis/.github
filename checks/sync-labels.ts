/**
 * Creates or updates every label in the checked repository's
 * `.github/labels.yml` (the Sync labels workflow, or by hand with `gh` signed
 * in and `GH_REPO` naming the repository). It never deletes a label that is
 * not listed. The reader is `labelList.ts`.
 *
 *   node checks/sync-labels.ts [--root <repo>] [--dry-run]
 *
 * Node runs this file directly, so it uses only erasable TypeScript syntax.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { labelSyncArgs, parseLabelList } from "./labelList.ts";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const root = resolve(arg("--root") ?? ".");
const dryRun = process.argv.includes("--dry-run");
const labels = parseLabelList(readFileSync(resolve(root, ".github/labels.yml"), "utf8"));
for (const label of labels) {
  const args = labelSyncArgs(label);
  if (dryRun) console.log(`gh ${args.map((a) => JSON.stringify(a)).join(" ")}`);
  else execFileSync("gh", args, { stdio: "inherit" });
}
console.log(`${dryRun ? "Would sync" : "Synced"} ${labels.length} labels.`);
