$ErrorActionPreference = "Stop"

$repo = "ethaneking19-cloud/lighthouse-ministry-hub"
$projectName = "Lighthouse Ministry Hub Senior Project"
$projectDescription = "Development and project-management plan for Lighthouse Ministry Hub, a web-based ministry operations and member-care management system. Tracks application development, testing, security, documentation, deployment, and final presentation work using fictional or anonymized data."

Write-Host "Checking GitHub authentication..." -ForegroundColor Cyan
gh auth status

Write-Host "Creating labels..." -ForegroundColor Cyan
$labels = @(
  @{ Name = "epic"; Color = "6f42c1"; Description = "Highest-level project goal" },
  @{ Name = "story"; Color = "0366d6"; Description = "User-facing capability within an epic" },
  @{ Name = "task"; Color = "28a745"; Description = "Concrete implementation or verification task" },
  @{ Name = "testing"; Color = "fbca04"; Description = "Testing and verification work" },
  @{ Name = "security"; Color = "d73a4a"; Description = "Security, privacy, or permissions work" },
  @{ Name = "documentation"; Color = "0075ca"; Description = "Documentation and presentation work" }
)
foreach ($label in $labels) {
  $exists = gh label list --repo $repo --limit 100 --json name 2>$null | ConvertFrom-Json | Where-Object { $_.name -eq $label.Name }
  if (-not $exists) {
    gh label create $label.Name --repo $repo --color $label.Color --description $label.Description | Out-Null
  }
}

Write-Host "Creating milestones..." -ForegroundColor Cyan
$milestones = @(
  @{ Title = "Scope and Application Review"; Due = "2026-09-04"; Description = "Review the existing application, confirm project scope, identify remaining features, and create the development/testing plan." },
  @{ Title = "Database and Sample Data"; Due = "2026-09-18"; Description = "Review the database structure, improve member and check-in workflows, and prepare safe fictional sample data." },
  @{ Title = "Points and Redemption Testing"; Due = "2026-10-02"; Description = "Test points, inventory, redemptions, activity history, and follow-up features." },
  @{ Title = "Dashboard and Records"; Due = "2026-10-16"; Description = "Test dashboard tools, events, checklists, reminders, volunteer records, documents, and resources." },
  @{ Title = "Reporting, Security, and Backups"; Due = "2026-10-30"; Description = "Improve reports, validation, correction controls, logs, exports, backups, and restore procedures." },
  @{ Title = "Documentation and Final Review"; Due = "2026-11-13"; Description = "Complete security/privacy review, UI improvements, full workflow testing, and initial final documentation." },
  @{ Title = "Final Testing and Presentation"; Due = "2026-12-04"; Description = "Complete testing, documentation, anonymized demo data, presentation materials, and submission." }
)

$milestoneIds = @{}
foreach ($milestone in $milestones) {
  $allMilestones = gh api "repos/$repo/milestones?state=all&per_page=100" 2>$null | ConvertFrom-Json
  $existing = $allMilestones | Where-Object { $_.title -eq $milestone.Title } | Select-Object -ExpandProperty number -First 1
  if ($existing) {
    $milestoneIds[$milestone.Title] = $existing
    continue
  }
  $body = @{ title = $milestone.Title; description = $milestone.Description; due_on = "$($milestone.Due)T23:59:59Z" } | ConvertTo-Json
  $created = $body | gh api --method POST "repos/$repo/milestones" --input - | ConvertFrom-Json
  $milestoneIds[$milestone.Title] = $created.number
}

function New-Issue {
  param(
    [string]$Title,
    [string]$Body,
    [string]$Label,
    [string]$Milestone
  )
  $allIssues = gh issue list --repo $repo --state all --limit 100 --json title,number 2>$null | ConvertFrom-Json
  $existing = $allIssues | Where-Object { $_.title -eq $Title } | Select-Object -ExpandProperty number -First 1
  if ($existing) {
    Write-Host "Exists: #$existing $Title" -ForegroundColor DarkGray
    return [int]$existing
  }
  $args = @("issue", "create", "--repo", $repo, "--title", $Title, "--body", $Body, "--label", $Label)
  if ($Milestone) { $args += @("--milestone", $Milestone) }
  $url = gh @args
  if ($url -match '/issues/(\d+)$') {
    $number = [int]$Matches[1]
  } else {
    throw "GitHub did not return a valid issue URL for '$Title'. Response: $url"
  }
  Write-Host "Created: #$number $Title" -ForegroundColor Green
  return $number
}

$epics = @(
  @{ Key="members"; Title="Core Member Management"; Milestone="Database and Sample Data"; Stories=@(
    @{ Key="intake"; Title="Member intake and profile management"; Tasks=@("Add fictional members with required validation","Edit and view member profiles","Document member-data privacy expectations") },
    @{ Key="directory"; Title="Member directory and search"; Tasks=@("Add member search, filtering, and sorting","Display organized member records","Test directory behavior with sample data") },
    @{ Key="checkin"; Title="Member check-in and visit history"; Tasks=@("Log member visits","Display last visit and visit history","Identify inactive members and follow-up status") }
  )},
  @{ Key="points"; Title="Points, Inventory, and Redemptions"; Milestone="Points and Redemption Testing"; Stories=@(
    @{ Key="awards"; Title="Point awards and activity history"; Tasks=@("Award preset task points","Add custom point awards with notes","Display member point balances and history") },
    @{ Key="inventory"; Title="Inventory and point-cost management"; Tasks=@("Add categorized inventory items","Update item point costs","Test item and category display") },
    @{ Key="redemption"; Title="Item redemption workflow"; Tasks=@("Redeem one or more items","Prevent insufficient-balance redemptions","Update balances and redemption history") },
    @{ Key="corrections"; Title="Corrections and point protection"; Tasks=@("Remove points with a required reason","Test undo and correction behavior","Record important point changes in activity logs") }
  )},
  @{ Key="operations"; Title="Staff Operations and Records"; Milestone="Dashboard and Records"; Stories=@(
    @{ Key="coordination"; Title="Staff dashboard and coordination"; Tasks=@("Add calendar events","Add event checklist items","Add staff reminders and to-do items") },
    @{ Key="resources"; Title="Community resources"; Tasks=@("Add and search community resources","Store service and contact information","Test resource printing and links") },
    @{ Key="admin"; Title="Administrative records"; Tasks=@("Maintain volunteer records","Upload and list documents","Maintain donor records") }
  )},
  @{ Key="quality"; Title="Reporting, Security, and Deployment"; Milestone="Reporting, Security, and Backups"; Stories=@(
    @{ Key="reports"; Title="Reporting and exports"; Tasks=@("Generate weekly summaries","Print member and activity reports","Export logs to spreadsheets") },
    @{ Key="security"; Title="Authentication and security"; Tasks=@("Configure staff authentication","Record failed or denied administrative actions","Review Supabase access policies") },
    @{ Key="recovery"; Title="Backup, recovery, and documentation"; Tasks=@("Export and restore JSON backups","Test safety-backup recovery","Document setup, deployment, privacy, and user instructions") },
    @{ Key="final"; Title="Final testing and presentation"; Tasks=@("Complete privacy and security review","Prepare anonymized demo data","Demonstrate check-in, points, redemption, reporting, and recovery") }
  )}
)

$epicNumbers = @{}
$storyNumbers = @{}
foreach ($epic in $epics) {
  $epicBody = "## Epic goal`n`nDeliver the $($epic.Title.ToLower()) capabilities for Lighthouse Ministry Hub.`n`nThis epic is part of the senior-project plan and should use fictional or anonymized data only.`n`n### Stories`n" + (($epic.Stories | ForEach-Object { "- [ ] $($_.Title)" }) -join "`n")
  $epicNumbers[$epic.Key] = New-Issue -Title "[Epic] $($epic.Title)" -Body $epicBody -Label "epic" -Milestone $epic.Milestone

  foreach ($story in $epic.Stories) {
    $storyBody = "## Story`n`nImplement **$($story.Title)** as part of the **[Epic] $($epic.Title)** epic.`n`n### Tasks`n" + (($story.Tasks | ForEach-Object { "- [ ] $_" }) -join "`n") + "`n`nParent epic: #$($epicNumbers[$epic.Key])"
    $storyNumbers[$story.Key] = New-Issue -Title "[Story] $($story.Title)" -Body $storyBody -Label "story" -Milestone $epic.Milestone

    foreach ($task in $story.Tasks) {
      $taskBody = "## Task`n`nComplete this task for **[Story] $($story.Title)**.`n`nParent story: #$($storyNumbers[$story.Key])`n`nUse fictional or anonymized data and document verification results where appropriate."
      New-Issue -Title "[Task] $task" -Body $taskBody -Label "task" -Milestone $epic.Milestone | Out-Null
    }
  }
}

Write-Host "`nGitHub issue hierarchy created." -ForegroundColor Green
Write-Host "Next: create a GitHub Project named '$projectName' and add all repository issues." -ForegroundColor Cyan
Write-Host "Project description:`n$projectDescription" -ForegroundColor Gray
Write-Host "Repository: https://github.com/$repo" -ForegroundColor Cyan
