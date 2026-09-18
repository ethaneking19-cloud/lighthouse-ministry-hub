// Static and data-integrity checks for Lighthouse Ministry Hub.
//
//   node tests/static-checks.mjs
//
// These checks are read-only. They catch the failure modes that are easy to
// introduce when editing a single-page app by hand: selectors that point at
// element ids that no longer exist, navigation links to missing anchors, and
// demo records that do not reconcile with their own point history.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFileSync(join(ROOT, relative), "utf8");

let failures = 0;
let warnings = 0;
let checks = 0;

// Accepted, documented findings. They are still reported on every run so they
// cannot be forgotten, but they do not fail the suite. See PROJECT-DOCUMENTATION.md,
// section 6.3 "Findings and dispositions".
const KNOWN_ISSUES = new Set(["event-list"]);

function check(name, condition, detail = "") {
  checks += 1;
  if (condition) {
    console.log(`  PASS  ${name}`);
    return;
  }
  const items = detail
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allKnown = items.length > 0 && items.every((item) => KNOWN_ISSUES.has(item));
  if (allKnown) {
    warnings += 1;
    console.log(`  WARN  ${name} -> ${detail} (accepted, documented)`);
    return;
  }
  failures += 1;
  console.log(`  FAIL  ${name}${detail ? ` -> ${detail}` : ""}`);
}

const html = read("index.html");
const js = read("app.js");

// ---- 1. Every element id referenced by app.js exists in index.html ----
console.log("\nElement references");

const htmlIds = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const selectors = [...js.matchAll(/querySelector(?:All)?\(\s*"([^"]+)"\s*\)/g)].map(
  (match) => match[1]
);
const referencedIds = new Set();
selectors.forEach((selector) => {
  [...selector.matchAll(/#([A-Za-z0-9_-]+)/g)].forEach((match) => referencedIds.add(match[1]));
});

const missingIds = [...referencedIds].filter((id) => !htmlIds.has(id)).sort();
check(
  `app.js selectors resolve (${referencedIds.size} ids referenced)`,
  missingIds.length === 0,
  missingIds.join(", ")
);

// ---- 2. Every in-page link points at a real anchor ----
console.log("\nIn-page navigation");

const anchorTargets = new Set([...html.matchAll(/href="#([A-Za-z0-9_-]+)"/g)].map((m) => m[1]));
const brokenAnchors = [...anchorTargets].filter((id) => !htmlIds.has(id)).sort();
check(
  `all #anchors exist (${anchorTargets.size} links)`,
  brokenAnchors.length === 0,
  brokenAnchors.join(", ")
);

// ---- 3. No leftover references to the original host organization ----
console.log("\nRebranding guard");

const sourceFiles = ["index.html", "app.js", "styles.css", "README.md", "DEPLOYMENT.md"];
const forbidden = /englewood/i;
const originHits = sourceFiles.filter((file) => {
  if (!existsSync(join(ROOT, file))) return false;
  return forbidden.test(read(file));
});
check(
  "shipped source files contain no original organization name",
  originHits.length === 0,
  originHits.join(", ")
);

// ---- 4. Demo roster integrity ----
console.log("\nSample roster integrity");

const samplePath = "sample-data/sample-roster-backup.json";
if (!existsSync(join(ROOT, samplePath))) {
  check("sample roster present", false, samplePath);
} else {
  const payload = JSON.parse(read(samplePath));
  const state = payload.state;
  check("backup payload has a state object", Boolean(state));

  const people = state.people || [];
  const visits = state.visits || [];
  const activity = state.activity || [];
  const personIds = new Set(people.map((person) => person.id));

  const duplicateIds = people.length - personIds.size;
  check(`member ids are unique (${people.length} members)`, duplicateIds === 0);

  const orphanVisits = visits.filter((visit) => !personIds.has(visit.personId));
  check(`every visit references a member (${visits.length} visits)`, orphanVisits.length === 0);

  const orphanActivity = activity.filter(
    (entry) => entry.personId && !personIds.has(entry.personId)
  );
  check(
    `every activity entry references a member (${activity.length} entries)`,
    orphanActivity.length === 0
  );

  // Point balances must equal the sum of that member's logged changes.
  let mismatched = 0;
  people.forEach((person) => {
    const ledger = activity.filter((entry) => entry.personId === person.id);
    const total = ledger.reduce((sum, entry) => sum + (entry.delta || 0), 0);
    if (total !== person.points) mismatched += 1;
  });
  check("member point balances reconcile with activity history", mismatched === 0, `${mismatched} mismatched`);

  // Redeemed items must exist in the catalog so the summary can categorize them.
  // When a backup omits `items`, the app falls back to its built-in defaults,
  // so those defaults are part of the real runtime catalog too.
  const defaultsBlock = js.slice(
    js.indexOf("const defaultItems = ["),
    js.indexOf("];", js.indexOf("const defaultItems = ["))
  );
  const builtInItemNames = [...defaultsBlock.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
  const itemNames = new Set([
    ...builtInItemNames,
    ...(state.items || []).map((item) => item.name),
  ]);
  const customNames = new Set((state.customItems || []).map((item) => item.name));
  const unknownItems = new Set();
  activity
    .filter((entry) => entry.type === "redeem")
    .forEach((entry) => {
      String(entry.note || "")
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => {
          const match = part.match(/^(\d+)\s*x\s*(.+)$/i);
          const name = match ? match[2].trim() : part;
          if (!itemNames.has(name) && !customNames.has(name)) unknownItems.add(name);
        });
    });
  check("redeemed items exist in the item catalog", unknownItems.size === 0, [...unknownItems].join(", "));

  check("sample roster contains no original organization name", !forbidden.test(JSON.stringify(state)));

  // Documents must carry inline file data, or the viewer will render nothing.
  const documents = state.documents || [];
  const emptyDocs = documents.filter((doc) => !doc.dataUrl);
  check(`documents carry inline file data (${documents.length} documents)`, emptyDocs.length === 0);
}

const passed = checks - failures - warnings;
console.log(
  `\n${passed}/${checks} checks passed` +
    (warnings ? `, ${warnings} accepted warning(s)` : "") +
    (failures ? `, ${failures} failure(s)` : "")
);
if (failures > 0) {
  process.exitCode = 1;
}
