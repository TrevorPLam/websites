---
title: "Real-Time Documentation Monitoring Guide"
description: "Real-time monitoring for documentation covers three distinct concerns: **availability** (is the docs site up?), **content integrity** (have critical pages changed unexpectedly?), and **link health** (..."
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: intermediate
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "real-time", "documentation", "monitoring"]
legacy_path: "real-time-documentation-monitoring.md"
---
# Real-Time Documentation Monitoring Guide

## What to Monitor

Real-time monitoring for documentation covers three distinct concerns: **availability** (is the docs site up?), **content integrity** (have critical pages changed unexpectedly?), and **link health** (have external links in published docs become broken?).[20][21][22]

| Concern | Tool / Approach | Alert Trigger |
|---------|-----------------|---------------|
| Site availability | GitHub Actions + `curl` / Upptime | HTTP non-200 status |
| Response time | Upptime / custom curl timing | > 3s latency |
| Content integrity | Checksum comparison job | Hash mismatch on critical pages |
| Published link health | Scheduled lychee scan | Broken links in deployed site |
| Certificate expiry | `openssl` / curl | < 30 days until cert expiry |

## Option A: Upptime (Full-Featured, Open Source)

Upptime runs entirely on GitHub Actions with no external service required and generates a public status page automatically:[21][20]

```bash
# Use the Upptime template
# 1. Go to https://github.com/upptime/upptime
# 2. Click "Use this template" → create your-org/status
# 3. Edit .upptimerc.yml
```

```yaml
# .upptimerc.yml
owner: your-org
repo: status

sites:
  - name: Documentation Site
    url: https://docs.yourdomain.com
    expectedStatusCodes: [200]
    maxResponseTime: 3000        # ms
    icon: https://docs.yourdomain.com/favicon.ico

  - name: API Reference
    url: https://api.yourdomain.com/docs
    expectedStatusCodes: [200]

  - name: Getting Started Guide
    url: https://docs.yourdomain.com/getting-started
    expectedStatusCodes: [200]

notifications:
  - type: slack
    webhookUrl: $SLACK_WEBHOOK_URL

  - type: github
    # Creates GitHub issues when sites go down
    assignees: ["your-username"]
    labels: ["incident", "critical"]

status-website:
  cname: status.yourdomain.com
  name: "Our Service Status"
  theme: light
```

Upptime commits response time data to your repo's git history and auto-generates graphs and status history.[23][20]

## Option B: Custom GitHub Actions Monitor

For tighter control, implement monitoring directly in GitHub Actions:[22][24]

```yaml
# .github/workflows/docs-monitor.yml
name: "Docs Real-Time Monitor"

on:
  schedule:
    # Every 15 minutes (GitHub's minimum cron interval)
    - cron: "*/15 * * * *"
  workflow_dispatch:

jobs:
  availability:
    name: "Availability Check"
    runs-on: ubuntu-latest
    strategy:
      matrix:
        endpoint:
          - name: "Docs Home"
            url: "https://docs.yourdomain.com"
          - name: "Getting Started"
            url: "https://docs.yourdomain.com/getting-started"
          - name: "API Reference"
            url: "https://docs.yourdomain.com/api"
          - name: "CLI Reference"
            url: "https://docs.yourdomain.com/cli"

    steps:
      - name: Check ${{ matrix.endpoint.name }}
        id: check
        run: |
          START=$(date +%s%3N)
          HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" \
            --max-time 10 \
            --retry 2 \
            --retry-delay 3 \
            "${{ matrix.endpoint.url }}")
          END=$(date +%s%3N)
          LATENCY=$((END - START))

          echo "status=$HTTP_STATUS" >> $GITHUB_OUTPUT
          echo "latency=$LATENCY" >> $GITHUB_OUTPUT
          echo "url=${{ matrix.endpoint.url }}" >> $GITHUB_OUTPUT

          echo "Status: $HTTP_STATUS | Latency: ${LATENCY}ms | URL: ${{ matrix.endpoint.url }}"

          if [ "$HTTP_STATUS" -ne 200 ]; then
            echo "ERROR: Expected 200, got $HTTP_STATUS"
            exit 1
          fi

          if [ "$LATENCY" -gt 5000 ]; then
            echo "WARNING: Response time ${LATENCY}ms exceeds 5000ms threshold"
            exit 1
          fi

      - name: Alert via Slack on failure
        if: failure()
        run: |
          curl -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
            -H "Content-type: application/json" \
            -d '{
              "text": "🚨 *Docs Monitor Alert*",
              "attachments": [{
                "color": "danger",
                "fields": [
                  {"title": "Page", "value": "${{ matrix.endpoint.name }}", "short": true},
                  {"title": "URL", "value": "${{ matrix.endpoint.url }}", "short": true},
                  {"title": "Status", "value": "${{ steps.check.outputs.status }}", "short": true},
                  {"title": "Latency", "value": "${{ steps.check.outputs.latency }}ms", "short": true}
                ]
              }]
            }'

  content-integrity:
    name: "Content Integrity Check"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Fetch and hash critical pages
        run: |
          # Define critical pages and their expected content checksums
          declare -A PAGES=(
            ["getting-started"]="https://docs.yourdomain.com/getting-started"
            ["install"]="https://docs.yourdomain.com/install"
          )

          for PAGE in "${!PAGES[@]}"; do
            URL="${PAGES[$PAGE]}"
            HASH=$(curl -s "$URL" | sha256sum | awk '{print $1}')
            echo "${PAGE}=${HASH}" >> content_hashes.txt
            echo "Hash for ${PAGE}: ${HASH}"
          done

      - name: Compare with baseline
        run: |
          # If a baseline file exists in the repo, compare
          if [ -f ".monitoring/content-baseline.txt" ]; then
            if ! diff -u .monitoring/content-baseline.txt content_hashes.txt; then
              echo "⚠️ Content change detected in critical docs pages"
              # Don't fail on content change — just report it
            fi
          fi

      - name: Update baseline
        if: github.ref == 'refs/heads/main' && github.event_name != 'schedule'
        run: |
          mkdir -p .monitoring
          cp content_hashes.txt .monitoring/content-baseline.txt
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .monitoring/content-baseline.txt
          git diff --staged --quiet || git commit -m "monitoring: update content baseline"
          git push

  ssl-check:
    name: "TLS Certificate Check"
    runs-on: ubuntu-latest
    steps:
      - name: Check certificate expiry
        run: |
          DOMAIN="docs.yourdomain.com"
          EXPIRY=$(echo | openssl s_client -connect "${DOMAIN}:443" -servername "${DOMAIN}" 2>/dev/null \
            | openssl x509 -noout -enddate 2>/dev/null \
            | cut -d= -f2)

          EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRY" +%s)
          NOW_EPOCH=$(date +%s)
          DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

          echo "Certificate expires: $EXPIRY ($DAYS_LEFT days remaining)"

          if [ "$DAYS_LEFT" -lt 30 ]; then
            echo "WARNING: Certificate expires in $DAYS_LEFT days!"
            exit 1
          fi

  published-links:
    name: "Published Link Health"
    runs-on: ubuntu-latest
    # Run this one less frequently — it's network-intensive
    if: ${{ github.event_name == 'workflow_dispatch' || (github.event_name == 'schedule' && contains(github.event.schedule, '0 */6')) }}
    steps:
      - uses: actions/checkout@v4

      - name: Check links in published site
        uses: lycheeverse/lychee-action@v2
        with:
          args: >
            --config .lychee.toml
            --verbose
            https://docs.yourdomain.com
          output: ./published-link-report.md

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: published-link-report
          path: ./published-link-report.md
          retention-days: 30
```

## Alert Routing

Configure multiple alert channels with appropriate severity routing:

```yaml
# Alert routing matrix
# .github/workflows/docs-monitor.yml (notifications section)

# Slack webhook — for all failures (immediate channel notification)
secrets: SLACK_WEBHOOK_URL

# Email via SendGrid — for high-severity (site down > 5 min)
# Use dawidd6/action-send-mail@v3 with secrets:
#   SENDGRID_API_KEY, ALERT_EMAIL_TO, ALERT_EMAIL_FROM

# GitHub Issues — creates an issue with the incident label
# Use actions/github-script to create/close issues automatically
- name: Create GitHub issue on extended outage
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      const issues = await github.rest.issues.listForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: 'incident,docs-outage',
        state: 'open'
      });
      if (issues.data.length === 0) {
        await github.rest.issues.create({
          owner: context.repo.owner,
          repo: context.repo.repo,
          title: '🚨 Documentation site availability incident',
          body: `Monitor detected docs downtime at ${new Date().toISOString()}\n\nWorkflow: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}`,
          labels: ['incident', 'docs-outage', 'critical']
        });
      }
```

## Monitoring Frequency Considerations

GitHub Actions free tier provides 2,000 minutes/month. A workflow running every 15 minutes consumes approximately 2 minutes per run × 4 runs/hour × 24 hours × 30 days = **5,760 minutes/month** if each run takes 2 minutes. Optimize by:

- Using `runs-on: ubuntu-latest` (fastest startup, ~20s)
- Limiting the `availability` job to fast `curl` checks (< 30s per endpoint)
- Running the heavier `published-links` job on a separate, less-frequent cron (every 6 hours)
- Using `concurrency.cancel-in-progress: true` to avoid queuing up runs during incidents

## References

[20] Upptime documentation - https://upptime.js.org/
[21] GitHub Actions monitoring patterns - https://docs.github.com/en/actions
[22] Custom monitoring with GitHub Actions - https://github.blog/2020-08-25-monitoring-with-github-actions/
[23] Upptime status page features - https://upptime.js.org/docs/status-page
[24] GitHub Actions cron scheduling - https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#scheduled-events