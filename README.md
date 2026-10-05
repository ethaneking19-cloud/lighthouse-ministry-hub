# Lighthouse Ministry Hub

Lighthouse Ministry Hub is a deployed web application for organizing the daily workflow of a community outreach or ministry program. It centralizes member intake, member records, check-ins, point awards, item redemptions, resource referrals, volunteer and document records, staff coordination, reporting, activity logs, and data backups.

The project is maintained independently as Ethan King's senior project. It is designed to demonstrate how a ministry or outreach organization could adapt the system to its own needs. Use only fictional, anonymized, or sample data in development, testing, demonstrations, and public deployments.

## Interface at a glance

The app is a static single-page application presented as a staff operations console: a fixed sidebar, a top bar that names the current view, and one focused view on screen at a time. Every view is a hash route, so any screen can be linked, bookmarked, reloaded, and reached with the browser back button.

| Route | View | Contents |
|---|---|---|
| `#/dashboard` | Dashboard | Today's KPIs, quick actions, needs attention, follow-up queue, upcoming events, recent activity |
| `#/members` | Members | Add member, searchable directory, residence-tag filter, three sorts, inactive members |
| `#/members/<id>` | Member Profile | Full record, contact details, visit history, and point activity for one member |
| `#/check-in` | Member Check-In | Search a member, review the summary, log a visit with an optional note |
| `#/rewards` | Points & Rewards | Award points, redeem items with a running cart, recent point activity |
| `#/calendar` | Calendar & Tasks | Month grid / Today / Next 30 days, event composer with checklists, shared staff reminders |
| `#/resources` | Community Resources | Referral directory grouped by category, with search and a category count |
| `#/reports` | Reports | Range and focus reporting, printable reports, spreadsheet export |
| `#/admin` | Admin | Logs and backups, security, volunteers, documents, donors, items, corrections, settings |

Routes can carry a member id: `#/check-in/<member-id>` and `#/rewards/<member-id>` preselect that member. The dashboard's follow-up queue uses these links to jump straight from "needs a visit" to a ready check-in.

The layout is responsive from 1440 px down to 320 px. The sidebar is fixed on wide screens and becomes a drawer behind the labelled menu button at 1024 px and below; at 900 px and below the month grid scrolls horizontally inside its own panel, and the Today and Next 30 days agenda views are the narrow-screen alternatives.

## Core capabilities

- Add, view, edit, search, filter, and organize member records, with a full member profile for each person.
- Track point balances, preset or custom awards, removals, and activity history. Every balance change records the value before and after, so balances stay auditable.
- Manage categorized reward items and point costs, with a redemption cart that shows the balance after the purchase and blocks overspending before anything is written.
- Record check-ins and visits with a confirmation step, an optional note, and a duplicate-visit guard.
- Identify members who may need follow-up, with one-click paths into check-in.
- Coordinate staff events, checklists, reminders, volunteers, documents, and donors.
- Maintain community-resource records grouped by category.
- Produce range-based reports, printable reports, spreadsheet exports, and JSON backups.
- Use validation, correction controls, administrative logs, and restore tools.

## Safety and accessibility

- Every screen is reachable by keyboard: a skip link, visible focus rings on all controls, focus moved to the page heading after navigation, and Escape closing the mobile drawer.
- Both dialogs — protected action and destructive confirmation — are labelled modal dialogs that keep Tab inside the dialog, close on Escape, and return focus to the control that opened them.
- Nothing is deleted on a single click. Removing a member, staff account, task, donor, document, volunteer, resource, event, reward item, staff reminder, or an amount of points asks for confirmation first; the highest-impact actions (member removal, staff-account deletion, award-task removal, undo, and backup restore) additionally require staff re-authentication and capture a safety backup first.
- Inline validation marks the field itself, announces the message to screen readers, and clears when the problem is fixed.
- Layout was measured for horizontal overflow at 320, 375, 768, 1024, and 1440 pixels across all nine views.

## How to use

- Open `index.html` in a browser, or serve the folder with a static web server.
- Sign in at the staff gate. On a local host with no Supabase configuration the app runs in local password mode.
- Add fictional or anonymized members for testing.
- Award points for completed tasks and redeem items to verify the workflow, then open **Reports** and compare the figures.
- Use **Admin → Settings & Restore Controls** to configure the organization name, hub name, and subtitle for a demonstration environment.
- Use **Admin → Logs, Backups & Security** to export a JSON backup before major changes.

By default, data is stored locally when opened from this computer. A deployed site should be configured with `supabase-config.js` so staff authentication and shared app data use Supabase. See `DEPLOYMENT.md` for setup details and the privacy/data-safety checklist.

## Documentation

- `PROJECT-DOCUMENTATION.md` — purpose, system overview, database design, key workflows, interface and accessibility model, testing results, deployment, user instructions, privacy considerations, and future improvements.
- `sample-data/` — a fictional dataset and generator for development, testing, and demonstrations. Never use real member records in demos.
- `tests/static-checks.mjs` — rerunnable checks (29 of 29 passing as of this revision) for element references, hash routes and in-page anchors, rebranding guards, demo-dataset integrity, accessibility affordances, and documentation consistency: `node tests/static-checks.mjs`.
- `tests/browser-checks.mjs` — drives the app in headless Chromium (15 of 15 passing): sign-in, every route rendering, a 5-width responsive sweep, the phone-actions-above-the-fold assertion, focus-ring measurement, the confirmation dialog's keyboard contract, an axe-core WCAG scan, and capture of the printable PDFs and exported workbook. Needs a one-time `npm install` and `npx playwright install chromium` inside `tests/`; see Section 6.1 of the project documentation.
- `BUILD-PLAN.md` — the phased build plan and risk register used to drive the redesign work.

## Senior-project milestones

The project plan covers application review and scope definition, database and sample-data preparation, workflow testing, dashboard and records testing, reporting and backup hardening, security/privacy review, documentation, and final presentation testing.

The final demonstration should show a member check-in, point award, item redemption, activity/report review, and backup or recovery workflow without exposing real personal information.
