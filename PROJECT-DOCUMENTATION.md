# Lighthouse Ministry Hub — Senior Project Documentation

**Student:** Ethan King
**Project:** Lighthouse Ministry Hub: A Web-Based Ministry Operations and Member-Care Management System
**Repository:** https://github.com/ethaneking19-cloud/lighthouse-ministry-hub
**Document status:** Maintained through the Fall 2026 milestone schedule
**Last updated:** October 2, 2026 — describes the redesigned operations-console interface and the accessibility work

This document describes the purpose, design, workflows, testing evidence, deployment, privacy posture, and planned improvements for Lighthouse Ministry Hub. It is written so that another developer — or a ministry considering adapting the system — can understand and operate it without reading the source first.

---

## 1. Purpose and scope

Lighthouse Ministry Hub is a deployed web application that organizes the daily workflow of a community outreach or ministry program. It centralizes member intake, member records, check-ins, point awards, item redemptions, resource referrals, volunteer and document records, staff coordination, reporting, activity logs, and data backups.

The problem it addresses is fragmentation. Outreach programs commonly track members on paper, points in a spreadsheet, resources in a binder, and follow-up in someone's memory. That structure loses information between volunteers and makes it hard to answer basic questions such as *who has not been seen in a month*, or *what did this member actually redeem*.

**The project was originally designed around a real ministry workflow.** Because the developer is no longer actively working with that organization, the project is now maintained, tested, and documented independently using fictional or anonymized data. The final product demonstrates how a ministry or outreach organization could adapt the system to its own needs.

### Scope boundaries

In scope: single-program operations for one organization; member care, points, inventory, redemptions, resources, records, reporting, and backups; staff authentication.

Out of scope: multi-tenant hosting for several organizations, financial accounting, donor payment processing, SMS or email notifications, and native mobile applications.

---

## 2. System overview

Lighthouse Ministry Hub is a **static single-page application** with an optional hosted backend.

| Layer | Technology | Notes |
|---|---|---|
| Markup | `index.html` (1,149 lines) | One page holds every view; a hash router shows one view at a time |
| Styling | `styles.css` (3,579 lines) | Custom design system; no CSS framework |
| Application logic | `app.js` (7,514 lines) | Plain JavaScript, no build step, no bundler |
| Spreadsheet export | `xlsx.full.min.js` (vendored SheetJS) | Client-side `.xlsx` generation |
| DOCX extraction | `mammoth.browser.min.js` (vendored) | Reads uploaded Word documents |
| Authentication and shared state | Supabase Auth + Postgres | Loaded from CDN, with a local config stub |

Total shipped application source is roughly 12,200 lines across the three primary files.

There is **no build step**. The repository is published as static files, which keeps deployment simple and makes the project inspectable by an instructor or a future maintainer without a toolchain.

### Views and navigation (hash router)

The application is no longer one long scrolling page. A small hash router (`APP_ROUTES` in `app.js`) shows exactly one view at a time and keeps the URL, the page title, the sidebar highlight, and browser history in sync.

| Route | View title | Contents |
|---|---|---|
| `#/dashboard` | Dashboard | Today's KPI cards, quick actions, needs attention, follow-up queue, upcoming events, recent activity |
| `#/members` | Members | Add member, searchable directory, residence-tag filter, A–Z / most regular / most recent sorts, inactive members |
| `#/members/<id>` | Member Profile | Record details, contact and emergency information, visit history, point activity |
| `#/check-in` | Member Check-In | Member search, status summary, optional note, confirmation step, success banner |
| `#/rewards` | Points & Rewards | Award points, redemption cart, recent point activity |
| `#/calendar` | Calendar & Tasks | Month grid, today view, next 30 days, event composer with checklists, shared staff reminders |
| `#/resources` | Community Resources | Category groups with counts, search, printable handouts |
| `#/reports` | Reports | Range and focus reporting, printable reports, spreadsheet exports |
| `#/admin` | Admin | Logs and backups, security, volunteers, documents, donors, items, corrections, settings |

Routes accept an optional member id (`#/check-in/<member-id>`, `#/rewards/<member-id>`) and preselect that member once per navigation, which is how the dashboard and the directory hand work off to other views. Links that used to jump to an anchor inside the page (`<a href="#some-id">`) were replaced by routes; the only remaining in-page anchor is the skip link.

The layout responds at 1180, 1024, 900, 700, 560, and 420 px. The sidebar is fixed above 1024 px and becomes a scrimmed drawer behind the menu button at or below it, down to a 320 px viewport.

### Accessibility and confirmation model

| Concern | Implementation |
|---|---|
| Focus visibility | One `:focus-visible` ring covers every control, with inset rings where a parent clips overflow (hero tiles, login panel) and a proxy ring for the off-screen file inputs. Outlines are suppressed only on the two programmatic targets: `#page-main` and `#app-page-title`. |
| Keyboard navigation | Skip link to the main landmark; route changes move focus to the view heading; Escape closes the mobile drawer and returns focus to the menu button; dialog Tab order is trapped in both directions. |
| Accessible names | Every form control has a label, `aria-label`, or `aria-labelledby`; the icon-only menu button is labelled and reports `aria-expanded`; error regions carry `role="alert"`. |
| Dialogs | The protected-action dialog and the destructive-confirmation dialog are `role="dialog" aria-modal="true"` with `aria-labelledby`/`aria-describedby`, initial focus on the safest control, Escape to cancel, and focus restored to the triggering control (falling back to the view heading when the trigger is re-rendered). |
| Confirmation before loss | Record deletions (donor, document, volunteer, resource, event, reward item, staff reminder) and point deductions open a confirmation dialog naming the record and showing the effect — for points, `Balance: 120 → 70 points`. High-impact actions (member removal, staff account deletion, task removal, undo, backup restore) additionally require staff re-authentication and a safety backup. |
| Form feedback | `setError` sets `aria-invalid` and `aria-describedby` on the offending fields and clears them when the value is corrected; submit buttons disable and set `aria-busy` while an asynchronous action is in flight. |
| Non-color cues | Point deltas are signed (`+40`, `-25`) as well as colored; task states are words ("Overdue by 3 days", "Due today", "Done"); calendar days with scheduled items carry screen-reader text. |
| Status announcements | `aria-live="polite"` regions report the member count, resource count, check-in result, redemption cart, report results, and dashboard alerts. |

### Runtime modes

The application selects its mode at load time based on whether Supabase credentials are present and whether it is running on a local host.

| Mode | When it activates | Authentication | Data location |
|---|---|---|---|
| **Supabase mode** (intended for deployed use) | `supabase-config.js` contains a URL and anon key | Supabase Auth (email + password) | Shared `ministry_app_state` row in Postgres |
| **Local password mode** | No Supabase config and the page is opened from `localhost`, `127.0.0.1`, or `file:` | In-app staff accounts stored in the browser | Browser `localStorage` only |

The local mode exists so the app can be run and demonstrated from a computer without a backend. It is explicitly *not* offered on a published site, because the in-app password mechanism would be trivially inspectable.

### Client-side storage keys

| Key | Purpose |
|---|---|
| `ministryPointsStateV1` | Full application state |
| `ministryStaffModeV1` | Whether the current session is signed in as staff |
| `ministryStaffUserV1` | Cached staff identity for the session |
| `ministrySafetyBackupsV1` | Rolling automatic safety backups (most recent three) |

### State size guards

| Guard | Limit | Reason |
|---|---|---|
| Profile photo source | 3 MB | Rejected before processing |
| Profile photo stored | ~600 KB target, resized to 512 px max dimension | Keeps state small and renders quickly |
| Uploaded document | 2 MB | Documents are stored inline in the state blob |
| Activity log entries | 1,000 (most recent kept) | Bounds growth |
| Admin log entries | 1,000 (most recent kept) | Bounds growth |
| Safety backups | 3 (most recent kept) | Bounds browser storage |

---

## 3. Database design

The design uses two layers: a **relational layer** for accounts and access control, and a **document layer** for the operational data itself.

### 3.1 Supabase schema (relational)

Defined in `lighthouse-supabase-setup.sql`.

**`public.ministry_staff`** — the approved-staff allowlist.

| Column | Type | Constraint |
|---|---|---|
| `user_id` | `uuid` | Primary key, references `auth.users(id)` on delete cascade |
| `display_name` | `text` | Not null |
| `is_active` | `boolean` | Not null, default `true` |
| `created_at` | `timestamptz` | Not null, default `now()` |

**`public.ministry_app_state`** — the shared application state.

| Column | Type | Constraint |
|---|---|---|
| `id` | `text` | Primary key (currently a single row: `lighthouse-ministry-hub`) |
| `state` | `jsonb` | Not null, default `'{}'` |
| `updated_by` | `uuid` | References `auth.users(id)` |
| `updated_at` | `timestamptz` | Not null, default `now()` |

**Why this shape.** Authentication is delegated to Supabase Auth, which already stores credentials and issues sessions; duplicating that in a custom table would be a security regression. Operational data is stored as one JSON document because the app is a single shared workspace, the schema is still evolving, and JSON round-trips cleanly into the backup/restore feature that the project requires. The tradeoff — no per-record server-side queries and no row-level granularity — is documented in Section 10 as the primary architectural improvement to pursue.

### 3.2 Access control (row level security)

Row level security is enabled on **both** tables. Four policies are defined:

| Policy | Table | Operation | Rule |
|---|---|---|---|
| Staff can read their own staff profile | `ministry_staff` | `select` | `user_id = auth.uid()` |
| Active staff can read ministry app state | `ministry_app_state` | `select` | Caller exists in `ministry_staff` with `is_active = true` |
| Active staff can create ministry app state | `ministry_app_state` | `insert` | Same active-staff check |
| Active staff can update ministry app state | `ministry_app_state` | `update` | Same check on both `using` and `with check` |

The practical effect: an authenticated user who is **not** on the `ministry_staff` allowlist cannot read or write operational data, even with valid Supabase credentials. Deactivating a staff member (`is_active = false`) revokes access without deleting their auth account.

Selecting a staff member additionally verifies the allowlist at sign-in time and produces the message *"This account is not approved for the Lighthouse Ministry Hub."* when it fails.

### 3.3 Application state model (document)

The `state` object contains the following collections.

| Collection | Purpose | Key fields |
|---|---|---|
| `people` | Member records | `id`, `firstName`, `lastName`, `points`, `dateJoined`, `home`, `residenceTag`, `phone`, `email`, `emergencyContact*`, `memberNotes`, `profilePhoto`, `followUpNeeded`, `followUpNote`, `staffTodos` |
| `visits` | Visit/check-in history | `id`, `personId`, `actor`, `timestamp` |
| `activity` | Point and service ledger | `id`, `personId`, `type`, `delta`, `before`, `after`, `note`, `actor`, `timestamp` |
| `adminLog` | Administrative and security log | `id`, `type`, `detail`, `actor`, `status`, `timestamp` |
| `items` | Reward catalog with point costs | `name`, `cost` |
| `customItems` / `hiddenItems` | Staff-added items, hidden items | `name`, `cost`, `group` |
| `customTasks` / `hiddenTasks` | Staff-added award tasks, hidden tasks | `id`, `label`, `points` |
| `volunteers` | Volunteer directory | `name`, `areas`, `role`, `ministrySafe`, `serviceCount`, `phone`, `email`, `profilePhoto` |
| `donors` | Donor records | `name`, `phone`, `email`, `donation` |
| `documents` | Uploaded documents | `title`, `category`, `fileName`, `mimeType`, `dataUrl`, `uploadedAt` |
| `events` | Calendar events and checklists | `title`, `date`, `description`, `checklist[]` |
| `resources` | Community resource directory | `name`, `category`, `services`, `address`, `phone`, `email`, `website`, `dropoff`, `photo` |
| `staffTodosGlobal` | Shared staff to-do list | `title`, `done`, `ownerId`, `actor` |
| `settings` | Organization name, hub name, dashboard subtitle | `organizationName`, `hubName`, `subtitle` |
| `staffUsers` | Local-mode staff accounts only | `displayName`, `username`, `password` |

**Ledger integrity rule.** `people[].points` is not an independent counter. Every change to a member's balance writes an `activity` entry that records the value *before* and *after* the change. This makes balances auditable and lets the undo feature restore a previous value exactly. The sample dataset is validated against this rule (Section 6).

Activity `type` values in use: `member` (intake), `visit`, `task` (preset award), `award` (custom award), `redeem`, `remove`, `undo`.

One scalar accompanies these collections: `lastSafetyBackupAt`, the timestamp of the most recent safety backup, shown in the backup status panel.

---

## 4. Key workflows

### 4.1 Member intake
Add Member collects name and starting points as required fields, with an expandable **Personal Information** area for date joined, housing description, residence tag, profile photo, contact details, emergency contact, and notes. Photos are compressed client-side (canvas resize, 512 px maximum dimension, ~600 KB target) before storage. Intake writes both the member record and a `member` activity entry, and records an admin log entry.

### 4.2 Member directory, search, and follow-up
The Members view provides free-text search across names and housing tags, a residence-tag filter, and three sort modes: **A–Z**, **Most Regular** (visit count), and **Most Recent Visit**. A live count reads *Showing 8 of 26 members (matching "ana", tagged Shelter).* so it is always clear how many records a filter is hiding, and a **Clear Filters** button appears whenever a search term or tag filter is active (it also resets the sort to A–Z) — including when the filters match nothing, where the empty state says so instead of looking like a missing feature. Members with no visit logged in 30 days — or no visit at all — are listed in the collapsed **Inactive Members** panel, which is the practical answer to "who needs follow-up." Opening a member goes to their profile route, and a **Print Sign-In Sheets** action produces a printable attendance sheet.

### 4.3 Check-in
Member Check-In is built for a busy service night: staff type a name, housing tag, or detail into a search box, pick the member, and see a summary card (points, last visit, follow-up state) and the member's six most recent activity entries before anything is written. An optional note can be attached to the visit, and the visit is confirmed in a small panel that restates the member and note with a **Confirm Check-In** button. The result banner reports success and offers **Open Profile** and **Check In Another Member**. A duplicate-visit guard blocks a second check-in for the same member within 60 seconds, so a double tap or double click cannot double-log a visit. Staff can also **Toggle Follow-Up** (with a note) or jump directly to **Redeem Items** for that member. Logging a visit writes both a `visits` record and a `visit` activity entry, so the check-in appears in the ledger and in reports.

### 4.4 Point awards
**Award Points** offers preset tasks (each with a point value), an inline **Add Task** editor that creates or updates custom tasks, a **Remove Task** control, and a collapsed **Custom Award** form for one-off awards requiring a note. Selecting a member shows their live current balance, and awarding opens a confirmation panel that states the change as `before → after` before it is written. Every award writes an activity entry with the task name or note as the reason, and it appears immediately in the **Point Activity** card, which lists the twelve most recent point changes with signed amounts and the resulting balance.

### 4.5 Inventory and redemption
**All Items and Point Costs** displays the catalog grouped by category, allowing staff to edit point values directly with automatic saving and to add new items into a group; hiding an item requires confirmation because hidden items disappear from the redemption list for everyone. **Redeem Items** selects a member, shows their available points, and presents a searchable catalog with quantity selectors. A cart panel lists the chosen items with a running total and the projected **Balance after** purchase; when the total exceeds the member's balance the cart warns, the submit is blocked, and nothing is written. The redemption is then confirmed in a panel before any state change. Successful redemptions write a `redeem` activity entry whose note records quantities in `N x Item` form — a format the weekly summary parses to compute items redeemed and the most popular category.

### 4.6 Corrections
**Corrections** provides two controls. **Undo Last** reverses the most recent point change by restoring the recorded `before` value and logging an `undo` entry. **Remove Points** requires a written reason, then shows a confirmation dialog naming the member, the balance before and after, and the reason before it writes a `remove` activity entry. Both actions pass through staff re-authentication, and points are never changed silently.

### 4.7 Dashboard home and staff coordination
The **Dashboard** opens with today's KPI cards (members served today, check-ins this week, items redeemed this week, follow-ups due) and quick actions. Below them sit four working panels: **Needs Attention** (members flagged for follow-up, members inactive for 30 days, events in the next seven days, and a daily reminder when the day's safety backup has not run), a **Follow-Up Queue** whose entries link straight into a preselected check-in, **Upcoming Events** for the next 14 days, and **Recent Activity** (the eight most recent entries, with a link to the full activity log in Admin). Each panel has its own empty state, so an empty panel says what it is waiting for rather than rendering blank.

The **Calendar & Tasks** view offers three ways to read the same schedule: a **Month grid** with previous/next navigation, a **Today** agenda, and a **Next 30 days** agenda. Selecting an event opens its detail card with description, checklist (each item checkable), and a **Remove Event** action. A shared **Staff Reminder** board lets staff add reminders with due dates, edit them, complete them, and remove them; reminders are sorted open-before-done and then by due date, and each one is labelled with a plain-language state such as "Overdue by 3 days", "Due today", "Due tomorrow", or "Done".

Administrative records group the **Volunteer Directory** (areas covered, leadership role, Ministry Safe status, service count, sortable by regularity), **Documents** (upload, list, view), and the **Donor List** in the Admin view.

### 4.8 Reporting and exports
- **Reports** — a range control (last 7 days, last 30 days, last 90 days, all time) crossed with a focus control (everything, check-ins, task awards, custom awards, deductions, redemptions) that recomputes six figures: check-ins, members served, points awarded, points redeemed, redemptions, and follow-ups flagged. The headline states exactly what is being shown (for example, *"Showing the last 30 days"* or *"Showing the last 30 days · Check-ins"*) and notes that the follow-up figure reflects the current roster rather than the selected range. A five-column table (date, member, action, points, balance) lists the matching ledger entries, capped at the 40 most recent with an explicit note when more exist.
- **Weekly Summary** — members served in the last seven days (distinct member ids appearing in visits or activity), items redeemed in that window, and the most popular item category.
- **Printable reports** — weekly ministry report, member sign-in sheets, community resource list, and logs report, each generated as a print-ready document.
- **Spreadsheet export** — activity logs export to `.xlsx` via SheetJS.

### 4.9 Backup, restore, and safety backups
- **Backup Data (JSON)** exports the complete state as a timestamped file.
- **Restore Data** imports a backup file, requires staff re-confirmation, and replaces application state.
- **Automatic safety backups** are captured before protected actions (restoring data, undoing activity, adding a staff account) and daily. The most recent three are retained in browser storage.
- **Restore Last Safety Backup** rolls back to the newest safety backup.
- Because a restore is itself destructive, the sequence is: safety backup → staff confirmation → apply → save → log.

### 4.10 Settings
**Settings & Restore Controls** allows staff to set the organization name, hub name, and dashboard subtitle, and to restore previously hidden tasks and items. This is the mechanism that lets one codebase present as a different organization — including as a neutral demonstration environment.

---

## 5. Security and access control

| Control | Implementation |
|---|---|
| Credential storage | Delegated to Supabase Auth; no passwords stored in the application |
| Allowlist | `ministry_staff` with `is_active` flag, enforced in the database and at sign-in |
| Row level security | Enabled on both tables; four policies (Section 3.2) |
| Re-authentication for protected actions | Restoring data, undoing activity, removing a member or an award task, and staff account changes require the staff to re-enter credentials in a labelled modal dialog |
| Confirmation before deletion | Deleting a donor, document, volunteer, resource, event, reward item, or staff reminder, and deducting points, open a confirmation dialog that names the record and states the effect. It can be cancelled with Escape, the Cancel button, or a click on the scrim, and nothing is written unless the confirmation is accepted |
| Failed-attempt logging | Denied and failed administrative actions are recorded in the admin log with a `Denied` status and appear in **Admin Actions & Failed Attempts** |
| Destructive-action safeguards | Safety backup before re-authenticated actions; explicit staff confirmation before applying |
| Published-site restriction | Local password mode is refused unless the page is served from a local host |
| Secrets handling | Only the public anon key is client-side; no service-role key is shipped |

**Known limitations, stated deliberately.** This is a single-tier trust model: every approved staff member has full administrative capability, and there is no read-only role. The admin log lives inside the client state document, so it is application-level evidence rather than a tamper-proof server-side audit trail. Local password mode is a development convenience and must never be enabled on a published site. These are addressed as improvements in Section 10.

---

## 6. Testing results

### 6.1 Automated checks

A read-only verification script is included in the repository so results are reproducible rather than asserted:

```bash
node tests/static-checks.mjs
```

It performs six groups of check:

1. **Element references** — every `#id` selector used in `app.js` exists in `index.html`.
2. **Page routing** — every hash route appearing in markup or code resolves to a known view, every route has a page container, and every in-page anchor points at an element that exists.
3. **Rebranding guards** — no shipped file names the original host organization, its city, or its housing complex.
4. **Sample roster integrity** — referential integrity, ledger reconciliation, catalog completeness, the built-in resource seed matching the demo roster, and inline document data.
5. **Accessibility affordances** — accessible names on form controls and icon-only buttons, dialog roles and labels, the presence of focus-trap and Escape handling, a defined focus ring, the skip-link target and reveal rule, a focusable route heading, announced error regions, and the list of destructive actions that must confirm first.
6. **Documentation consistency** — documented routes resolve to real views, the retired navigation idiom is absent, the line counts quoted in Section 2 match the files, and the check total quoted in this document matches the run (the total is verified by the last check, which counts itself).

The suite distinguishes three outcomes. A **PASS** is a satisfied check. A **WARN** is a known, accepted finding listed in `KNOWN_ISSUES` — reported on every run so it cannot be forgotten, but not treated as a regression. A **FAIL** is a new problem and sets a non-zero exit code, which is what makes the script usable in continuous integration later. `KNOWN_ISSUES` is currently empty: the previously accepted `#event-list` warning was resolved when the event list moved into the calendar panel (6.3, finding 1).

**Result (October 2, 2026): 29 of 29 checks passed, 0 warnings, 0 failures (exit code 0).**

| Group | Checks | Result |
|---|---|---|
| Element references | `app.js` selectors resolve — 191 ids referenced | Pass |
| Page routing | Hash routes resolve (10 links, 9 routes); every route has a page container (9 pages); in-page anchors resolve (0 broken) | Pass |
| Rebranding guards | No original organization name, former host city, or former housing complex in `index.html`, `app.js`, `styles.css`, `README.md`, `DEPLOYMENT.md` | Pass |
| Sample roster integrity | State object present; member ids unique (26); visits reference members (88, 0 orphans); activity references members (261, 0 orphans); **point balances reconcile with activity history (0 of 26 mismatched)**; redeemed items exist in the catalog (33 redemptions); dataset free of the original organization name; default resource seed matches the roster (6 of 6); documents carry inline file data (2 of 2) | Pass |
| Accessibility | Form controls have accessible names (0 missing); icon-only buttons are named (0 unnamed); dialogs declare role, `aria-modal`, and a label (2 dialogs); focus trap and Escape handlers present; focus ring defined with a single documented exception; skip link targets a real landmark and is revealed on focus; route heading is programmatically focusable; error regions are announced (0 silent); destructive actions confirm first (0 unconfirmed) | Pass |
| Documentation | Documented routes resolve; retired navigation idiom absent; documented line counts match the three primary files (0 drifted); documented check total matches the run (29) | Pass |

Syntax checks also pass: `node --check app.js` and `node --check sample-data/generate-sample-data.mjs`.

A second suite drives the real application in a real browser engine, because a source scan cannot prove that a route renders, that nothing overflows, or that the printed output contains the right data:

```bash
cd tests
npm install
npx playwright install chromium
node browser-checks.mjs
```

It signs in through local password mode, seeds the fictional roster, and then checks:

1. **Sign-in** — the local staff account unlocks the app and the gate disappears.
2. **Routes** — each of the eight navigation routes renders at least one visible section and sets its page title (the member profile is reached by deep link, so it is exercised through the members view).
3. **Responsive sweep** — 8 navigation routes x 5 widths (320, 375, 768, 1024, 1440) with the page never scrolling sideways, plus an explicit assertion that two quick actions stay above the fold on a 390x844 phone.
4. **Keyboard** — the first Tab stop shows a focus ring at least 2 px wide, that ring is measured for contrast against the surface behind it (4.98:1), and it is matched by `:focus-visible`.
5. **Dialogs** — the confirmation dialog declares `role="dialog"`, `aria-modal`, and a label, takes focus, and Escape cancels without changing any record (verified by comparing the reminder count before and after).
6. **axe-core** — a WCAG 2.0/2.1 A and AA scan of all eight views at phone and desktop widths.
7. **Evidence capture** — the four printable documents are written to PDF and the activity export to `.xlsx`, which is what closed the last open row of 6.2.
8. **Console hygiene** — no console errors or uncaught exceptions during the run.

The browser suite needs its own dev-only dependencies, kept out of the deployed tree: `tests/node_modules/` and the generated `tests/evidence/` folder are ignored, and the published site still has no dependencies and no build step.

**Result (October 5, 2026): 15 of 15 browser checks passed (exit code 0).**

| Group | Checks | Result |
|---|---|---|
| Sign-in | Local staff account unlocks the app | Pass |
| Routes | Every navigation route renders with a title (8 routes) | Pass |
| Responsive | No horizontal overflow across 5 widths x 8 navigation routes; two quick actions above the fold at 390x844 | Pass |
| Keyboard | First Tab stop shows a focus ring (3 px solid, `:focus-visible` matched); ring contrasts 4.98:1 against its surface | Pass |
| Dialogs | Confirmation dialog is labelled, modal, and takes focus; Escape cancels and changes nothing (rows 6 -> 6, focus returned to the triggering button) | Pass |
| Accessibility | axe-core reports no new serious or critical violations across 16 scans | Pass — 6 contrast findings tracked in 6.3, finding 7 |
| Evidence | Weekly Report, Logs Report, Sign-In Sheets, and Resource List each print to a PDF; activity log exports a 153.7 KB workbook | Pass |
| Console | Zero console errors | Pass |

### 6.2 Manual workflow verification

| Workflow | Verification method | Status |
|---|---|---|
| Staff sign-in and sign-out | Live session on the deployed site, and local password mode during interface work | Verified |
| Full data restore (`Restore Data`) | Performed against the deployed site with the sample roster; app re-rendered with 26 members and reported the neutral organization name | Verified Sept 18, 2026 |
| Weekly summary, inactive members, follow-up flags, logs | Observed populated after the sample-data restore | Verified Sept 18, 2026 |
| Backup export (JSON) | Exported before the restore to preserve prior data | Verified Sept 18, 2026 |
| Member intake, edit, profile view, and directory filtering | Exercised against the refreshed 26-member demo roster in a browser session; count line, tag filter, sorts, and the empty state all responded correctly | Verified Oct 2, 2026 |
| Check-in with note and duplicate guard | Logged a visit with an optional note, then submitted again inside the 60-second guard window and confirmed the app refused the second write | Verified Oct 2, 2026 |
| Award, deduction, and redemption | Awarded a task (confirm panel showed `before → after`), removed points with a reason, and redeemed items through the cart and its confirmation panel | Verified Oct 2, 2026 |
| Ledger reconciliation after every flow | Recomputed each member's balance from their `activity` deltas after the flows above; 0 of 26 mismatched | Verified Oct 2, 2026 |
| Reports | All six figures were recomputed independently from the activity log for the last 30 days and for all time, and every value matched (for example, all time: 88 check-ins, 23 members served, 960 points awarded, 221 points redeemed, 33 redemptions) | Verified Oct 2, 2026 |
| Calendar and tasks | Month grid, Today, and Next 30 days views; event detail with checklist; staff reminders sorted open-before-done with overdue/due-today labels; event removal through the confirm dialog | Verified Oct 2, 2026 |
| Confirmation, keyboard, and focus behavior | Drove real Tab, Shift+Tab, and Escape presses: Tab wrapped inside both dialogs in both directions, Escape cancelled without writing any state, focus returned to the triggering control, the skip link was the first Tab stop, and the app behind the sign-in gate was not tab-reachable | Verified Oct 2, 2026 |
| Responsive sweep | All nine views measured for horizontal overflow at 320, 375, 768, 1024, and 1440 px (findings recorded in 6.3) | Verified Oct 2, 2026 |
| Printable reports and spreadsheet export | Captured as artifacts by `tests/browser-checks.mjs`: the weekly report, logs report, sign-in sheets, and resource list are written to PDF in print media, and the activity export is downloaded as a 153.7 KB `.xlsx` workbook. Titles confirmed: "Lighthouse Weekly Report", "Lighthouse Logs Report", "Sign-In Sheets", "Community Resource List" | Verified Oct 5, 2026 |

The manual table is intentionally honest about what has and has not been recorded. The project plan places the remaining workflow verification in the November and December milestones, where results will be logged with date, steps, expected result, and observed result.

### 6.3 Findings and dispositions

| # | Finding | Severity | Disposition |
|---|---|---|---|
| 1 | `app.js` referenced `#event-list`, an element that no longer existed in `index.html`. The reference was inert, so the calendar's event list silently never rendered during the redesigned build. | Medium — an entire list was invisible | **Resolved.** The list now renders inside the calendar panel (`#calendar-events`), the orphan id is gone, and the accepted warning was removed from `KNOWN_ISSUES`. Guarded by the element-reference check. |
| 2 | The sample roster omits `items`, intentionally relying on the app's built-in catalog via the import fallback. The automated check was corrected to model runtime behavior rather than the file literally. | Informational | Resolved in the check |
| 3 | Event dates stored as `YYYY-MM-DD` were displayed one day early in the calendar grid, the event list, the detail popover, the dashboard panel, and the range filters, because a date-only string parses as UTC midnight while the interface renders local time. | Medium — wrong information shown to staff | **Resolved.** `parseDateOnly`, `eventDateTime`, and `formatEventDate` normalize date-only values to local time, and every render path uses them. |
| 4 | A boot-order defect — a state variable read by the first render before its declaration — crashed the app on load and, because the sign-in form then submitted natively, could place typed credentials in the page URL. | High — data exposure risk if it recurred | **Resolved.** Runtime state is declared above the first render, and the gate form carries `onsubmit="return false"` so a broken boot cannot leak credentials. |
| 5 | At 320 px the Calendar & Tasks staff-reminder rows pushed 38 px past the viewport, putting their buttons off-screen, and the newest dashboard panel rendered outside the intended card order. Found by the Phase 8 responsive sweep and the stylesheet's card-order review. | Medium — phone widths only | **Resolved.** Reminder rows wrap at 420 px and below; the panel's order value was corrected. The sweep now reports 0 px horizontal overflow across all nine views and five widths. |
| 6 | Tooling note: the browser preview used for verification cannot composite frames and never holds OS focus, so screenshots and painted focus rings could not be captured from it. | Informational | **Superseded.** A headless Chromium harness (`tests/browser-checks.mjs`) now captures screenshots, print PDFs, and the exported workbook, and measures painted focus rings and their contrast. Visual review of the captured images is still a human step. |
| 7 | axe-core reports `color-contrast` as a serious violation in three places: the redeem-cart hint text (measured 3.47:1 against the required 4.5:1), the hero statistics that sit over the banner photo, and the tinted report KPI labels. | Medium — readability for low-vision staff | **Open, tracked.** The first is a real measurement and needs a darker muted color; changing it recolors secondary text across the app, so it waits for the owner's sign-off. The other two are backdrops axe cannot resolve (a photo under a multi-stop gradient, and a tinted card), so they need a human look at the rendered pixels. All three are listed in the test suite's `CONTRAST_REVIEW` block, so they stay visible on every run and any *new* contrast regression still fails the suite. |
| 8 | On a 390x844 phone the Quick Actions card began 1157 px down the page — 313 px below the fold — because the hero shortcuts stacked one per row, the four KPI cards stacked into a 449 px column, and the KPI row sorted ahead of the actions. | Medium — the primary phone task needed scrolling before it was reachable | **Resolved.** Below 700 px the actions sort ahead of the statistics; below 560 px the hero shortcuts and the KPI cards each use two columns. Quick Actions now begins at 610 px with two actions inside the first screen, measured by the browser suite's fold assertion. |

### 6.4 Test data

`sample-data/generate-sample-data.mjs` deterministically generates a fictional dataset, and `sample-data/sample-roster-backup.json` is the importable result:

| Record type | Count |
|---|---|
| Members | 26 |
| Visits | 88 |
| Activity entries | 261 |
| Redemptions | 33 |
| Volunteers | 6 |
| Donors | 5 |
| Documents | 2 |
| Events | 4 |
| Community resources | 6 |
| Staff to-dos | 6 |
| Admin log entries | 12 (including 2 `Denied`) |

All names, phone numbers, email addresses, and street addresses are invented, using reserved `555` number ranges and `example.org` domains. The generator is rerunnable so dates can be refreshed before a presentation.

### 6.5 Verification still to be recorded

The accessibility pass that was scheduled here is complete for the interface itself: modal focus management, keyboard operation, focus visibility, accessible names, validation announcements, and the confirmation model are implemented and covered by the automated checks in 6.1, with the interactive behavior verified as recorded in 6.2.

Still outstanding:

- Automated browser tests (for example Playwright) that repeat the manual checks above on every run, including insufficient-balance rejection, the duplicate-visit guard, and a backup round-trip.
- Continuous integration to run the checks on push and publish the result.
- Captured visual evidence: screenshots of the printed reports, the exported workbook, and the focus rings, which the current preview tooling cannot produce (finding 6).

---

## 7. Setup and deployment

### 7.1 Local development

1. Open `index.html` in a browser, or serve the folder with any static server.
2. On a local host with no Supabase configuration, the app runs in local password mode.

### 7.2 Deployment (GitHub + Netlify)

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site** and connect the repository.
3. Settings: build command blank, publish directory `.` (also recorded in `netlify.toml`).
4. Deploy. `netlify.toml` sets `Cache-Control: no-cache` for HTML, JavaScript, and CSS, and a one-week cache for images, so application updates reach staff on refresh.

### 7.3 Supabase setup

1. Create a Supabase project.
2. Run `lighthouse-supabase-setup.sql` in the SQL editor.
3. Create the first staff user under **Authentication → Users**.
4. Insert the approved staff member:

```sql
insert into public.ministry_staff (user_id, display_name)
values ('AUTH-USER-UID', 'Staff Name');
```

5. Copy the project URL and anon public key into `supabase-config.js`:

```js
window.LIGHTHOUSE_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-PUBLIC-KEY",
};
```

6. Deploy. Staff sign in with their Supabase email and password.

### 7.4 Verification checklist before publishing

1. App loads without console errors.
2. Staff sign-in and sign-out work.
3. A fictional member can be added and edited.
4. A visit logs and the inactive/follow-up logic responds.
5. Points can be awarded, removed with a reason, and undone.
6. An item can be redeemed; insufficient balances are blocked.
7. A resource, event, and administrative record can be created.
8. A JSON backup exports and restores in a sample-data environment.
9. Logs, reports, and spreadsheet exports open correctly.
10. No real personal data or old organization branding is present.
11. The interface is keyboard-operable: the skip link is the first Tab stop, focus rings are visible, both dialogs keep Tab inside them and close with Escape, and deleting a record asks for confirmation.

---

## 8. User instructions

**Signing in.** Open the site and sign in with your staff email and password.

**Getting around.** The sidebar lists the eight working sections — Dashboard, Members, Check-In, Points & Rewards, Calendar & Tasks, Resources, Reports, and Admin — and each member also has a profile view, for nine routes in total. The address bar shows the current view (`#/dashboard`, `#/members`, and so on), so any screen can be bookmarked, reloaded, or shared, and the browser back button works. On a phone or narrow window the sidebar becomes a drawer behind the menu button in the top-left corner; press Escape to close it. Links in the dashboard's follow-up queue open the check-in view with that member already selected.

**Adding a member.** Use **Add Member**; expand **Personal Information** for contact and emergency details. Required: first name, last name, and starting points.

**Checking a member in.** Open **Check-In**, type a name, housing tag, or detail in the search box, and select the member. Review the summary (points, last visit, visits logged, follow-up state), add an optional note, then **Log Visit** and confirm in the panel that appears. The result banner offers **Open Profile** or **Check In Another Member**. A second check-in for the same member within a minute is refused, so a double tap cannot double-log a visit. Use **Toggle Follow-Up** to flag someone with a note.

**Awarding points.** Use **Award Points** to pick a preset task, or open **Custom Award** for a one-off award with a written reason. Staff can add new tasks inline with **Add Task**.

**Redeeming items.** Use **Redeem Items**, choose the member, select quantities, and confirm. The button shows the running total, and the app blocks redemptions that exceed the member's balance.

**Editing point costs.** In **All Items and Point Costs**, change a value in the list — it saves automatically. Add new items with **Add New Item**.

**Fixing a mistake.** In **Admin → Corrections**, use **Undo Last** for the most recent point change, or **Remove Points**. Removing points requires a written reason and then a confirmation dialog that shows the member, the balance before and after, and the reason, so a deduction can never be applied by accident. Both controls ask for staff credentials first.

**Finding someone.** In **Members**, search by name or housing tag, filter by residence tag, and sort by name, regularity, or most recent visit. The **Inactive Members** panel lists anyone unseen for 30 days.

**Reports.** Open **Reports** and choose a range (last 7, 30, or 90 days, or all time) and a focus (everything, check-ins, task awards, custom awards, deductions, or redemptions). Six figures recompute immediately and the table below lists the matching ledger entries. The **Weekly Summary** card in the same view shows the current week at a glance. Print the weekly report, sign-in sheets, resource list, or logs as needed, and export activity logs to Excel.

**Backups.** Use **Backup Data (JSON)** before major changes. **Restore Data** replaces current data from a backup file, and **Restore Last Safety Backup** rolls back to the most recent automatic snapshot. Both require staff credentials and take a fresh safety backup first; cancelling either dialog with Escape or Cancel leaves the data untouched.

**Removing records.** Deleting a donor, document, volunteer, resource, event, reward item, or staff reminder always opens a confirmation dialog naming the record. Nothing is deleted until **Confirm** is pressed.

**Keyboard use.** A **Skip to main content** link is the first stop when you press Tab from the top of the page. Every control shows a focus ring, the mobile drawer closes with Escape and returns focus to the menu button, and both dialogs keep Tab inside them, close with Escape, and return focus to the button that opened them.

**Changing the display name.** **Settings & Restore Controls** sets the organization name, hub name, and subtitle shown on the sign-in screen and dashboard.

---

## 9. Privacy considerations

The system handles sensitive personal information: names, housing status, phone numbers, email addresses, emergency contacts, photographs, notes, donor details, and uploaded documents.

**Current practices**

- Fictional, anonymized, or sample data is used for development, testing, demonstrations, screenshots, and any public deployment of this senior project.
- The repository's `.gitignore` excludes `Backups/`, `*.json`, `*.csv`, `*.xlsx`, and `*.xls`, so real exports are not committed. A single documented exception allows the fictional `sample-data/*.json` demonstration dataset.
- Local working artifacts are excluded as well: `preview-tmp/` (the local preview harness) and the `nav-check*.png`, `scale-check*.png`, and `visual-check*.png` verification screenshots.
- Only the public anon key is shipped client-side; service-role credentials are never placed in the repository.
- Row level security confines operational data to approved, active staff.
- Access to destructive or sensitive actions requires re-authentication, and denied attempts are logged.
- Sample data uses reserved `555` phone numbers and `example.org` email addresses so no real contact information can be dialed or mailed by accident.

**Guidance for a real deployment**

- Obtain organizational consent and a clear retention policy before entering real member data; decide how long records are kept and how removal requests are honored.
- Treat browser-only storage as unsuitable for real records; use Supabase mode with authentication.
- Restrict who receives the deployed URL, and review the staff allowlist regularly.
- Export and store backups in a controlled location, not in a shared folder or repository.
- Before publishing screenshots or presentations, confirm they contain no real records.
- Be aware that uploaded documents and photos are stored inline in the application state, so access to that state grants access to those files.

A dedicated privacy and security review is scheduled in the milestone plan (November 13) to formalize consent, retention, and access-review procedures.

---

## 10. Future improvements

**Data architecture**
1. Normalize the JSON document into relational tables — `members`, `visits`, `point_transactions`, `redemptions`, `items`, `staff_actions` — with foreign keys and row level security per table; retain the JSON snapshot strictly for backup and restore.
2. Move photos and documents into Supabase Storage with signed URLs instead of inline data URLs, which currently inflate the state document.
3. Add a server-side, immutable audit trail using database triggers, so point and permission changes are recorded outside the client.
4. Introduce conflict handling for concurrent edits; the current shared document is last-write-wins with a debounce.

**Security and permissions**
5. Add roles (administrator, staff, volunteer/read-only) with permission checks in both the interface and the database.
6. Add session timeout, password policy enforcement, and optional multi-factor authentication through Supabase.
7. Add a scheduled backup job with off-site retention, plus documented recovery drills.

**Quality and testing**
8. Add Playwright end-to-end coverage for sign-in, intake, awards, redemption rejection, undo, and backup round-trip.
9. Run the checks in continuous integration on every push, and publish results.
10. Capture visual evidence — printed reports, exported workbooks, and focus-ring screenshots — as a repeatable step in the documentation milestone.

**Experience and accessibility**
11. Extend the accessibility checks into a real browser run (axe-core or Playwright accessibility assertions) so measured contrast, computed focus styles, and the full tab order are machine-verified rather than structurally checked.
12. Run a screen-reader pass over the four busiest flows (check-in, award, redeem, follow-up) and record it with the November documentation.
13. Render the month grid as an agenda list below 900 px, where it currently scrolls horizontally inside its own panel.
14. Add barcode or quick-lookup check-in for busy service nights.

**Reporting and operations**
15. Add a member service totals report and saved report presets to complement the range and focus controls.
16. Add CSV import for existing member lists to lower the cost of adopting the system.

---

## 11. Requirements traceability

Mapping of the project proposal's feature lists to implementation evidence.

| Requirement | Tier | Where implemented |
|---|---|---|
| Deployed, working application | MVP | GitHub + Netlify; documented in Section 7 |
| Add, view, edit, and organize member records | MVP | Add Member; Members directory; profile view |
| Point balances and point activity | MVP | `people[].points` with `activity` ledger (Section 3.3) |
| Item/inventory system with categories and costs | MVP | Items & Point Costs; grouped catalog |
| Staff redemption with recorded redemption | MVP | Redeem Items; `redeem` activity entries |
| Basic check-in / visit log | MVP | Member Check-In; `visits` collection |
| Sample or anonymized data | MVP | `sample-data/` generator and roster |
| Basic documentation | MVP | `README.md`; this document |
| Workflow organized into clear areas | B | Sidebar navigates nine hash routes (Section 2) |
| Accessible, keyboard-operable interface | B | Accessibility and confirmation model (Section 2); accessibility checks (6.1); interactive verification (6.2) |
| Preset and custom awards tracked in history | B | Award Points; Custom Award; task activity entries |
| Visits, last visit, follow-up identification | B | Check-in history; Inactive Members (30 days); follow-up flags |
| Categorized rewards that update balances | B | Grouped items; redemption adjusts points |
| Searchable directory, profiles, histories | B | Search, tag filter, three sort modes; visit history |
| Staff coordination (events, checklists, reminders) | B | Dashboard panels; Calendar & Tasks views; shared staff reminder board |
| Resource and administrative records | B | Community Resources; volunteers, documents, donors |
| Validation and documented corrections | B | Required notes; insufficient-balance block; Remove Points; Undo Last |
| Documented testing of major workflows | B | Section 6; `tests/static-checks.mjs` |
| Complete intake-to-report workflow | A | Sections 4.1–4.8 |
| Staff authentication, account controls, permissions, security logging | A | Supabase Auth; `ministry_staff`; RLS; re-authentication; admin log |
| Weekly summaries and printable reports | A | Weekly Summary; four printable reports |
| Search, filtering, sorting, and profiles | A | Members, logs, admin log, and resource search/filters |
| Admin logs, denied actions, correction controls | A | Admin log with `Denied` entries; Corrections |
| JSON backup/restore, safety backups, exports | A | Backup/Restore; rolling safety backups; `.xlsx` export |
| Complete documentation set | A | This document plus `README.md` and `DEPLOYMENT.md` |
| Anonymized records in the final demonstration | A | `sample-data/sample-roster-backup.json` |
| Full system demonstration | A | Demo check-in, award, redemption, log review, and recovery |

---

## 12. Milestone alignment

| Milestone | Focus | Status |
|---|---|---|
| Sep 4 | Review application, confirm scope, identify remaining work, create plan | Complete |
| Sep 18 | Review database and records, improve member and check-in workflows, prepare safe sample data | Complete — sample dataset generated, validated, and verified on the deployed site |
| Oct 2 | Test points, inventory, redemption, activity history, follow-up | Complete — points, redemption, and follow-up re-verified against a reconciled ledger; the interface was rebuilt into routed views and the accessibility and responsive passes were recorded (Sections 2 and 6) |
| Oct 16 | Test dashboard tools, events, checklists, reminders, volunteer, document, resource features | In progress — dashboard panels, calendar views, event checklists, and staff reminders verified; volunteer, document, and resource records re-checked |
| Oct 30 | Improve reporting, validation, corrections, logs, exports, backups, restore | In progress — range and focus reporting, inline validation, corrections confirmations, logs, backups, and restore re-verified; printed and spreadsheet output still to be captured as evidence |
| Nov 13 | Security and privacy review, interface improvements, full workflow testing, documentation | Planned — the interface work from this milestone is largely delivered; the review, screen-reader pass, and documentation refresh remain |
| Dec 4 | Final testing, documentation, anonymized demo data, presentation, submission | Planned |

---

## 13. Repository map

| Path | Purpose |
|---|---|
| `index.html` | Application markup and all views |
| `styles.css` | Design system and layout |
| `app.js` | Application logic |
| `supabase-config.js` | Supabase URL and public anon key |
| `lighthouse-supabase-setup.sql` | Database schema and row level security policies |
| `netlify.toml` | Publish directory and cache headers |
| `sample-data/generate-sample-data.mjs` | Deterministic fictional dataset generator |
| `sample-data/sample-roster-backup.json` | Importable fictional dataset |
| `tests/static-checks.mjs` | Element-reference, routing, rebranding, dataset, accessibility, and documentation checks (Section 6.1) |
| `BUILD-PLAN.md` | Phased build plan and risk register used to drive the interface redesign |
| `README.md` | Project overview, routes, and capabilities |
| `DEPLOYMENT.md` | Deployment, Supabase setup, privacy, and verification checklist |
| `PROJECT-DOCUMENTATION.md` | This document |
| `xlsx.full.min.js`, `mammoth.browser.min.js` | Vendored third-party libraries |

---

*All records, screenshots, and demonstrations referenced in this document use invented or anonymized data. No real member, volunteer, or donor information is stored in or published from this repository.*
