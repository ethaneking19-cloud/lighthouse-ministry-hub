# Lighthouse Ministry Hub — Implementation Plan (App Shell Redesign)

Status: **planning only.** No application code has been changed. This document is the
deliverable for "Prompt 1 — Inspect the existing project" of the FreeBuff Build Plan.

Date: 2026-10-02
Baseline commit: `222ed44` (branch `main`, in sync with `origin/main`)

---

## 0. Safety checkpoint (done)

| Step | Result |
| --- | --- |
| GitHub backup | Working tree clean, `main` == `origin/main` at `222ed44`. Everything current is already on GitHub. |
| File backup | `Backups/lighthouse-ministry-hub-backup-2026-10-02-1502.zip` (6.5 MB) — full working tree, `Backups/` is gitignored. |
| Baseline checks | `node tests/static-checks.mjs` → **10/11 passed, 1 accepted warning, exit 0**. |

Recommended extra restore point before Phase 1: `git tag pre-redesign-2026-10-02`.

Untracked (left alone on purpose): `.freebuff/`, `github-project-setup.ps1`.

---

## 1. What the project actually is

A **static, no-build single-page app**: one HTML file, one stylesheet, one script, plus
vendored libraries. Netlify publishes the repo root directly (`netlify.toml`,
`publish = "."`, no build command).

| File | Lines | Role |
| --- | --- | --- |
| `index.html` | 865 | Login gate, sticky sidebar, hero, 13 top-level `<section>` cards, sensitive-confirmation modal, script tags |
| `styles.css` | 2,245 | All styling: `:root` tokens, `.page-layout` grid, `.page-guide` sidebar, cards, tables, 3 media queries |
| `app.js` | 5,911 | All logic: state, persistence, Supabase sync, 143 top-level functions (25 `render*`), all event wiring |
| `xlsx.full.min.js`, `mammoth.browser.min.js` | vendored | Excel export, DOCX import |
| `sample-data/` | — | Deterministic fictional demo roster + generator |

**No framework, no bundler, no router, no component system.** Everything is imperative DOM.

---

## 2. Data model & persistence (must not change in this redesign)

Single `state` object. Source of truth is `localStorage[ministryPointsStateV1]`, mirrored to
Supabase when configured.

Collections: `people, visits, activity, adminLog, items, customItems, hiddenItems,
customTasks, hiddenTasks, volunteers, donors, documents, events, resources,
staffTodosGlobal, settings, staffUsers`.

Key rules that the redesign must protect:
- **Ledger invariant:** a member's `points` must equal the sum of that member's
  `activity[].delta`. `adjustPoints()` (app.js:1579) is the only sanctioned mutation path.
- Every point change records `before`/`after` and lands in `activity` and/or `adminLog`.
- `saveState()` → `localStorage` + debounced remote save (`queueRemoteStateSave`, 900 ms).
- Safety backups: max 3, in `localStorage[ministrySafetyBackupsV1]`.
- Two auth modes: **Supabase** (deployed) and **local password** (localhost/file only).

Nothing in the planned redesign touches these. It is a presentation-layer change.

---

## 3. How navigation works today (the thing being replaced)

- `index.html:34–56` — `<aside class="page-guide">` with **13 anchor links** (`#section-id`).
- `styles.css:176–181` — `.page-layout` is a 2-column grid: `320px` sidebar + main.
- `app.js:1633–1702` — `attachPageGuideSpy()` runs a **scroll spy**: on scroll/resize it
  picks the section nearest a top anchor line, toggles `.is-active`, and proportionally
  scrolls the sidebar to match page scroll.
- At ≤1180px (`styles.css:2015–2020`) the sidebar becomes `position: static` and is
  **reordered below** the main content; at ≤560px its nav becomes a single column.

So: the sidebar is a table of contents, not real navigation. There are **no routes, no
`hashchange` listener, and no page visibility concept.** All 13 sections are always in the
DOM and `renderAll()` (app.js:1600) re-renders every one of them on every change.

---

## 4. Feature inventory → target page mapping

| Current `<section>` (index.html) | Renders via | Target page |
| --- | --- | --- |
| `#quick-actions-card` (:99) | static markup + `#quick-backup`, `#quick-report` | Dashboard |
| `#staff-dashboard-card` (:127) — contains `#calendar-card` + `#staff-task-board` | `renderDashboardAlerts`, `renderCalendar`, `renderStaffTaskBoard`, `renderEvents` | Dashboard (alerts) + Calendar & Tasks |
| `#summary-card` (:397) | `renderSummary` | Dashboard + Reports |
| `#add-member-card` (:282) | `person-form` submit | Members |
| `#members-card` (:370) | `renderPeople`, `renderInactiveMembers` | Members |
| *(new)* member profile | *(new `renderMemberProfile`)* | `#/members/:memberId` |
| `#member-checkin-card` (:261) | `renderCheckin`, `logVisit` | Check-In |
| `#task-award-card` (:200) | `renderItems`/`hydrateTasks`, `adjustPoints` | Points & Rewards |
| `#redeem-card` (:183) | `renderRedeemPoints`, `updateRedeemTotal` | Points & Rewards |
| `#resources-card` (:568) | `renderResources` | Resources |
| `#items-card` (:633) | `renderItems` | Admin |
| `#corrections-card` (:668) | `adjustPoints`, undo | Admin |
| `#staff-logs` (:700) — nested: `#admin-log`, `#staff-users-card`, `#settings-card` | `renderActivity`, `renderAdminLog`, `renderStaffUsers`, `renderSettings`, backup tools | Admin |
| `#admin-records-card` (:418) — nested: volunteers, documents, donors | `renderVolunteers`, `renderDocuments`, `renderDonors` | Admin (or Reports for docs) |

Every one of these has an entry in the `elements` map (app.js:339–490) built with
`document.querySelector("#id")`. **That map is the contract the redesign must not break.**

---

## 5. Key architectural decision (risk mitigation)

> **Keep all sections in the DOM. Do not unmount, do not regenerate markup, do not delete IDs.**

Phase 1 wraps the existing `<section>` elements in page containers:

```html
<main class="app-main">
  <div class="app-page" data-page="dashboard">  …existing sections… </div>
  <div class="app-page" data-page="members" hidden> … </div>
  …
</main>
```

Page switching = toggling `hidden` on `.app-page` (plus `aria-hidden`), exactly like the
existing login gate already does (`updateLoginGate`, app.js:4237). Because every element
stays in the document:

- `elements.*` lookups keep working, unchanged.
- All 143 functions and every event binding keep working.
- `renderAll()` keeps working — it renders hidden pages harmlessly.
- Print windows are unaffected (they use `window.open()` with their own HTML — app.js:5199+).

This is why the redesign can be incremental instead of a rewrite.

---

## 6. Risks & mitigations

| # | Risk | Why | Mitigation |
| --- | --- | --- | --- |
| R1 | `renderAll()` overwrites DOM every change | It re-renders all 25 areas globally | Never remove sections from DOM (Section 5). Verified safe with hidden containers. |
| R2 | Anchor links break once sections live on hidden pages | 22 `href="#…"` links exist; 13 in sidebar, 5 hero, 3 quick-actions, 1 in check-in card | Convert all 22 to route links (`#/rewards`, `#/members`…). Audit with the existing static check that validates anchors — update it to validate routes too. |
| R3 | Scroll-spy code becomes dead/wrong | `attachPageGuideSpy`, `updatePageGuideHighlight`, `syncPageGuideScroll`, `queuePageGuideUpdate` assume one long page | Phase 1 replaces them with a route-based active-state function; keep the functions but repoint them (or retire them). Requires a `hashchange` + `load` router. |
| R4 | Refresh must land on the right page | No router exists today | Router reads `location.hash` on load, defaults to `#/dashboard`, validates against a known route list, falls back safely. |
| R5 | Route must not leak into shared state | Supabase state is shared across staff (last-write-wins) | Never persist the current route in `state`; URL hash only. |
| R6 | Login gate ordering | `.page` is `hidden` until `staffMode`; `renderAll()` runs at boot before sign-in | Router must apply the route after the gate resolves and re-apply on route change; deep links like `#/members/abc` must survive sign-in. |
| R7 | Mobile drawer vs existing ≤1180px reorder | Sidebar currently reflows below content rather than overlaying | Replace the reorder rule with a real off-canvas drawer scoped to the new shell only; keep login gate + modal untouched. |
| R8 | Design tokens collide with existing look | Current theme is warm/gradient/heavy-radius; target is calm navy/teal | Introduce new tokens in **Phase 1 alongside** old ones, migrate component-by-component. Never delete an old token until nothing references it. |
| R9 | Mobile tables | Many `.table__row` grids collapse to 1 column at ≤900px already | Extend rather than rewrite; add card-style rows for the new Reports/Admin tables. |
| R10 | Demo-data integrity | 26 members / 88 visits / 261 activity entries validated | Redesign is presentation-only; ledger check is part of Phase QA. Never `localStorage.clear()`. |
| R11 | Accepted warning `#event-list` | app.js:463 references an id not in HTML (inert) | Leave as-is; keep it in `KNOWN_ISSUES` in `tests/static-checks.mjs`. |
| R12 | Rebranding leftovers | `Studio 45` option (index.html:311), "Jackson Community Resource List" print title (app.js:5297), 6 real Jackson TN orgs in `DEFAULT_RESOURCES` (app.js:148), possibly a church photo in `lighthouse-banner.png` | Fold into Phase 8 polish; the static check already blocks the old org name. |

---

## 7. Target route map

```
#/dashboard            default; falls back here on unknown routes
#/members
#/members/:memberId
#/check-in
#/rewards
#/calendar
#/resources
#/reports
#/admin
```

Sidebar: Dashboard · Members · Check-In · Points & Rewards · Calendar & Tasks ·
Resources · Reports · Admin.

---

## 8. Phased plan

Each phase is small, testable, reversible, and ends with a written report:
**files changed · what was tested · what works · what's still open.**

Every phase carries the standing instruction:

> Do not remove working features, replace functioning code with placeholders, or wipe
> existing demo data. Reuse the existing project structure, components, state, storage, and
> working interactions wherever feasible. Make changes in small, testable increments. Keep
> the project deployable on Netlify.

### Phase 1 — App shell, routing, navigation
- Add the shell: `.app-shell` / `.app-sidebar` / `.app-topbar` / `.app-main`, mobile
  drawer + hamburger, and `.app-page` containers (Section 5).
- Reuse the existing sidebar content and the `page-guide__link` styling as the starting
  point rather than restyling from scratch.
- Add a ~60-line hash router in `app.js`: known routes, `load` + `hashchange`, default
  `#/dashboard`, `/members/:id` parsing, `aria-current` on the active link, focus
  management on route change, and no persistence to `state`.
- Convert the 22 anchor links to routes; retire the scroll spy.
- Move `#calendar-card` and `#staff-task-board` markup into the Calendar page (IDs intact,
  so no JS changes needed).
- **Acceptance:** every route loads on refresh; back/forward work; all existing buttons
  still do what they did; login gate unaffected; no console errors; static checks green.

### Phase 2 — Design tokens & shared components (CSS only)
- Add the target token set (`--background/--surface/--border/--primary/--accent/--success/
  --warning/--danger/--text/--text-muted`), the 4/8/12/16/24/32 spacing scale, and a
  sans-serif stack (system-ui first; no external font fetch required to stay Netlify-safe).
- Build shared component classes: `PageHeader`, `StatCard`, `Card`, `DataTable`,
  `StatusBadge`, `EmptyState`, `Toast`, `ConfirmDialog`, `Tabs`, `FormField`.
- Migrate `.card`, `.btn`, `.table__row`, `.person` incrementally; verify each migration
  visually at 375 / 768 / 1440 px.
- **Acceptance:** no visual regressions in any workflow; old tokens still resolve.

### Phase 3 — Dashboard
- Stat cards: members served today, check-ins this week, redemptions this week, follow-ups
  due. Reuse `getTodayVisits()`, `renderSummary()`'s week window, and
  `getInactiveMembers(30)` / `people[].followUpNeeded`.
- Quick actions wired to real existing flows (New Member, Check In, Award Points,
  Redeem Items) — no dead buttons.
- Follow-up queue, upcoming events (`getUpcomingEvents`), recent activity capped at ~8
  entries with a "View full activity" link to `#/admin`.
- Empty states for each block.
- **Acceptance:** numbers match the underlying data; every action reaches a working flow.

### Phase 4 — Members directory & member profile
- Directory: reuse `#member-search`, `#member-tag-filter`, `#member-sort`; add member
  count, clear-filters, empty/no-results states; stacked cards under ~760px.
- **New** `#/members/:memberId` view plus `renderMemberProfile(id)` reading existing data:
  `getVisitEntriesForPerson()` (app.js:1748), `state.activity` filtered by `personId`,
  `person.points`, `followUpNeeded`, `staffTodos`.
- Tabs/sections: Overview · Visits · Point History · Redemptions · Staff Notes.
  Point history must show date, type, reason, ±amount, actor, and resulting balance.
- Primary actions (Check In, Award Points, Redeem Items, Edit Profile) route into the
  existing flows with the member pre-selected.
- **Acceptance:** deep link to a profile survives refresh and sign-in; ledger view matches
  `state.activity` exactly.

### Phase 5 — Check-In workflow
- Rework `#/check-in` around a prominent search → compact member summary → optional note →
  optional follow-up flag → confirm.
- Reuse `logVisit()` (app.js:1704); add a confirmation summary, duplicate-submit guard, and
  success state with "Open profile" / "Check in another".
- **Acceptance:** no change to visit/activity records beyond what `logVisit` already wrote.

### Phase 6 — Points & Rewards
- **Award Points:** member select + current balance + reason/task + amount + projected
  balance + confirm. Reuses `adjustPoints()`; nothing silent.
- **Redeem:** member + balance + searchable catalog + cart (`getRedeemSelections`,
  `updateRedeemTotal` already model this) + total + projected remaining + insufficient
  warning + confirm + success toast.
- **Transaction history:** surface the existing `activity` rows (additions, deductions,
  redemptions, corrections) with balance-after.
- **Acceptance:** ledger invariant still holds after every flow; 0 mismatches in static checks.

### Phase 7 — Calendar & Tasks · Resources · Reports · Admin
- Calendar: today/upcoming/all views over `renderCalendar`/`renderEvents`; keep event
  create/edit.
- Tasks: status, due date, completion toggle over `renderStaffTaskBoard`.
- Resources: category grouping + search over `renderResources`; tap-friendly phone/links.
- Reports: date range + type over existing data (check-ins, activity, awards, deductions,
  redemptions, follow-ups); summary cards + readable tables; reuse `print-report` /
  `export-logs`; state plainly that figures come from demo/local data.
- Admin: group staff accounts, item config, corrections, audit log, backup/export,
  restore/import, settings; visually separate destructive actions; confirmations.
- **Acceptance:** no fabricated charts; every report matches a real computation.

### Phase 8 — Safety, polish, accessibility, responsive QA
- Confirmations for destructive/point-changing actions; inline validation; disabled
  submit states; toasts; loading/empty/error states; visible focus rings; labelled
  icon-only controls; Escape-to-close + focus trap on the modal; non-color status cues;
  console cleanup; rebranding leftovers (R12).
- Full workflow test pass at 320 / 375 / 768 / 1024 / 1440 px.
- **Acceptance:** `node tests/static-checks.mjs` green (0 failures), then the FreeBuff
  final testing prompt's checklist.

### Future (not now) — production backend plan
Plan only, no code: staff auth, roles, server-side DB, RLS, audit logging, encrypted
backups, migration from local/demo data, testing, risks, phases. Supabase is already wired
(staff accounts + `ministry_app_state`), so this is an extension, not a rewrite.

---

## 9. Guardrails for every phase

1. Never delete or overwrite `localStorage`; never `localStorage.clear()`.
2. Never remove a working feature to simplify layout.
3. All 148 element IDs referenced by `app.js` must keep existing.
4. `points` must equal the sum of `activity[].delta` — enforce with static checks.
5. Confirm before: deleting records, deducting/correcting points, finalizing redemption,
   undo, restore/import, removing staff, deactivating items.
6. `node tests/static-checks.mjs` must stay green; extend it as routes and new components land.
7. Netlify-deployable at every commit (no build step introduced).
8. Rebranding guard: the old organization name must never reappear.

## 10. Open decisions for the user

- Keep the warm/gradient aesthetic as an accent, or fully adopt the calm navy/teal palette?
- Should `lighthouse-banner.png` stay, be replaced with a neutral image, or be dropped for a
  flat hero?
- Are Admin Records (volunteers / documents / donors) best under **Admin** or **Reports**?
