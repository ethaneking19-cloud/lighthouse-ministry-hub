# Remote Updates Guide

This app is a static offline-first website. The app files can be hosted online so the organization uses one stable web link, while their member/item/activity data stays in that browser's local storage.

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

1. Edit `index.html`, `styles.css`, or `app.js`.
2. Commit and push the changes to GitHub.
3. Netlify automatically rebuilds the site.
4. The organization refreshes their browser to receive the update.

## Important Data Note

The app stores member data, point totals, activity, resources, documents, and settings in the browser using `localStorage`.

That means:

- Updating the website files should not erase their data.
- Their data is tied to the exact website URL and browser they use.
- Before big updates, they should use `Logs & Backups` > `Backup Data (JSON)`.
- If they move to a different computer or browser, they should use `Restore Data`.

## When To Add A Backend

Keep the current local-storage setup if one main computer will manage the ministry data.

Add a backend later if they need:

- Multiple computers sharing the same data.
- Staff accounts across locations.
- Real remote database backups.
- Stronger permissions and audit controls.

Good backend options for a future version are Supabase, Firebase, or Airtable.

## Safer Update Checklist

Before sending an update:

1. Open the app locally.
2. Confirm staff login still works.
3. Add a test member.
4. Award points and redeem one item.
5. Export a backup JSON.
6. Refresh the page and confirm data is still there.
7. Push the update.
