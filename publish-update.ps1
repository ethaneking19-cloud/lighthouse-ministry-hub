param(
  [string]$Message = "Update Lighthouse Ministry Hub"
)

$ErrorActionPreference = "Stop"

git add .gitignore README.md DEPLOYMENT.md netlify.toml index.html styles.css app.js supabase-config.js lighthouse-supabase-setup.sql lighthouse-banner.png mammoth.browser.min.js xlsx.full.min.js publish-update.ps1

$changes = git diff --cached --name-only
if (-not $changes) {
  Write-Host "No app changes to publish."
  exit 0
}

git commit -m $Message
git push

Write-Host "Published update. Netlify will deploy it automatically."
