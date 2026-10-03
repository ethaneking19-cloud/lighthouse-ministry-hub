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
const KNOWN_ISSUES = new Set([]);

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

// ---- 2. Every hash route resolves to a real page container ----
console.log("\nPage routing");

const routeListMatch = js.match(/const APP_ROUTES = \[([\s\S]*?)\];/);
const knownRoutes = routeListMatch
  ? [...routeListMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  : [];
const pageNames = new Set([...html.matchAll(/data-page="([^"]+)"/g)].map((m) => m[1]));

// Only "#/route" links belong to the hash router; plain "#id" anchors (such as
// the skip link) are checked separately below.
const routeLinks = [
  ...[...html.matchAll(/href="#\/([A-Za-z0-9_/-]*)"/g)].map((m) => m[1]),
  ...[...js.matchAll(/href\s*=\s*`?#\/([A-Za-z0-9_/-]*)/g)].map((m) => m[1]),
];
const uniqueRouteLinks = [...new Set(routeLinks)];
const brokenRoutes = uniqueRouteLinks.filter((route) => {
  const head = route.split("/").filter(Boolean)[0] || "dashboard";
  return !knownRoutes.includes(head);
});
check(
  `all hash routes resolve (${uniqueRouteLinks.length} links, ${knownRoutes.length} routes)`,
  knownRoutes.length > 0 && brokenRoutes.length === 0,
  brokenRoutes.join(", ")
);

const orphanRoutes = knownRoutes.filter((route) => !pageNames.has(route));
check(
  `every route has a page container (${pageNames.size} pages)`,
  orphanRoutes.length === 0,
  `missing data-page: ${orphanRoutes.join(", ")}`
);

const deadAnchorLinks = [...html.matchAll(/href="#(?![\/])([A-Za-z0-9_-]+)"/g)]
  .map((m) => m[1])
  .filter((id) => !htmlIds.has(id));
check(
  `in-page anchors resolve to real elements (${deadAnchorLinks.length} broken)`,
  deadAnchorLinks.length === 0,
  deadAnchorLinks.join(", ")
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

// Real-world places from the original build must not creep back into the demo
// data. These are checked in the shipped source only; the sample roster is
// guarded separately below.
const realWorldPatterns = [
  { label: "the former host city", pattern: /\bjackson\b/i },
  { label: "the former housing complex", pattern: /studio\s*45/i },
];
realWorldPatterns.forEach(({ label, pattern }) => {
  const hits = sourceFiles.filter(
    (file) => existsSync(join(ROOT, file)) && pattern.test(read(file))
  );
  check(
    `shipped source files contain no reference to ${label}`,
    hits.length === 0,
    hits.join(", ")
  );
});

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

  // The built-in resource seed and the demo roster must not drift apart: a fresh
  // local install should look exactly like the sample demo.
  const defaultBlock = read("app.js").match(/const DEFAULT_RESOURCES = \[([\s\S]*?)\r?\n\];/);
  const defaultNames = defaultBlock
    ? [...defaultBlock[1].matchAll(/\n\s*name: "([^"]+)"/g)].map((match) => match[1]).sort()
    : [];
  const rosterNames = (state.resources || []).map((resource) => resource.name).sort();
  check(
    `default resource seed matches the sample roster (${defaultNames.length} seeded)`,
    defaultNames.length > 0 && JSON.stringify(defaultNames) === JSON.stringify(rosterNames),
    `seeded ${defaultNames.length} vs roster ${rosterNames.length}`
  );

  // Documents must carry inline file data, or the viewer will render nothing.
  const documents = state.documents || [];
  const emptyDocs = documents.filter((doc) => !doc.dataUrl);
  check(`documents carry inline file data (${documents.length} documents)`, emptyDocs.length === 0);
}

// ---- 5. Accessibility affordances ----
console.log("\nAccessibility");

const css = read("styles.css");

// Controls that accept keyboard input need an accessible name: a wrapping
// label, a label[for], or aria-label/aria-labelledby.
const labelTargets = new Set(
  [...html.matchAll(/<label[^>]*\bfor="([^"]+)"/g)].map((match) => match[1])
);
const unlabelledControls = [];
[...html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)].forEach((match) => {
  const attrs = match[2];
  if (/\btype="(hidden|submit|button|file|checkbox|radio)"/.test(attrs)) return;
  if (/\baria-label(ledby)?=/.test(attrs)) return;
  const id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
  if (id && labelTargets.has(id)) return;
  const before = html.slice(Math.max(0, match.index - 300), match.index);
  if (/<label[^>]*>\s*[^<]*$/.test(before)) return;
  unlabelledControls.push(id || attrs.replace(/\s+/g, " ").trim().slice(0, 40));
});
check(
  `every form control has an accessible name (${unlabelledControls.length} missing)`,
  unlabelledControls.length === 0,
  unlabelledControls.join(", ")
);

// Icon-only buttons need a name too; the hamburger toggle is the only one.
const unnamedButtons = [];
[...html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/g)].forEach((match) => {
  const text = match[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text) return;
  if (/\baria-label(ledby)?=/.test(match[1])) return;
  unnamedButtons.push((match[1].match(/\bid="([^"]+)"/) || [])[1] || "(no id)");
});
check(
  `icon-only buttons expose an accessible name (${unnamedButtons.length} unnamed)`,
  unnamedButtons.length === 0,
  unnamedButtons.join(", ")
);

// Every dialog must be a labelled modal dialog with a focus-stopping key handler.
const dialogProblems = [];
const dialogs = [
  ...html.matchAll(/<div\s+id="([^"]+)"[\s\S]{0,400}?role="dialog"[\s\S]{0,400}?>/g),
];
dialogs.forEach((match) => {
  const block = match[0];
  const labelledBy = (block.match(/aria-labelledby="([^"]+)"/) || [])[1];
  if (!/aria-modal="true"/.test(block)) dialogProblems.push(`${match[1]} aria-modal`);
  if (!labelledBy || !htmlIds.has(labelledBy)) dialogProblems.push(`${match[1]} label`);
  if (!/\bhidden\b/.test(block)) dialogProblems.push(`${match[1]} hidden default`);
});
check(
  `modal dialogs declare role, aria-modal, and a label (${dialogs.length} dialogs)`,
  dialogs.length >= 2 && dialogProblems.length === 0,
  dialogProblems.join(", ")
);
check(
  "dialogs trap keyboard focus and respond to Escape",
  /function handleModalKeydown\(/.test(js) &&
    /event\.key === "Escape"/.test(js) &&
    /event\.key !== "Tab"/.test(js)
);

// Focus must never be invisible: the only permitted suppression is on the
// programmatic scroll/focus targets.
const outlineNone = [...css.matchAll(/outline:\s*none/g)].length;
check(
  "keyboard focus ring is defined and not suppressed (" + outlineNone + " exceptions)",
  /:focus-visible\s*\{/.test(css) && outlineNone <= 1,
  `${outlineNone} outline:none rules`
);

const skipLink = /<a class="skip-link" href="#([^"]+)"/.exec(html);
check(
  "skip link targets a real landmark and is revealed on focus",
  Boolean(skipLink) && htmlIds.has(skipLink[1]) && /\.skip-link:focus\s*\{/.test(css),
  skipLink ? skipLink[1] : "missing skip link"
);

check(
  "route changes can move focus to the page heading",
  /id="app-page-title"[^>]*tabindex="-1"/.test(html) &&
    /<main[^>]*id="page-main"[^>]*tabindex="-1"/.test(html)
);

// Inline validation errors are announced by screen readers.
const errorNodes = [...html.matchAll(/<p[^>]*class="error[^"]*"[^>]*>/g)];
const silentErrors = errorNodes.filter((match) => !/role="alert"/.test(match[0]));
check(
  `inline error regions are announced (${silentErrors.length} silent)`,
  silentErrors.length === 0,
  silentErrors
    .map((match) => (match[0].match(/id="([^"]+)"/) || [])[1] || match[0].slice(0, 30))
    .join(", ")
);

// Destructive actions outside the protected-action dialog must ask first.
const destructiveConfirms = [
  "Remove Donor",
  "Remove Document",
  "Remove Volunteer",
  "Remove Resource",
  "Remove Event",
  "Hide Reward Item",
  "Remove Staff Reminder",
];
const unconfirmed = destructiveConfirms.filter(
  (title) => !new RegExp(`title: "${title}"`).test(js)
);
check(
  `destructive actions ask for confirmation (${unconfirmed.length} unconfirmed)`,
  unconfirmed.length === 0,
  unconfirmed.join(", ")
);

// ---- 6. Documentation stays in step with the router and this suite ----
console.log("\nDocumentation");

const docNames = ["README.md", "PROJECT-DOCUMENTATION.md"];
const docs = docNames.map((name) => ({
  name,
  text: existsSync(join(ROOT, name)) ? read(name) : "",
}));

// Every "#/route" a document promises must exist in the router.
const unknownDocRoutes = new Set();
docs.forEach(({ text }) => {
  [...text.matchAll(/#\/([A-Za-z0-9_-]+)/g)].forEach((match) => {
    if (!knownRoutes.includes(match[1])) unknownDocRoutes.add(match[1]);
  });
});
check(
  `documented routes resolve to real views (${unknownDocRoutes.size} unknown)`,
  docs.every((doc) => doc.text.length > 0) && unknownDocRoutes.size === 0,
  [...unknownDocRoutes].join(", ")
);

// The retired navigation idiom must not come back into the documentation.
const retiredPhrases = ["Operations Menu", "page-guide", "All views are sections of one page"];
const staleDocHits = docs
  .filter((doc) => retiredPhrases.some((phrase) => doc.text.includes(phrase)))
  .map((doc) => doc.name);
check(
  "documentation drops the retired navigation idiom",
  staleDocHits.length === 0,
  staleDocHits.join(", ")
);

// The line counts quoted in the system overview must match the shipped files,
// so the document cannot quietly describe a smaller app than the one that exists.
const countedFiles = ["index.html", "styles.css", "app.js"];
const documentedLines = {};
const actualLines = {};
countedFiles.forEach((file) => {
  const quoted = read("PROJECT-DOCUMENTATION.md").match(
    new RegExp(`\`${file.replace(".", "\\.")}\` \\(([\\d,]+) lines\\)`)
  );
  documentedLines[file] = quoted ? Number(quoted[1].replace(/,/g, "")) : Number.NaN;
  actualLines[file] = (read(file).match(/\n/g) || []).length;
});
const lineDrift = countedFiles.filter((file) => documentedLines[file] !== actualLines[file]);
check(
  `documented line counts match the files (${lineDrift.length} drifted)`,
  lineDrift.length === 0,
  lineDrift.map((file) => `${file}: doc ${documentedLines[file]} vs file ${actualLines[file]}`).join(", ")
);

// This check runs last on purpose: it counts itself, so the total quoted in the
// documentation must match the suite exactly, and a new check cannot silently
// make the written evidence wrong.
const suiteTotal = checks + 1;
const documentedTotal = Number(
  (read("PROJECT-DOCUMENTATION.md").match(/(\d+) of (\d+) checks passed/) || [])[2]
);
const readmeTotal = Number((read("README.md").match(/(\d+) of (\d+) passing/) || [])[1]);
check(
  `documented check total matches this run (${suiteTotal})`,
  documentedTotal === suiteTotal && readmeTotal === suiteTotal,
  `documentation says ${documentedTotal || "nothing"}, README says ${readmeTotal || "nothing"}`
);

const passed = checks - failures - warnings;
console.log(
  `\n${passed}/${checks} checks passed` +
    (warnings ? `, ${warnings} accepted warning(s)` : "") +
    (failures ? `, ${failures} failure(s)` : "")
);
if (failures > 0) {
  process.exitCode = 1;
}
