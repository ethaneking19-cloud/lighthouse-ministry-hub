# Deployment and Maintenance Guide

Lighthouse Ministry Hub is a static web application. It can run in browser-only local mode, or it can use Supabase for staff authentication and shared ministry data across computers. The project is maintained independently as a senior project and should be demonstrated with fictional or anonymized records only.

## Recommended hosting: GitHub + Netlify

1. Create or use a GitHub repository for the project.
2. Push this folder to the repository.
3. Create a Netlify account at `https://www.netlify.com/`.
4. Connect the GitHub repository with **Add new site**.
5. Use these settings:
   - Build command: leave blank
   - Publish directory: `.`
6. Deploy the site.
7. Use the deployed URL for testing and presentations. Do not publish real member or donor information.

After deployment, updates work as follows:

1. Edit the application files.
2. Commit and push changes to GitHub.
3. Netlify automatically redeploys the site.
4. Reload the deployed URL and verify the major workflows.

## Configure branding

The Settings & Restore Controls section allows staff-mode users to change the organization name, hub name, and dashboard subtitle. For a project demonstration, use a neutral name such as **Community Outreach Program** and fictional records. The default branding is intentionally organization-neutral.

## Supabase setup

Supabase provides hosted authentication and shared application state across computers.

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `lighthouse-supabase-setup.sql`.
4. In **Authentication > Users**, create the first staff user.
5. Copy that user's User UID.
6. Add the approved staff member:

```sql
insert into public.ministry_staff (user_id, display_name)
values ('PASTE-AUTH-USER-UID-HERE', 'Staff Name');
```

7. Open **Project Settings > API**.
8. Copy the project URL and publishable/anon public key.
9. Put them in `supabase-config.js`:

```js
window.LIGHTHOUSE_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-PUBLIC-KEY",
};
```

10. Deploy the site.
11. Sign in with the configured Supabase staff email and password.
12. If sample data needs to move into Supabase, restore a JSON backup while signed in.

Never commit private service-role keys, passwords, real personal records, or unredacted exports to the repository.

## Data and privacy notes

Without Supabase configured, the app stores member data, point totals, activity, resources, documents, and settings in this browser's `localStorage`. Data is tied to the exact browser and URL.

With Supabase configured:

- Staff sign in with Supabase Auth.
- Shared state is stored in `ministry_app_state`.
- Only approved active staff listed in `ministry_staff` can read or write shared state.
- JSON backups are still recommended before major changes.
- Supabase authentication and database policies should be reviewed before any real-world deployment.

For this senior project, use fictional or anonymized data in screenshots, testing, public hosting, and the final presentation. Treat names, phone numbers, email addresses, addresses, photos, emergency contacts, donor information, and uploaded documents as sensitive.

## Verification checklist

Before presenting or publishing an update:

1. Confirm the app loads without console errors.
2. Confirm staff login and sign-out work.
3. Add a fictional test member and edit their profile.
4. Log a visit and verify follow-up/inactive-member behavior.
5. Award points, remove points with a required reason, and verify activity history.
6. Redeem an item and verify the balance and weekly summary.
7. Test a resource, event/task, and administrative record workflow.
8. Export a JSON backup and test restore in a safe sample-data environment.
9. Review logs, reports, and spreadsheet exports.
10. Confirm no real personal or organization-specific data is present.
