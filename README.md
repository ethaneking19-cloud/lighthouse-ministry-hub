# Lighthouse Ministry Hub

Ministry dashboard for members, points, redemptions, volunteers, resources, events, and records.

## How to use
- Open `index.html` in a browser, or serve the folder with a static web server.
- Add people by first and last name.
- Award points for completed tasks.
- Set point costs for items in the Items table.
- Redeem items and the points balance updates automatically.

By default, data is stored locally when opened from this computer. The published site requires `supabase-config.js` to be filled in so staff sign-in and shared app data use Supabase.

## Remote updates

For remote updates, host this folder as a static website. Netlify is recommended because it can auto-deploy whenever you push changes to GitHub.

See `DEPLOYMENT.md` for the setup steps and the data-safety checklist.
