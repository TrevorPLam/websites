# Script to extract domain content from PLAN.md
# This script will read the main PLAN.md and extract each domain into separate files

$planFile = "c:\dev\marketing-websites\docs\PLAN.md"
$baseDir = "c:\dev\marketing-websites\docs\plan"

# Read the entire file
$content = Get-Content $planFile -Raw

# Split by domain headers
$domains = $content -split "(?=\n## DOMAIN \d+:)"

# Process each domain
foreach ($domain in $domains) {
    if ($domain -match "## DOMAIN (\d+): (.+)") {
        $domainNum = $matches[1]
        $domainTitle = $matches[2]

        # Clean up the domain title for filename
        $cleanTitle = $domainTitle -replace "[^a-zA-Z0-9\s-]", "" -replace "\s+", "-" -replace "--+", "-"
        $domainDir = "$baseDir\domain-$domainNum"

        Write-Host "Processing Domain $domainNum`: $domainTitle"

        # Extract sections within this domain
        $sections = $domain -split "(?=\n### \d+\.\d+)"

        $sectionFiles = @()
        $readmeLinks = @()

        foreach ($section in $sections) {
            if ($section -match "### (\d+)\.(\d+) (.+)") {
                $mainNum = $matches[1]
                $subNum = $matches[2]
                $sectionTitle = $matches[3]

                # Clean section title for filename
                $cleanSectionTitle = $sectionTitle -replace "[^a-zA-Z0-9\s-]", "" -replace "\s+", "-" -replace "--+", "-"
                $filename = "$($mainNum).$($subNum)-$cleanSectionTitle.md"
                $filepath = "$domainDir\$filename"

                # Write section content
                $sectionContent = $section.Trim()
                $sectionContent | Out-File -FilePath $filepath -Encoding UTF8

                $sectionFiles += $filename
                $readmeLinks += "- [$($mainNum).$($subNum) $sectionTitle]($filename)"

                Write-Host "  Created: $filename"
            }
        }

        # Create README for this domain
        $readmeContent = @"
# Domain $domainNum`: $domainTitle

## Overview

This domain covers $($sectionTitle.ToLower()) aspects of the marketing-first multi-client multi-site monorepo.

## Sections

$($readmeLinks -join "`n")

## Priority

**P0 (Week 1)** — Foundation for entire platform.

## Dependencies

None - this is the foundational domain that all other domains depend on.
"@

        $readmeContent | Out-File -FilePath "$domainDir\README.md" -Encoding UTF8
        Write-Host "Created README for Domain $domainNum"
    }
}

Write-Host "Domain extraction complete!"
