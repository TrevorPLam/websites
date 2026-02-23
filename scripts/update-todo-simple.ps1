#!/usr/bin/env pwsh

$basePath = "c:/dev/marketing-websites"
$todoPath = "$basePath/TODO.md"

Write-Host "Scanning all domains for tasks..." -ForegroundColor Green

# Collect all domain data
$domains = @()
for ($i = 1; $i -le 36; $i++) {
    $domainPath = "$basePath/tasks/domain-$i"
    if (Test-Path $domainPath) {
        $tasks = Get-ChildItem -Path $domainPath -Filter "DOMAIN-$i-*.md" | Sort-Object Name
        $domainData = @{
            Number = $i
            Tasks = @()
            Completed = 0
            Total = $tasks.Count
        }

        foreach ($task in $tasks) {
            $content = Get-Content $task.FullName -Raw
            $status = ($content | Select-String "status: (.*)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
            $title = ($content | Select-String "^title: " | ForEach-Object { $_.Line -replace "title: " -replace "'" -replace '"' })

            $domainData.Tasks += @{
                File = $task.Name
                Status = $status
                Title = $title
                Path = $task.FullName
            }

            if ($status -eq "done") { $domainData.Completed++ }
        }

        $domains += $domainData
    }
}

# Generate TODO content
$todoContent = @"
# TODO: Multi-Client Multi-Site Monorepo Tasks

This file provides a consolidated, checkable task list of all domain tasks across the monorepo.

## Task Status Overview

| Domain    | Total Tasks | Completed | In Progress | Pending |
| --------- | ----------- | --------- | ----------- | ------- |
"@

# Add table rows
$totalTasks = 0
$totalCompleted = 0
$totalPending = 0

foreach ($domain in $domains) {
    $pending = $domain.Total - $domain.Completed
    $todoContent += "| Domain $($domain.Number.ToString().PadLeft(2, '0'))  | $($domain.Total.ToString().PadLeft(3, ' '))           | $($domain.Completed.ToString().PadLeft(3, ' '))         | 0           | $($pending.ToString().PadLeft(3, ' '))       |`r`n"

    $totalTasks += $domain.Total
    $totalCompleted += $domain.Completed
    $totalPending += $pending
}

$todoContent += "| **Total** | **$($totalTasks.ToString().PadLeft(3, ' '))**      | **$($totalCompleted.ToString().PadLeft(3, ' '))**    | **0**       | **$($totalPending.ToString().PadLeft(3, ' '))**  |`r`n`r`n"

# Add domain sections
foreach ($domain in $domains) {
    $statusIcon = if ($domain.Completed -eq $domain.Total) { "✅ COMPLETE" }
                  elseif ($domain.Completed -gt 0) { "🔄 IN PROGRESS" }
                  else { "🔄 PENDING" }

    $domainTitle = "DOMAIN $($domain.Number)"
    $todoContent += "## DOMAIN $($domain.Number): $statusIcon`r`n`r`n"

    foreach ($task in $domain.Tasks) {
        $checkbox = if ($task.Status -eq "done") { "[x]" } else { "[ ]" }
        $taskTitle = $task.Title -replace "^DOMAIN-$($domain.Number)-\d+: " -replace "^DOMAIN-$($domain.Number)-\d+-"

        $todoContent += "- $checkbox [DOMAIN-$($domain.Number)-$($task.File -replace '\.md$')](tasks/domain-$($domain.Number)/$($task.File)) - $taskTitle`r`n"
    }

    $todoContent += "`r`n"
}

# Add footer
$todoContent += @"
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

---

_Last updated: $(Get-Date -Format 'yyyy-MM-dd')_
_Total tasks: $totalTasks_
_Completed: $totalCompleted ($([math]::Round($totalCompleted/$totalTasks*100, 1))%)_
_Remaining: $totalPending ($([math]::Round($totalPending/$totalTasks*100, 1))%)_
"@

# Backup and update
$backupPath = "$basePath/TODO.md.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $todoPath $backupPath
$todoContent | Out-File -FilePath $todoPath -Encoding UTF8

Write-Host "Updated TODO.md with all $totalTasks tasks across $($domains.Count) domains" -ForegroundColor Green
Write-Host "Backup created: $backupPath" -ForegroundColor Yellow
