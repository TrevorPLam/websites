#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Automated validation and quality assurance for domains
.DESCRIPTION
    Comprehensive validation including tests, linting, build, and quality checks
.PARAMETER Domain
    Target domain number (1-36) or 'All' for all domains
.PARAMETER Tests
    Run test suite validation
.PARAMETER Lint
    Run linting validation
.PARAMETER Build
    Run build validation
.EXAMPLE
    ./scripts/validate-domain.ps1 -Domain 8 -Tests -Lint -Build
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$false)]
    [switch]$Tests,
    
    [Parameter(Mandatory=$false)]
    [switch]$Lint,
    
    [Parameter(Mandatory=$false)]
    [switch]$Build
)

$basePath = "c:/dev/marketing-websites"
$validationResults = @()

function Test-DomainTasks($domainNum) {
    $domainPath = "$basePath/tasks/domain-$domainNum"
    $tasks = Get-ChildItem -Path $domainPath -Filter "DOMAIN-$domainNum-*.md" -ErrorAction SilentlyContinue
    
    $taskResults = @()
    foreach ($task in $tasks) {
        $taskContent = Get-Content $task.FullName -Raw
        $status = ($taskContent | Select-String "status: (.*)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
        $taskId = ($taskContent | Select-String "id: (.*)" | ForEach-Object { $_.Matches[0].Groups[1].Value })
        
        $taskResults += [PSCustomObject]@{
            TaskId = $taskId
            Status = $status
            File = $task.Name
            Path = $task.FullName
        }
    }
    return $taskResults
}

function Test-PackageBuild($domainNum) {
    $packagePath = "$basePath/packages"
    $relevantPackages = @()
    
    # Find packages related to this domain
    switch ($domainNum) {
        1 { $relevantPackages = @("config", "typescript-config", "eslint-config") }
        2 { $relevantPackages = @("config-schema") }
        3 { $relevantPackages = @("features", "shared") }
        4 { $relevantPackages = @("auth", "middleware") }
        5 { $relevantPackages = @("performance", "seo") }
        6 { $relevantPackages = @("database", "cache") }
        7 { $relevantPackages = @("multi-tenant", "billing") }
        8 { $relevantPackages = @("seo", "metadata") }
        default { $relevantPackages = @() }
    }
    
    $buildResults = @()
    foreach ($package in $relevantPackages) {
        $packagePath = "$basePath/packages/$package"
        if (Test-Path $packagePath) {
            try {
                Set-Location $packagePath
                $buildResult = pnpm build 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $buildResults += [PSCustomObject]@{
                        Package = $package
                        Status = "Success"
                        Output = "Build completed successfully"
                    }
                } else {
                    $buildResults += [PSCustomObject]@{
                        Package = $package
                        Status = "Failed"
                        Output = $buildResult
                    }
                }
            } catch {
                $buildResults += [PSCustomObject]@{
                    Package = $package
                    Status = "Error"
                    Output = $_.Exception.Message
                }
            }
        }
    }
    return $buildResults
}

function Test-PackageLint($domainNum) {
    $packagePath = "$basePath/packages"
    $relevantPackages = @()
    
    # Same logic as build for relevant packages
    switch ($domainNum) {
        1 { $relevantPackages = @("config", "typescript-config", "eslint-config") }
        2 { $relevantPackages = @("config-schema") }
        3 { $relevantPackages = @("features", "shared") }
        4 { $relevantPackages = @("auth", "middleware") }
        5 { $relevantPackages = @("performance", "seo") }
        6 { $relevantPackages = @("database", "cache") }
        7 { $relevantPackages = @("multi-tenant", "billing") }
        8 { $relevantPackages = @("seo", "metadata") }
        default { $relevantPackages = @() }
    }
    
    $lintResults = @()
    foreach ($package in $relevantPackages) {
        $packagePath = "$basePath/packages/$package"
        if (Test-Path $packagePath) {
            try {
                Set-Location $packagePath
                $lintResult = pnpm lint 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $lintResults += [PSCustomObject]@{
                        Package = $package
                        Status = "Success"
                        Output = "Linting passed"
                    }
                } else {
                    $lintResults += [PSCustomObject]@{
                        Package = $package
                        Status = "Failed"
                        Output = $lintResult
                    }
                }
            } catch {
                $lintResults += [PSCustomObject]@{
                    Package = $package
                    Status = "Error"
                    Output = $_.Exception.Message
                }
            }
        }
    }
    return $lintResults
}

function Test-PackageTests($domainNum) {
    $packagePath = "$basePath/packages"
    $relevantPackages = @()
    
    # Same logic as build for relevant packages
    switch ($domainNum) {
        1 { $relevantPackages = @("config", "typescript-config", "eslint-config") }
        2 { $relevantPackages = @("config-schema") }
        3 { $relevantPackages = @("features", "shared") }
        4 { $relevantPackages = @("auth", "middleware") }
        5 { $relevantPackages = @("performance", "seo") }
        6 { $relevantPackages = @("database", "cache") }
        7 { $relevantPackages = @("multi-tenant", "billing") }
        8 { $relevantPackages = @("seo", "metadata") }
        default { $relevantPackages = @() }
    }
    
    $testResults = @()
    foreach ($package in $relevantPackages) {
        $packagePath = "$basePath/packages/$package"
        if (Test-Path $packagePath) {
            try {
                Set-Location $packagePath
                $testResult = pnpm test 2>&1
                if ($LASTEXITCODE -eq 0) {
                    $testResults += [PSCustomObject]@{
                        Package = $package
                        Status = "Success"
                        Output = "Tests passed"
                    }
                } else {
                    $testResults += [PSCustomObject]@{
                        Package = $package
                        Status = "Failed"
                        Output = $testResult
                    }
                }
            } catch {
                $testResults += [PSCustomObject]@{
                    Package = $package
                    Status = "Error"
                    Output = $_.Exception.Message
                }
            }
        }
    }
    return $testResults
}

function Get-DomainSummary($domainNum) {
    $tasks = Test-DomainTasks $domainNum
    $totalTasks = $tasks.Count
    $completedTasks = ($tasks | Where-Object { $_.Status -eq "done" }).Count
    $pendingTasks = ($tasks | Where-Object { $_.Status -eq "pending" }).Count
    $inProgressTasks = ($tasks | Where-Object { $_.Status -eq "in-progress" }).Count
    
    return [PSCustomObject]@{
        Domain = $domainNum
        TotalTasks = $totalTasks
        Completed = $completedTasks
        InProgress = $inProgressTasks
        Pending = $pendingTasks
        CompletionRate = if ($totalTasks -gt 0) { [math]::Round($completedTasks/$totalTasks*100, 1) } else { 0 }
    }
}

# Main execution
Write-Host "Domain Validation System" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

if ($Domain -eq "All") {
    $targetDomains = 1..36
} else {
    $targetDomains = @([int]$Domain)
}

foreach ($targetDomain in $targetDomains) {
    $domainPath = "$basePath/tasks/domain-$targetDomain"
    if (-not (Test-Path $domainPath)) {
        Write-Host "Domain $targetDomain not found, skipping..." -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`nValidating Domain $targetDomain" -ForegroundColor Cyan
    Write-Host "----------------------" -ForegroundColor Gray
    
    # Get domain summary
    $summary = Get-DomainSummary $targetDomain
    Write-Host "Tasks: $($summary.TotalTasks) total, $($summary.Completed) completed, $($summary.InProgress) in progress, $($summary.Pending) pending" -ForegroundColor White
    Write-Host "Completion Rate: $($summary.CompletionRate)%" -ForegroundColor White
    
    # Run validations
    if ($Tests) {
        Write-Host "`nRunning tests..." -ForegroundColor Yellow
        $testResults = Test-PackageTests $targetDomain
        foreach ($result in $testResults) {
            $color = if ($result.Status -eq "Success") { "Green" } else { "Red" }
            Write-Host "  $($result.Package): $($result.Status)" -ForegroundColor $color
        }
    }
    
    if ($Lint) {
        Write-Host "`nRunning linting..." -ForegroundColor Yellow
        $lintResults = Test-PackageLint $targetDomain
        foreach ($result in $lintResults) {
            $color = if ($result.Status -eq "Success") { "Green" } else { "Red" }
            Write-Host "  $($result.Package): $($result.Status)" -ForegroundColor $color
        }
    }
    
    if ($Build) {
        Write-Host "`nRunning builds..." -ForegroundColor Yellow
        $buildResults = Test-PackageBuild $targetDomain
        foreach ($result in $buildResults) {
            $color = if ($result.Status -eq "Success") { "Green" } else { "Red" }
            Write-Host "  $($result.Package): $($result.Status)" -ForegroundColor $color
        }
    }
    
    # Store results for summary
    $validationResults += [PSCustomObject]@{
        Domain = $targetDomain
        Summary = $summary
        TestResults = if ($Tests) { $testResults } else { @() }
        LintResults = if ($Lint) { $lintResults } else { @() }
        BuildResults = if ($Build) { $buildResults } else { @() }
    }
}

# Generate summary report
Write-Host "`nValidation Summary" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

$totalDomains = $validationResults.Count
$completedDomains = ($validationResults | Where-Object { $_.Summary.CompletionRate -eq 100 }).Count
$averageCompletion = ($validationResults | Measure-Object -Property Summary.CompletionRate -Average).Average

Write-Host "Domains Validated: $totalDomains" -ForegroundColor White
Write-Host "Fully Completed: $completedDomains" -ForegroundColor White
Write-Host "Average Completion: $([math]::Round($averageCompletion, 1))%" -ForegroundColor White

# Export results
$timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
$reportPath = "$basePath/docs/validation-reports/domain-validation-$timestamp.json"
$validationResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath

Write-Host "`nDetailed report saved to: $reportPath" -ForegroundColor Cyan

Set-Location $basePath
