# Remote Updates Guide

This app is a static website. It can run in local browser-only mode from this computer, or it can use Supabase free tier for real staff sign-in and shared ministry data across computers. The published site should use Supabase.

## Recommended Setup: GitHub + Netlify

Use this if you want to make updates from your computer and have the organization receive them by refreshing the app.

1. Create a GitHub repository for this project.
2. Push this folder to that repository.
3. Create a free Netlify account at `https://www.netlify.com/`.
4. In Netlify, choose `Add new site` and connect the GitHub repository.
5. Use these Netlify settings:
   - Build command: leave blank
   - Publish directory: `.`
6. Deploy the site.
7. Give the organization the Netlify site URL.

After that, updates work like this:

1. Edit `index.html`, `styles.css`, `app.js`, or `supabase-config.js`.
2. Commit and push the changes to GitHub.
3. Netlify automatically rebuilds the site.
4. The organization refreshes their browser to receive the update.

## Free Supabase Setup

Use this to replace the public in-app password with Supabase Auth and move shared records into a Supabase database.

1. Create a free Supabase project.
2. In Supabase, open `SQL Editor`.
3. Run the setup SQL from `lighthouse-supabase-setup.sql`.
4. Go to `Authentication` > `Users` and create the first staff user.
5. Copy that user's `User UID`.
6. Run this SQL with the copied UID:

```sql
insert into public.ministry_staff (user_id, display_name)
values ('PASTE-AUTH-USER-UID-HERE', 'Staff Name');
```

7. Go to `Project Settings` > `API`.
8. Copy the project URL and anon public key.
9. Paste them into `supabase-config.js`:

```js
window.LIGHTHOUSE_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-PUBLIC-KEY",
};
```

10. Deploy the site.
11. Sign in with the Supabase staff email and password.
12. If existing local data needs to move into Supabase, restore a JSON backup while signed in. The restored state will be saved to Supabase.

## Important Data Note

Without Supabase configured, the app stores member data, point totals, activity, resources, documents, and settings in this computer's browser using `localStorage`.

That means:

- Updating the website files should not erase their data.
- Their data is tied to the exact website URL and browser they use.
- Before big updates, they should use `Logs & Backups` > `Backup Data (JSON)`.
- If they move to a different computer or browser, they should use `Restore Data`.
- The published site does not allow the old local starter password unless Supabase is configured.

With Supabase configured:

- Staff sign in with Supabase Auth.
- Shared app state is stored in the `ministry_app_state` table.
- Only approved staff listed in `ministry_staff` can read or write the shared state.
- JSON backups are still recommended before major changes.

## Safer Update Checklist

Before sending an update:

1. Open the app locally.
2. Confirm staff login still works.
3. Add a test member.
4. Award points and redeem one item.
5. Export a backup JSON.
6. Refresh the page and confirm data is still there.
7. Push the update.
