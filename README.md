# Lighthouse Ministry Hub

Lighthouse Ministry Hub is a deployed web application for organizing the daily workflow of a community outreach or ministry program. It centralizes member intake, member records, check-ins, point awards, item redemptions, resource referrals, volunteer and document records, staff coordination, reporting, activity logs, and data backups.

The project is maintained independently as Ethan King's senior project. It is designed to demonstrate how a ministry or outreach organization could adapt the system to its own needs. Use only fictional, anonymized, or sample data in development, testing, demonstrations, and public deployments.

## Core capabilities

- Add, view, edit, search, filter, and organize member records.
- Track point balances, preset or custom awards, removals, and activity history.
- Manage categorized reward/inventory items and point costs.
- Record item redemptions and member check-ins or visits.
- Identify members who may need follow-up.
- Coordinate staff events, checklists, reminders, volunteers, documents, and donors.
- Maintain community-resource records.
- Produce summaries, printable reports, spreadsheet exports, and JSON backups.
- Use validation, correction controls, administrative logs, and restore tools.

## How to use

- Open `index.html` in a browser, or serve the folder with a static web server.
- Add fictional or anonymized members for testing.
- Award points for completed tasks and redeem items to verify the workflow.
- Use the Settings and Restore Controls area to configure the organization name, hub name, and subtitle for a demonstration environment.
- Use Logs & Backups to export a JSON backup before major changes.

By default, data is stored locally when opened from this computer. A deployed site should be configured with `supabase-config.js` so staff authentication and shared app data use Supabase. See `DEPLOYMENT.md` for setup details and the privacy/data-safety checklist.

## Senior-project milestones

The project plan covers application review and scope definition, database and sample-data preparation, workflow testing, dashboard and records testing, reporting and backup hardening, security/privacy review, documentation, and final presentation testing.

The final demonstration should show a member check-in, point award, item redemption, activity/report review, and backup or recovery workflow without exposing real personal information.
