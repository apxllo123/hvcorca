// Verifies that a generated bundle defines every instance and module it references.
//
// ci/bundle.lua flattens the rojo model into newInstance/newModule calls, and the vendored
// RuntimeLib resolves packages with TS.getModule(script, "<scope>", "<name>") by walking the
// bundled node_modules tree. A package missing from that tree - for example one the installer
// did not hoist into node_modules/@rbxts, which default.project.json maps into the bundle -
// still bundles cleanly but throws "Could not find module" in Roblox at runtime. This check
// turns that runtime failure into a build failure.

import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node ci/verify-bundle.mjs <bundle.lua> [...]");
  process.exit(2);
}

const DEF_RE = /new(?:Instance|Module)\("([^"]*)", "([^"]*)", "([^"]*)", (?:nil|"([^"]*)")/g;
const GET_RE = /getModule\(\s*[^,()]+,\s*"([^"]*)",\s*"([^"]*)"\s*\)/g;

let failed = false;

for (const file of files) {
  const source = readFileSync(file, "utf8");

  const defined = new Set();
  const parents = new Set();
  for (const m of source.matchAll(DEF_RE)) {
    defined.add(m[3]);
    if (m[4]) parents.add(m[4]);
  }

  const problems = [];
  for (const parent of parents) {
    if (!defined.has(parent)) {
      problems.push(`parent path is not defined: ${parent}`);
    }
  }

  for (const m of source.matchAll(GET_RE)) {
    const suffix = `node_modules.${m[1]}.${m[2]}`;
    let found = false;
    for (const path of defined) {
      if (path === suffix || path.endsWith(`.${suffix}`)) {
        found = true;
        break;
      }
    }
    if (!found) {
      problems.push(`unresolved module reference: getModule(script, "${m[1]}", "${m[2]}")`);
    }
  }

  if (problems.length > 0) {
    failed = true;
    console.error(`${file}: ${problems.length} problem(s)`);
    for (const problem of problems) {
      console.error(`  - ${problem}`);
    }
  } else {
    console.log(`${file}: ok (${defined.size} instances defined)`);
  }
}

process.exit(failed ? 1 : 0);
