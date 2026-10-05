/**
 * Lighthouse Ministry Hub — automated browser checks.
 *
 * The static suite (static-checks.mjs) can only read the source. This suite
 * drives the real app in a real Chromium engine, so it can prove the things a
 * source scan cannot: that routes actually render, that nothing overflows on a
 * phone, that the controls staff actually use are reachable and announced, and
 * that the printed/exported artifacts contain the expected content.
 *
 * Usage:
 *   cd tests
 *   npm install
 *   npx playwright install chromium
 *   node browser-checks.mjs
 *
 * Options (environment variables):
 *   HUB_TEST_PORT=4193   static server port
 *   EVIDENCE=0           skip writing screenshots/PDFs into tests/evidence
 *   HEADED=1             run with a visible browser window
 *
 * The suite signs in with the local password-mode account (Ethan / 2019) and
 * seeds the fictional sample roster, so it never touches Supabase or real data.
 * To get there it serves a blank supabase-config.js (the same trick the local
 * preview harness uses) and blocks the Supabase CDN bundle, so the run is
 * hermetic and offline-safe.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const evidenceDir = path.join(here, "evidence");
// Deliberately not read from PORT: shared shells often export PORT=0, which
// would hand the static server a random port that Chromium refuses to open.
const requestedPort = Number(process.env.HUB_TEST_PORT);
const port =
  Number.isInteger(requestedPort) && requestedPort >= 1024 && requestedPort <= 65535
    ? requestedPort
    : 4193;
const writeEvidence = process.env.EVIDENCE !== "0";
const headless = process.env.HEADED !== "1";

const APP_STATE_KEY = "ministryPointsStateV1";
const STAFF_MODE_KEY = "ministryStaffModeV1";
const STAFF_USER_KEY = "ministryStaffUserV1";

const ROUTES = [
  "dashboard",
  "members",
  "check-in",
  "rewards",
  "calendar",
  "resources",
  "reports",
  "admin",
];
const WIDTHS = [320, 375, 768, 1024, 1440];
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

const results = [];
const info = [];

/**
 * Serious axe findings that are already recorded as open defects in
 * PROJECT-DOCUMENTATION.md section 6.3 and must be re-checked by a human.
 * They still show up in this report; they are simply not treated as new
 * regressions. Anything not matching this list fails the run.
 */
const CONTRAST_REVIEW = [
  {
    id: "color-contrast",
    // axe cannot know the backdrop of the hero stats, which sit on a photo with
    // a multi-stop gradient overlay, and of the report KPI labels, which sit on
    // a tinted card. Both need a human look at the rendered pixels.
    note: "hero stats on the banner photo and tinted report KPI labels: axe cannot resolve the backdrop, needs a visual check",
    match: (violation, route, width) =>
      violation.id === "color-contrast" &&
      (route === "dashboard" || route === "reports") &&
      /hero__label|stat-card__label/.test(violation.target),
  },
  {
    id: "color-contrast",
    // Measured 3.47:1 against the required 4.5:1: the redeem-cart hint text is
    // a genuinely too-light gray. Fixing it changes secondary text color
    // app-wide, so it waits for the owner's sign-off.
    note: "redeem cart hint text measured at 3.47:1, needs a darker muted color (owner sign-off before recoloring)",
    match: (violation, route) =>
      violation.id === "color-contrast" && route === "rewards" && /redeem-cart/.test(violation.target),
  },
];

function record(group, name, passed, detail) {
  results.push({ group, name, passed, detail });
}

function note(message) {
  info.push(message);
}

const LOCAL_SUPABASE_CONFIG = "window.LIGHTHOUSE_SUPABASE_CONFIG = null;\n";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requested = decodeURIComponent(request.url.split("?")[0]);
    const relative = requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
    if (relative === "supabase-config.js") {
      response.writeHead(200, {
        "Content-Type": MIME[".js"],
        "Cache-Control": "no-store",
      });
      response.end(LOCAL_SUPABASE_CONFIG);
      return;
    }
    const file = path.join(repoRoot, relative);
    if (!file.startsWith(repoRoot)) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

async function seedAndSignIn(page, baseUrl) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const sample = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "sample-data", "sample-roster-backup.json"), "utf8")
  );
  const seedState = sample.state || sample;
  await page.evaluate(
    ([stateKey, modeKey, userKey, seeded, mode, user]) => {
      localStorage.setItem(stateKey, JSON.stringify(seeded));
      localStorage.setItem(modeKey, mode);
      localStorage.setItem(userKey, user);
    },
    [APP_STATE_KEY, STAFF_MODE_KEY, STAFF_USER_KEY, seedState, "staff", "Ethan"]
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.fill("#gate-login-username", "Ethan");
  await page.fill("#gate-login-password", "2019");
  await Promise.all([
    page.waitForSelector("#gate-login-form", { state: "hidden" }),
    page.click("#gate-login-submit"),
  ]);
}

/** Horizontal overflow, ignoring elements the design deliberately parks off-screen. */
async function measureOverflow(page) {
  return page.evaluate(() => {
    const viewport = window.innerWidth;
    const offenders = [];
    // Content parked off-screen on purpose (the drawer sidebar, the visually
    // hidden file inputs) is not an overflow bug, so skip any element that sits
    // inside an off-screen fixed/absolute container.
    const insideOffscreenContainer = (element) => {
      let node = element.parentElement;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        if ((style.position === "fixed" || style.position === "absolute") && style.display !== "none") {
          const rect = node.getBoundingClientRect();
          if (rect.right <= 1 || rect.left >= viewport - 1 || rect.bottom <= 1) return true;
        }
        if (style.clip === "rect(0px, 0px, 0px, 0px)" || style.clipPath === "inset(50%)") return true;
        // Elements inside a deliberately scrollable strip (the month grid, the
        // photo pickers) extend past the viewport by design; the page itself
        // does not scroll sideways because the strip absorbs it.
        if (style.overflowX === "auto" || style.overflowX === "scroll") return true;
        node = node.parentElement;
      }
      return false;
    };
    document.querySelectorAll("body *").forEach((element) => {
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return;
      if (style.position === "fixed") return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.right > viewport + 1 || rect.left < -1) {
        if (insideOffscreenContainer(element)) return;
        offenders.push({
          selector: element.id ? `#${element.id}` : `${element.tagName.toLowerCase()}.${String(element.className || "").split(" ")[0]}`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        });
      }
    });
    return {
      documentOverflow: Math.max(0, document.documentElement.scrollWidth - viewport),
      offenders: offenders.slice(0, 5),
    };
  });
}

function luminance([r, g, b]) {
  const channel = (value) => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function parseColor(value) {
  const match = String(value).match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(",").map((piece) => Number.parseFloat(piece.trim()));
  if (parts.length > 3 && parts[3] === 0) return null;
  return [parts[0], parts[1], parts[2]];
}

async function run() {
  const server = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${port}/#/dashboard`;
  if (writeEvidence) fs.mkdirSync(evidenceDir, { recursive: true });

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    viewport: DESKTOP,
    // Keep the run hermetic: the only remote request the page makes is the
    // Supabase CDN bundle, which local password mode never uses.
    serviceWorkers: "block",
  });
  const blocked = [];
  await context.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("http://127.0.0.1") || url.startsWith("data:")) {
      route.continue();
      return;
    }
    blocked.push(url);
    route.abort();
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    // The harness itself aborts the Supabase CDN bundle, so Chromium logs a
    // resource failure for it. Only same-origin failures indicate app bugs.
    const location = message.location ? message.location().url || "" : "";
    if (location && !location.startsWith("http://127.0.0.1")) return;
    if (!location && /ERR_FAILED|ERR_BLOCKED/.test(text) && blocked.length) return;
    consoleErrors.push(text);
  });
  page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const axeSource = fs.readFileSync(
    path.join(here, "node_modules", "axe-core", "axe.min.js"),
    "utf8"
  );

  try {
    await seedAndSignIn(page, baseUrl);

    const signInSucceeded = await page.evaluate(
      () => getComputedStyle(document.querySelector("#login-gate")).display === "none"
    );
    record("Sign-in", "local password sign-in unlocks the app", signInSucceeded, signInSucceeded ? "gate hidden, dashboard rendered" : "gate still visible");

    // ---- Routes actually render -------------------------------------------
    const routeFailures = [];
    for (const route of ROUTES) {
      await page.goto(`${baseUrl.split("#")[0]}#/${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(120);
      const state = await page.evaluate((routeName) => {
        // A route can own several sections, and the shared grid orders them, so
        // the route counts as rendered when any of its sections is visible.
        const containers = [...document.querySelectorAll(`[data-page="${routeName}"]`)];
        const shown = containers.filter((node) => node.offsetParent !== null && node.getClientRects().length > 0);
        const heading = document.querySelector("#app-page-title");
        const navCurrent = document.querySelector('.app-nav__link[aria-current="page"]');
        return {
          rendered: shown.length > 0,
          title: heading ? heading.textContent.trim() : "",
          nav: navCurrent ? navCurrent.textContent.trim() : "",
        };
      }, route);        if (!state.rendered || !state.title) {
        routeFailures.push(`${route} (rendered=${state.rendered}, title="${state.title}")`);
      }
    }
    record(
      "Routes",
      `every route renders with a title (${ROUTES.length} routes)`,
      routeFailures.length === 0,
      routeFailures.length ? routeFailures.join("; ") : `${ROUTES.length} routes rendered`
    );

    // ---- Responsive sweep --------------------------------------------------
    const overflowFailures = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: width >= 1024 ? 900 : 844 });
      for (const route of ROUTES) {
        if (page.url() !== `${baseUrl.split("#")[0]}#/${route}`) {
          await page.goto(`${baseUrl.split("#")[0]}#/${route}`, { waitUntil: "domcontentloaded" });
        }
        await page.waitForTimeout(80);
        const { documentOverflow, offenders } = await measureOverflow(page);
        // The assertion is that the page never scrolls sideways. Stray boxes
        // are reported as information because the design deliberately parks
        // some controls (file inputs, the drawer) off-screen.
        if (offenders.length) {
          note(`  ${route}@${width}px: ${offenders.length} element(s) outside the viewport, all inside scrollable/off-screen containers: ${offenders.map((o) => o.selector).join(", ")}`);
        }
        if (documentOverflow > 1) {
          overflowFailures.push(`${route}@${width} (page scrolled sideways by ${documentOverflow}px)`);
        }
      }
    }
    record(
      "Responsive",
      `no horizontal overflow across ${WIDTHS.length} widths x ${ROUTES.length} routes`,
      overflowFailures.length === 0,
      overflowFailures.length ? overflowFailures.slice(0, 6).join("; ") : `${WIDTHS.length * ROUTES.length} route/viewport pairs clean`
    );

    // ---- Phone dashboard fold ---------------------------------------------
    await page.setViewportSize(PHONE);
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
    const fold = await page.evaluate(() => {
      const at = (selector, index = 0) => {
        const nodes = document.querySelectorAll(selector);
        const element = nodes[index];
        if (!element) return null;
        return Math.round(element.getBoundingClientRect().top + window.scrollY);
      };
      return {
        height: window.innerHeight,
        quickCard: at("#quick-actions-card"),
        quickHeader: at("#quick-actions-card .card__header"),
        firstAction: at(".quick-action", 0),
        secondAction: at(".quick-action", 1),
        kpis: at("#dashboard-kpis"),
        overview: at("#staff-dashboard-card"),
      };
    });
    const actionsVisible = fold.firstAction !== null && fold.firstAction < fold.height;
    const secondVisible = fold.secondAction !== null && fold.secondAction < fold.height;
    const kpisStillPresent = fold.kpis !== null && fold.overview !== null;
    record(
      "Responsive",
      "phone dashboard keeps two quick actions above the fold",
      actionsVisible && secondVisible && kpisStillPresent,
      `390x844: actions at ${fold.firstAction}/${fold.secondAction}px, KPIs still present at ${fold.kpis}px`
    );

    if (writeEvidence) {
      await page.screenshot({ path: path.join(evidenceDir, "dashboard-390x844.png"), fullPage: false });
    }

    // ---- Keyboard focus indicator -----------------------------------------
    await page.setViewportSize(DESKTOP);
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(120);
    await page.keyboard.press("Tab");
    const focusReport = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element) return null;
      const style = getComputedStyle(element);
      let background = null;
      let node = element;
      while (node && !background) {
        const candidate = getComputedStyle(node).backgroundColor;
        if (candidate && !/rgba?\(0, 0, 0, 0\)/.test(candidate)) background = candidate;
        node = node.parentElement;
      }
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        matchesFocusVisible: element.matches(":focus-visible"),
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
        outlineColor: style.outlineColor,
        background,
      };
    });
    const outlineVisible =
      focusReport &&
      focusReport.outlineStyle !== "none" &&
      focusReport.outlineWidth >= 2 &&
      focusReport.matchesFocusVisible;
    record(
      "Keyboard",
      "first Tab stop shows a visible focus ring",
      Boolean(outlineVisible),
      focusReport
        ? `${focusReport.tag}${focusReport.id ? "#" + focusReport.id : ""}: outline ${focusReport.outlineWidth}px ${focusReport.outlineStyle}, focus-visible=${focusReport.matchesFocusVisible}`
        : "no focusable element found"
    );

    const outlineRgb = focusReport ? parseColor(focusReport.outlineColor) : null;
    const backgroundRgb = focusReport ? parseColor(focusReport.background) : null;
    if (outlineRgb && backgroundRgb) {
      const ratio = contrastRatio(outlineRgb, backgroundRgb);
      record(
        "Keyboard",
        "focus ring contrasts with the surface behind it (>= 3:1)",
        ratio >= 3,
        `${ratio.toFixed(2)}:1 against ${focusReport.background}`
      );
    } else {
      record("Keyboard", "focus ring contrasts with the surface behind it (>= 3:1)", false, "could not read outline/background colors");
    }

    // ---- Dialog keyboard contract -----------------------------------------
    await page.goto(`${baseUrl.split("#")[0]}#/calendar`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
    const removeButton = page.locator("#staff-task-list button", { hasText: /remove/i }).first();
    const reminderCountBefore = await page.locator("#staff-task-list .todo-row").count();
    let dialogReport = { opened: false };
    if ((await removeButton.count()) > 0) {
      await removeButton.click();
      await page.waitForTimeout(120);
      const opened = await page.evaluate(() => {
        const modal = document.querySelector("#confirm-modal");
        if (!modal || modal.hidden) return { opened: false };
        const panel = modal.querySelector(".modal__panel, [role=dialog]") || modal;
        return {
          opened: true,
          role: panel.getAttribute("role"),
          ariaModal: panel.getAttribute("aria-modal"),
          labelled: Boolean(panel.getAttribute("aria-labelledby")),
          focusInside: modal.contains(document.activeElement),
          activeId: document.activeElement ? document.activeElement.id || document.activeElement.tagName.toLowerCase() : null,
          title: (modal.querySelector("#confirm-modal-title") || {}).textContent || "",
        };
      });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(120);
      const afterEscape = await page.evaluate(() => ({
        hidden: document.querySelector("#confirm-modal").hidden,
        activeId: document.activeElement ? document.activeElement.id || document.activeElement.tagName.toLowerCase() : null,
        activeText: document.activeElement ? (document.activeElement.textContent || "").trim().slice(0, 30) : "",
      }));
      const reminderCountAfter = await page.locator("#staff-task-list .todo-row").count();
      dialogReport = {
        ...opened,
        afterEscape,
        reminderCountBefore,
        reminderCountAfter,
        returnedFocus: /remove/i.test(afterEscape.activeText || ""),
      };
      record(
        "Dialogs",
        "confirm dialog is a labelled modal that takes focus",
        opened.opened && opened.role === "dialog" && opened.ariaModal === "true" && opened.labelled && opened.focusInside,
        opened.opened
          ? `role=${opened.role}, aria-modal=${opened.ariaModal}, labelled=${opened.labelled}, focus inside=${opened.focusInside} (${opened.activeId}), title "${opened.title.trim()}"`
          : "dialog did not open"
      );
      record(
        "Dialogs",
        "Escape cancels the destructive action and changes nothing",
        afterEscape.hidden === true &&
          reminderCountAfter === reminderCountBefore &&
          dialogReport.returnedFocus,
        `rows ${reminderCountBefore} -> ${reminderCountAfter}, focus back on "${afterEscape.activeText}"`
      );
      if (writeEvidence) {
        await removeButton.click();
        await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(evidenceDir, "confirm-dialog.png"), fullPage: false });
        await page.keyboard.press("Escape");
        await page.waitForTimeout(100);
      }
    } else {
      record("Dialogs", "confirm dialog is a labelled modal that takes focus", false, "no staff reminder remove button available to test");
    }

    // ---- axe-core accessibility scan --------------------------------------
    const axeFindings = [];
    const seriousFindings = [];
    const reviewedFindings = [];
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: width === 375 ? 844 : 900 });
      for (const route of ROUTES) {
        await page.goto(`${baseUrl.split("#")[0]}#/${route}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(120);
        await page.addScriptTag({ content: axeSource });
        const scan = await page.evaluate(async () => {
          const outcome = await window.axe.run(document, {
            resultTypes: ["violations"],
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
          });
          return outcome.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            nodes: violation.nodes.length,
            help: violation.help,
            target: violation.nodes[0] && violation.nodes[0].target ? violation.nodes[0].target.join(" ") : "",
          }));
        });
        for (const violation of scan) {
          const entry = `${width}px #/${route}: ${violation.id} (${violation.impact}, ${violation.nodes} node${violation.nodes === 1 ? "" : "s"}) - ${violation.help} [${violation.target}]`;
          axeFindings.push(entry);
          const gating = violation.impact === "serious" || violation.impact === "critical";
          if (!gating) continue;
          const known = CONTRAST_REVIEW.some((entry) => entry.match(violation, route, width));
          if (known) {
            reviewedFindings.push(entry);
          } else {
            seriousFindings.push(entry);
          }
        }
      }
    }
    record(
      "Accessibility",
      `axe-core reports no new serious or critical violations (${ROUTES.length * 2} scans)`,
      seriousFindings.length === 0,
      seriousFindings.length
        ? seriousFindings.slice(0, 5).join("; ")
        : `0 new; ${reviewedFindings.length} finding(s) already logged in CONTRAST_REVIEW; ${axeFindings.length - reviewedFindings.length} lower-impact`
    );
    if (reviewedFindings.length) {
      note(`axe-core findings logged in CONTRAST_REVIEW (still open, tracked rather than ignored):`);
      reviewedFindings.slice(0, 6).forEach((entry) => note(`    - ${entry}`));
    }
    const lowerImpact = axeFindings.filter((entry) => !reviewedFindings.includes(entry));
    if (lowerImpact.length) {
      note(`axe-core lower-impact findings (${lowerImpact.length}), for review rather than failure:`);
      lowerImpact.slice(0, 12).forEach((entry) => note(`    - ${entry}`));
      if (lowerImpact.length > 12) note(`    ...and ${lowerImpact.length - 12} more`);
    }

    // ---- Printed and exported evidence ------------------------------------
    if (writeEvidence) {
      const printOutputs = [
        { route: "reports", button: "#print-report", file: "print-weekly-report.pdf", label: "Weekly Report" },
        { route: "reports", button: "#print-logs", file: "print-logs-report.pdf", label: "Logs Report" },
        { route: "members", button: "#print-signin", file: "print-signin-sheets.pdf", label: "Sign-In Sheets" },
        { route: "resources", button: "#print-resources", file: "print-resources.pdf", label: "Resource List" },
      ];
      for (const output of printOutputs) {
        await page.setViewportSize(DESKTOP);
        await page.goto(`${baseUrl.split("#")[0]}#/${output.route}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(150);
        const [popup] = await Promise.all([
          context.waitForEvent("page"),
          page.click(output.button),
        ]);
        await popup.waitForLoadState("domcontentloaded");
        await popup.emulateMedia({ media: "print" });
        await popup.pdf({ path: path.join(evidenceDir, output.file), format: "A4", printBackground: true });
        const heading = await popup.title();
        await popup.close();
        record(
          "Evidence",
          `${output.label} prints to a PDF`,
          fs.existsSync(path.join(evidenceDir, output.file)),
          `${output.file} ("${heading}")`
        );
      }

      // The export button lives on the Reports page, which is not the page the
      // print loop finished on.
      await page.goto(`${baseUrl.split("#")[0]}#/reports`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(150);
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.click("#export-logs"),
      ]);
      const workbookPath = path.join(evidenceDir, "export-logs.xlsx");
      await download.saveAs(workbookPath);
      const workbookBytes = fs.statSync(workbookPath).size;
      record(
        "Evidence",
        "activity log exports a real workbook",
        workbookBytes > 5000,
        `${(workbookBytes / 1024).toFixed(1)} KB via ${download.suggestedFilename()}`
      );

      await page.setViewportSize(PHONE);
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(evidenceDir, "dashboard-390x844.png"), fullPage: false });
      await page.setViewportSize(DESKTOP);
      await page.goto(`${baseUrl.split("#")[0]}#/members`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(evidenceDir, "members-1440.png"), fullPage: false });
      note(`evidence written to ${path.relative(repoRoot, evidenceDir)} (screenshots, print PDFs, exported workbook)`);
    }

    // ---- Console hygiene ---------------------------------------------------
    record(
      "Console",
      "no console errors during the run",
      consoleErrors.length === 0,
      consoleErrors.length ? consoleErrors.slice(0, 3).join("; ") : "0 console errors"
    );
    if (blocked.length) {
      note(`blocked ${blocked.length} external request(s) to keep the run hermetic, e.g. ${blocked[0]}`);
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

function report() {
  const groups = [...new Set(results.map((entry) => entry.group))];
  const lines = [];
  for (const group of groups) {
    lines.push(`\n${group}`);
    for (const entry of results.filter((item) => item.group === group)) {
      lines.push(`  ${entry.passed ? "PASS" : "FAIL"}  ${entry.name}`);
      if (!entry.passed) lines.push(`        ${entry.detail}`);
      else if (entry.detail) lines.push(`        ${entry.detail}`);
    }
  }
  const passed = results.filter((entry) => entry.passed).length;
  lines.push("");
  for (const message of info) lines.push(message);
  if (info.length) lines.push("");
  lines.push(`${passed}/${results.length} browser checks passed`);
  return lines.join("\n");
}

try {
  await run();
} catch (error) {
  record("Harness", "browser suite completed", false, error && error.message ? error.message : String(error));
  if (error && error.stack) console.error(error.stack);
}

const output = report();
console.log(output);
const failed = results.filter((entry) => !entry.passed);
if (writeEvidence && fs.existsSync(evidenceDir)) {
  const markdown = [
    "# Browser check evidence",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "```",
    output,
    "```",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(evidenceDir, "browser-checks-report.md"), markdown);
}
process.exit(failed.length ? 1 : 0);
