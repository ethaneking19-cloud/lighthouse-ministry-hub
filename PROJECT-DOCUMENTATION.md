# Lighthouse Ministry Hub — Senior Project Documentation

**Student:** Ethan King
**Project:** Lighthouse Ministry Hub: A Web-Based Ministry Operations and Member-Care Management System
**Repository:** https://github.com/ethaneking19-cloud/lighthouse-ministry-hub
**Document status:** Maintained through the Fall 2026 milestone schedule

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
| Markup | `index.html` (865 lines) | All views are sections of one page, navigated by in-page anchors |
| Styling | `styles.css` (2,245 lines) | Custom design system; no CSS framework |
| Application logic | `app.js` (5,911 lines) | Plain JavaScript, no build step, no bundler |
| Spreadsheet export | `xlsx.full.min.js` (vendored SheetJS) | Client-side `.xlsx` generation |
| DOCX extraction | `mammoth.browser.min.js` (vendored) | Reads uploaded Word documents |
| Authentication and shared state | Supabase Auth + Postgres | Loaded from CDN, with a local config stub |

Total shipped application source is roughly 9,000 lines across the three primary files.

There is **no build step**. The repository is published as static files, which keeps deployment simple and makes the project inspectable by an instructor or a future maintainer without a toolchain.

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

---

## 4. Key workflows

### 4.1 Member intake
Add Member collects name and starting points as required fields, with an expandable **Personal Information** area for date joined, housing description, residence tag, profile photo, contact details, emergency contact, and notes. Photos are compressed client-side (canvas resize, 512 px maximum dimension, ~600 KB target) before storage. Intake writes both the member record and a `member` activity entry, and records an admin log entry.

### 4.2 Member directory, search, and follow-up
The Members card provides free-text search across names and housing tags, a residence-tag filter, and three sort modes: **A–Z**, **Most Regular** (visit count), and **Most Recent Visit**. Members with no visit logged in 30 days — or no visit at all — are listed in the collapsed **Inactive Members** panel, which is the practical answer to "who needs follow-up." A **Print Sign-In Sheets** action produces a printable attendance sheet.

### 4.3 Check-in
Member Check-In combines a member selector, a live summary of that member's status, and their visit history in one view. Staff can **Log Visit**, **Toggle Follow-Up** (with a note), or jump directly to **Redeem Items** for that member. Logging a visit writes both a `visits` record and a `visit` activity entry so the check-in appears in the ledger and in reports.

### 4.4 Point awards
**Award Points** offers one-tap preset tasks (each with a point value), an inline **Add Task** editor that creates or updates custom tasks, a **Remove Task** control, and a collapsed **Custom Award** form for one-off awards requiring a note. Every award writes an activity entry with the task name or note as the reason.

### 4.5 Inventory and redemption
**All Items and Point Costs** displays the catalog grouped by category, allowing staff to edit point values directly with automatic saving and to add new items into a group. **Redeem Items** selects a member, shows their available points, presents the catalog with quantity selectors, computes the running total, and blocks the redemption with an explicit message when the total exceeds the balance. Successful redemptions write a `redeem` activity entry whose note records quantities in `N x Item` form — a format the weekly summary parses to compute items redeemed and the most popular category.

### 4.6 Corrections
**Corrections** provides two controls. **Undo Last** reverses the most recent point change by restoring the recorded `before` value and logging an `undo` entry. **Remove Points** requires a reason and writes a `remove` activity entry. Both actions pass through staff re-confirmation.

### 4.7 Staff coordination
The **Staff Dashboard** shows alerts (inactive members, follow-up flags, upcoming events) plus a calendar with month navigation and an event composer supporting checklist items. A shared **Staff To-Do List** lets staff add, edit, and complete reminders. Administrative records group the **Volunteer Directory** (areas covered, leadership role, Ministry Safe status, service count, sortable by regularity), **Documents** (upload, list, view), and the **Donor List**.

### 4.8 Reporting and exports
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
| Re-authentication for protected actions | Restoring data, undoing activity, archiving/removing records, and staff account changes require the staff to re-enter credentials in a confirmation modal |
| Failed-attempt logging | Denied and failed administrative actions are recorded in the admin log with a `Denied` status and appear in **Admin Actions & Failed Attempts** |
| Destructive-action safeguards | Safety backup before protected actions; explicit staff confirmation before applying |
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

It performs three categories of check: element-reference integrity between `app.js` and `index.html`, in-page anchor validity, and demo-dataset integrity (referential integrity, ledger reconciliation, catalog completeness, and a rebranding guard that fails if the original host organization's name appears in any shipped file).

The suite distinguishes three outcomes. A **PASS** is a satisfied check. A **WARN** is a known, accepted finding listed in `KNOWN_ISSUES` — reported on every run so it cannot be forgotten, but not treated as a regression. A **FAIL** is a new problem and sets a non-zero exit code, which is what makes the script usable in continuous integration later.

**Result (September 18, 2026): 10 of 11 checks passed, 1 accepted warning, 0 failures (exit code 0).**

| Check | Result | Detail |
|---|---|---|
| `app.js` selectors resolve | **WARN (accepted)** | 148 element ids referenced, 1 missing: `event-list` — see 6.3, finding 1 |
| All in-page anchors exist | Pass | 13 of 13 links resolve |
| No original organization name in shipped files | Pass | `index.html`, `app.js`, `styles.css`, `README.md`, `DEPLOYMENT.md` |
| Backup payload structure | Pass | `state` object present |
| Member ids unique | Pass | 26 members |
| Visits reference real members | Pass | 88 visits, 0 orphans |
| Activity references real members | Pass | 261 entries, 0 orphans |
| **Point balances reconcile with activity history** | Pass | 0 of 26 mismatched |
| Redeemed items exist in the catalog | Pass | All names resolve to built-in or custom items |
| Sample data free of original organization name | Pass | Guard enforced on the dataset |
| Documents carry inline file data | Pass | 2 of 2 documents |

Syntax checks also pass: `node --check app.js` and `node --check sample-data/generate-sample-data.mjs`.

### 6.2 Manual workflow verification

| Workflow | Verification method | Status |
|---|---|---|
| Staff sign-in (Supabase) | Live session on the deployed site | Verified |
| Full data restore (`Restore Data`) | Performed against the deployed site with the sample roster; app re-rendered with 26 members and reported the neutral organization name | Verified Sept 18, 2026 |
| Weekly summary, inactive members, follow-up flags, logs | Observed populated after the sample-data restore | Verified Sept 18, 2026 |
| Backup export (JSON) | Exported before the restore to preserve prior data | Verified Sept 18, 2026 |
| Intake, check-in, award, redemption, correction, event, document, and export workflows end-to-end | To be recorded against the milestone plan below | Scheduled |

The manual table is intentionally honest about what has and has not been recorded. The project plan places the remaining workflow verification in the October and November milestones, where results will be logged with date, steps, expected result, and observed result.

### 6.3 Findings and dispositions

| # | Finding | Severity | Disposition |
|---|---|---|---|
| 1 | `app.js:463` references `#event-list`, which does not exist in `index.html`. The guard at line 4001 returns early, so the reference is inert and events still render through the calendar panel. | Low — dead code, no user-visible impact | Documented; cleanup queued |
| 2 | The sample roster omits `items`, intentionally relying on the app's built-in catalog via the import fallback. The automated check was corrected to model runtime behavior rather than the file literally. | Informational | Resolved in the check |

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

### 6.5 Test cases still to be written

Automated browser tests (for example Playwright) covering sign-in, intake validation, insufficient-balance rejection, undo, and backup round-trip; continuous integration to run the checks on push; and an accessibility pass covering modal focus management and keyboard operation.

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

---

## 8. User instructions

**Signing in.** Open the site and sign in with your staff email and password.

**Adding a member.** Use **Add Member**; expand **Personal Information** for contact and emergency details. Required: first name, last name, and starting points.

**Checking a member in.** Use **Member Check-In**, select the member, review their summary and history, then **Log Visit**. Use **Toggle Follow-Up** to flag someone for a follow-up note.

**Awarding points.** Use **Award Points** to pick a preset task, or open **Custom Award** for a one-off award with a written reason. Staff can add new tasks inline with **Add Task**.

**Redeeming items.** Use **Redeem Items**, choose the member, select quantities, and confirm. The button shows the running total, and the app blocks redemptions that exceed the member's balance.

**Editing point costs.** In **All Items and Point Costs**, change a value in the list — it saves automatically. Add new items with **Add New Item**.

**Fixing a mistake.** Use **Corrections → Undo Last** for the most recent point change, or **Remove Points** with a required reason.

**Finding someone.** In **Members**, search by name or housing tag, filter by residence tag, and sort by name, regularity, or most recent visit. The **Inactive Members** panel lists anyone unseen for 30 days.

**Reports.** **Weekly Summary** shows the current week at a glance. Print the weekly report, sign-in sheets, resource list, or logs as needed, and export activity logs to Excel.

**Backups.** Use **Backup Data (JSON)** before major changes. **Restore Data** replaces current data from a backup file, and **Restore Last Safety Backup** rolls back to the most recent automatic snapshot. Both require staff confirmation.

**Changing the display name.** **Settings & Restore Controls** sets the organization name, hub name, and subtitle shown on the sign-in screen and dashboard.

---

## 9. Privacy considerations

The system handles sensitive personal information: names, housing status, phone numbers, email addresses, emergency contacts, photographs, notes, donor details, and uploaded documents.

**Current practices**

- Fictional, anonymized, or sample data is used for development, testing, demonstrations, screenshots, and any public deployment of this senior project.
- The repository's `.gitignore` excludes `Backups/`, `*.json`, `*.csv`, `*.xlsx`, and `*.xls`, so real exports are not committed. A single documented exception allows the fictional `sample-data/*.json` demonstration dataset.
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
10. Resolve the `#event-list` dead reference and evaluate whether the interface should surface a standalone upcoming-events list.

**Experience and accessibility**
11. Complete an accessibility pass: modal focus trapping, keyboard-only operation, ARIA live regions for the summary counters, and color-contrast verification.
12. Split the single long page into focused views (Dashboard, Members, Resources, Admin) with shared quick actions, addressing navigation density as the feature set grew.
13. Add barcode or quick-lookup check-in for busy service nights.

**Reporting and operations**
14. Add date-range reporting and a member service totals report to complement the weekly summary.
15. Add CSV import for existing member lists to lower the cost of adopting the system.

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
| Workflow organized into clear areas | B | Operations Menu navigates 13 sections |
| Preset and custom awards tracked in history | B | Award Points; Custom Award; task activity entries |
| Visits, last visit, follow-up identification | B | Check-in history; Inactive Members (30 days); follow-up flags |
| Categorized rewards that update balances | B | Grouped items; redemption adjusts points |
| Searchable directory, profiles, histories | B | Search, tag filter, three sort modes; visit history |
| Staff coordination (events, checklists, reminders) | B | Staff Dashboard; calendar; shared to-do list |
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
| Oct 2 | Test points, inventory, redemption, activity history, follow-up | Planned |
| Oct 16 | Test dashboard tools, events, checklists, reminders, volunteer, document, resource features | Planned |
| Oct 30 | Improve reporting, validation, corrections, logs, exports, backups, restore | Planned |
| Nov 13 | Security and privacy review, interface improvements, full workflow testing, documentation | Planned |
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
| `tests/static-checks.mjs` | Element-reference, anchor, and dataset integrity checks |
| `README.md` | Project overview and capabilities |
| `DEPLOYMENT.md` | Deployment, Supabase setup, privacy, and verification checklist |
| `PROJECT-DOCUMENTATION.md` | This document |
| `xlsx.full.min.js`, `mammoth.browser.min.js` | Vendored third-party libraries |

---

*All records, screenshots, and demonstrations referenced in this document use invented or anonymized data. No real member, volunteer, or donor information is stored in or published from this repository.*
