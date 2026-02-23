#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Update TODO.md with all tasks from all domains
.DESCRIPTION
    Scans all domain directories and updates TODO.md with complete task list
.EXAMPLE
    ./scripts/update-todo-all-domains.ps1
#>

$basePath = "c:/dev/marketing-websites"
$todoPath = "$basePath/TODO.md"

# Function to get domain title from first task
function Get-DomainTitle($domainNum) {
    $domainPath = "$basePath/tasks/domain-$domainNum"
    $firstTask = Get-ChildItem -Path $domainPath -Filter "DOMAIN-$domainNum-*.md" | Select-Object -First 1

    if ($firstTask) {
        $content = Get-Content $firstTask.FullName -TotalCount 20
        $titleLine = $content | Select-String "^title: " | Select-Object -First 1
        if ($titleLine) {
            $title = $titleLine.Line -replace "title: " -replace "'" -replace '"'
            # Extract domain area from title
            if ($title -match "^(.*?):") {
                return $matches[1].ToUpper()
            }
        }
    }

    # Fallback domain titles
    $domainTitles = @{
        9 = "TESTING & CI"
        10 = "BILLING"
        11 = "BOOKING"
        12 = "CRM"
        13 = "INTEGRATIONS"
        14 = "THIRD-PARTY"
        15 = "CMS"
        16 = "FEATURES"
        17 = "ONBOARDING"
        18 = "ADMIN"
        19 = "CALENDAR"
        20 = "COMMUNICATION"
        21 = "UPLOADS"
        22 = "AI & CHAT"
        23 = "SEO ADVANCED"
        24 = "REALTIME"
        25 = "A/B TESTING"
        26 = "TESTING"
        27 = "SERVICES"
        28 = "BLOG"
        29 = "SETTINGS"
        30 = "DOMAINS"
        31 = "PWA"
        32 = "PDF"
        33 = "PRIVACY"
        34 = "WHITE LABEL"
        35 = "PERFORMANCE"
        36 = "DEPLOYMENT"
    }

    return $domainTitles[[int]$domainNum]
}

# Function to get task info
function Get-TaskInfo($taskFile) {
    $content = Get-Content $taskFile.FullName -Raw
    $status = ($content | Select-String "status: (.*)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
    $title = ($content | Select-String "^title: " | ForEach-Object { $_.Line -replace "title: " -replace "'" -replace '"' })

    return @{
        File = $taskFile.Name
        Status = $status
        Title = $title
        Path = $taskFile.FullName
    }
}

# Scan all domains and collect tasks
Write-Host "Scanning all domains for tasks..." -ForegroundColor Green

$allDomains = @()
for ($i = 1; $i -le 36; $i++) {
    $domainPath = "$basePath/tasks/domain-$i"
    if (Test-Path $domainPath) {
        $tasks = Get-ChildItem -Path $domainPath -Filter "DOMAIN-$i-*.md"
        $taskInfo = @()

        foreach ($task in $tasks | Sort-Object Name) {
            $taskInfo += Get-TaskInfo $task
        }

        $domainTitle = Get-DomainTitle $i
        $completedCount = ($taskInfo | Where-Object { $_.Status -eq "done" }).Count
        $totalCount = $taskInfo.Count

        $allDomains += [PSCustomObject]@{
            Number = $i
            Title = $domainTitle
            Tasks = $taskInfo
            Completed = $completedCount
            Total = $totalCount
        }
    }
}

# Generate new TODO.md content
Write-Host "Generating new TODO.md content..." -ForegroundColor Green

$newTodo = @"
# TODO: Multi-Client Multi-Site Monorepo Tasks

This file provides a consolidated, checkable task list of all domain tasks across the monorepo.

## Task Status Overview

| Domain    | Total Tasks | Completed | In Progress | Pending |
| --------- | ----------- | --------- | ----------- | ------- |
"@

# Add table rows
$totalTasks = 0
$totalCompleted = 0
$totalInProgress = 0
$totalPending = 0

foreach ($domain in $allDomains | Sort-Object Number) {
    $inProgress = ($domain.Tasks | Where-Object { $_.Status -eq "in-progress" }).Count
    $pending = ($domain.Tasks | Where-Object { $_.Status -eq "pending" }).Count

    $newTodo += "| Domain $($domain.Number.ToString().PadLeft(2, '0'))  | $($domain.Total.ToString().PadLeft(3, ' '))           | $($domain.Completed.ToString().PadLeft(3, ' '))         | $($inProgress.ToString().PadLeft(3, ' '))           | $($pending.ToString().PadLeft(3, ' '))       |` + "`n"

    $totalTasks += $domain.Total
    $totalCompleted += $domain.Completed
    $totalInProgress += $inProgress
    $totalPending += $pending
}

$newTodo += "| **Total** | **$($totalTasks.ToString().PadLeft(3, ' '))**      | **$($totalCompleted.ToString().PadLeft(3, ' '))**    | **$($totalInProgress.ToString().PadLeft(3, ' '))**       | **$($totalPending.ToString().PadLeft(3, ' '))**  |`r`n"
$newTodo += "`r`n"

# Add domain sections
foreach ($domain in $allDomains | Sort-Object Number) {
    $statusIcon = if ($domain.Completed -eq $domain.Total) { "✅ COMPLETE" }
                  elseif ($domain.Completed -gt 0) { "🔄 IN PROGRESS" }
                  else { "🔄 PENDING" }

    $newTodo += "## Domain $($domain.Number.ToString().PadLeft(2, '0')): $($domain.Title) $statusIcon`n`n"

    foreach ($task in $domain.Tasks) {
        $checkbox = if ($task.Status -eq "done") { "[x]" } else { "[ ]" }
        $relativePath = $task.Path -replace [regex]::Escape($basePath + "\"), ""
        $taskTitle = $task.Title -replace "^DOMAIN-$($domain.Number)-\d+: " -replace "^DOMAIN-$($domain.Number)-\d+-"

        $newTodo += "- $checkbox [$($task.File -replace '\.md$')](tasks/domain-$($domain.Number)/$($task.File)) - $taskTitle`n"
    }

    $newTodo += "`n"
}

# Add guidelines section
$newTodo += @"
## Task Execution Guidelines

### Task Status Updates

When working on a task:

1. Update the task file status in the YAML frontmatter (`pending` → `in-progress` → `done`)
2. Update this TODO.md file to reflect the status change
3. Add completion notes to the task file if needed

### Task Completion Criteria

A task is considered **complete** when:

- All acceptance criteria in the task file are met
- The implementation is tested and verified
- Documentation is updated
- The task file status is set to `done`

### Priority Execution Order

1. **P0 (Critical)**: Foundation & Infrastructure (Domains 1-8)
2. **P1 (High)**: Core Features (Domains 9-20)
3. **P2 (Medium)**: Advanced Features (Domains 21-36)

---

_Last updated: $(Get-Date -Format 'yyyy-MM-dd')_
_Total tasks: $totalTasks_
_Completed: $totalCompleted ($([math]::Round($totalCompleted/$totalTasks*100, 1))%)_
_Remaining: $($totalTasks - $totalCompleted) ($([math]::Round(($totalTasks - $totalCompleted)/$totalTasks*100, 1))%)_
"@

# Backup original TODO.md
$backupPath = "$basePath/TODO.md.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $todoPath $backupPath
Write-Host "Backup created: $backupPath" -ForegroundColor Yellow

# Write new TODO.md
$newTodo | Out-File -FilePath $todoPath -Encoding UTF8
Write-Host "Updated TODO.md with all $totalTasks tasks across $($allDomains.Count) domains" -ForegroundColor Green

# Show summary
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Domains: $($allDomains.Count)" -ForegroundColor White
Write-Host "Total Tasks: $totalTasks" -ForegroundColor White
Write-Host "Completed: $totalCompleted" -ForegroundColor Green
Write-Host "In Progress: $totalInProgress" -ForegroundColor Yellow
Write-Host "Pending: $totalPending" -ForegroundColor Red

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the updated TODO.md" -ForegroundColor Yellow
Write-Host "2. Begin implementing tasks starting with highest priority domains" -ForegroundColor Yellow
Write-Host "3. Update task statuses as you complete them" -ForegroundColor Yellow
