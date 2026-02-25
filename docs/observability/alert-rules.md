# Production Alert Rules Configuration

> **Critical**: Production monitoring and alerting system for marketing websites platform
> **Purpose**: Wake someone up when critical issues occur affecting paying customers
> **Scope**: Error rates, downtime, performance degradation, security incidents
> **Standard**: 2026 observability best practices with multi-tenant awareness

## Alert Philosophy

### Principles

1. **Actionable Alerts**: Every alert must require immediate human action
2. **Customer Impact Focus**: Alert only when paying customers are affected
3. **Escalation Paths**: Clear on-call rotation and escalation procedures
4. **Noise Reduction**: Minimize false positives to prevent alert fatigue

### Alert Tiers

- **P0 - Critical**: Immediate wake-up, revenue-impacting, security breach
- **P1 - High**: Business hours response, performance degradation
- **P2 - Medium**: Next business day, non-critical issues
- **P3 - Low**: Weekly review, informational only

## Critical Alert Rules

### P0 - Immediate Wake-up Alerts

#### 1. Platform-Wide Outage

```yaml
name: 'P0 - Platform Outage'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 10% for 5 minutes'
  - filter: 'url:/api/* OR transaction:page-load'
threshold:
  error_rate: 10%
  duration: 5m
  users_affected: 100
notification:
  channels: [slack_critical, sms_oncall, email_all]
  escalation: 15m -> manager -> 30m -> exec
```

#### 2. Database Connection Failure

```yaml
name: 'P0 - Database Down'
trigger:
  - environment: production
  - event.type: error
  - condition: "error.message CONTAINS 'connection' AND error.count > 5"
  - filter: 'database:supabase'
threshold:
  error_count: 5
  duration: 2m
notification:
  channels: [slack_critical, sms_oncall, pagerduty]
  escalation: 5m -> manager -> 15m -> exec
```

#### 3. Authentication System Failure

```yaml
name: 'P0 - Auth System Down'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 5% for 3 minutes'
  - filter: 'transaction:auth OR url:/api/auth/*'
threshold:
  error_rate: 5%
  duration: 3m
  users_affected: 50
notification:
  channels: [slack_critical, sms_oncall]
  escalation: 10m -> manager -> 30m
```

#### 4. Payment Processing Failure

```yaml
name: 'P0 - Payment Processing Down'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 1% for 2 minutes'
  - filter: 'transaction:payment OR url:/api/stripe/* OR tags:payment_failure'
threshold:
  error_rate: 1%
  duration: 2m
  revenue_impact: true
notification:
  channels: [slack_critical, sms_oncall, email_revenue_team]
  escalation: 5m -> exec -> revenue_team
```

### P1 - High Priority Alerts

#### 5. Performance Degradation

```yaml
name: 'P1 - Performance Degradation'
trigger:
  - environment: production
  - event.type: transaction
  - condition: 'transaction.duration > 2x baseline for 10 minutes'
  - filter: 'transaction:page-load OR transaction:api'
threshold:
  duration_p95: 3000ms # 3 seconds
  baseline_multiplier: 2.0
  duration: 10m
notification:
  channels: [slack_performance, email_oncall]
  escalation: 30m -> manager
```

#### 6. High Error Rate on Critical Pages

```yaml
name: 'P1 - Critical Page Errors'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 2% for 5 minutes'
  - filter: 'url:/checkout OR url:/dashboard OR url:/admin/*'
threshold:
  error_rate: 2%
  duration: 5m
  users_affected: 20
notification:
  channels: [slack_performance, email_oncall]
  escalation: 1h -> manager
```

#### 7. Third-Party Service Outage

```yaml
name: 'P1 - Third-Party Service Down'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 5% for 3 minutes'
  - filter: 'tags:stripe OR tags:supabase OR tags:clerk OR tags:resend'
threshold:
  error_rate: 5%
  duration: 3m
  service_impact: true
notification:
  channels: [slack_performance, email_oncall]
  escalation: 30m -> manager
```

### P2 - Medium Priority Alerts

#### 8. Elevated Error Rate

```yaml
name: 'P2 - Elevated Error Rate'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 1% for 15 minutes'
  - filter: 'NOT tags:ignore'
threshold:
  error_rate: 1%
  duration: 15m
notification:
  channels: [slack_errors]
  escalation: 4h -> team_lead
```

#### 9. Memory Usage High

```yaml
name: 'P2 - High Memory Usage'
trigger:
  - environment: production
  - event.type: metric
  - condition: 'memory.usage > 80% for 10 minutes'
threshold:
  memory_usage: 80%
  duration: 10m
notification:
  channels: [slack_infra]
  escalation: 2h -> infra_team
```

## Multi-Tenant Specific Alerts

#### 10. Enterprise Customer Impact

```yaml
name: 'P0 - Enterprise Customer Impact'
trigger:
  - environment: production
  - event.type: error
  - condition: 'error.rate > 0.5% for 2 minutes'
  - filter: 'tags:customer_type=enterprise OR tags:tenant_id IN (enterprise_list)'
threshold:
  error_rate: 0.5%
  duration: 2m
  customer_impact: enterprise
notification:
  channels: [slack_critical, sms_oncall, email_customer_success]
  escalation: 5m -> exec -> customer_success
```

#### 11. Tenant Isolation Breach

```yaml
name: 'P0 - Tenant Isolation Breach'
trigger:
  - environment: production
  - event.type: error
  - condition: "error.message CONTAINS 'tenant' AND error.level = fatal"
  - filter: 'tags:security OR tags:rls_violation'
threshold:
  error_count: 1
  security_impact: true
notification:
  channels: [slack_security, sms_oncall, email_security_team]
  escalation: immediate -> exec -> security_team
```

## Uptime Monitoring Alerts

#### 12. Website Down

```yaml
name: 'P0 - Website Down'
trigger:
  - type: uptime
  - condition: 'http.status_code != 200 for 2 minutes'
  - filter: 'url:https://*.youragency.com'
threshold:
  status_code: 200
  duration: 2m
notification:
  channels: [slack_critical, sms_oncall]
  escalation: 5m -> manager -> 15m -> exec
```

#### 13. API Endpoint Down

```yaml
name: 'P0 - API Down'
trigger:
  - type: uptime
  - condition: 'http.status_code != 200 for 1 minute'
  - filter: 'url:https://api.youragency.com/*'
threshold:
  status_code: 200
  duration: 1m
notification:
  channels: [slack_critical, sms_oncall]
  escalation: 5m -> manager
```

## Notification Channels

### Slack Channels

- `#alerts-critical` - P0 alerts, immediate response required
- `#alerts-performance` - P1 alerts, performance issues
- `#alerts-errors` - P2 alerts, elevated error rates
- `#alerts-infra` - Infrastructure and deployment issues
- `#alerts-security` - Security incidents and breaches

### Email Distribution Lists

- `oncall@youragency.com` - On-call engineer and manager
- `revenue-team@youragency.com` - Revenue team for payment issues
- `customer-success@youragency.com` - Customer success for enterprise issues
- `security-team@youragency.com` - Security team for security incidents
- `all-engineers@youragency.com` - All engineers for platform outages

### SMS/PagerDuty

- Primary on-call engineer
- Secondary on-call engineer (backup)
- Engineering manager (escalation)
- CTO (executive escalation)

## Alert Suppression Rules

### Maintenance Windows

```yaml
maintenance_suppression:
  - scheduled_deployments: '2h before and after'
  - database_maintenance: 'full window'
  - third_party_outages: 'auto-suppress if vendor reported'
```

### Known Issues

```yaml
known_issues_suppression:
  - issue_id: 'KNOWN-001'
    pattern: 'timeout on third-party API'
    suppression: '24h or until resolved'
  - issue_id: 'KNOWN-002'
    pattern: 'memory spike on large tenant'
    suppression: '48h or until patch deployed'
```

## Alert Quality Metrics

### Target Metrics

- **False Positive Rate**: < 5%
- **Mean Time to Acknowledge (MTTA)**: < 5 minutes (P0), < 30 minutes (P1)
- **Mean Time to Resolution (MTTR)**: < 30 minutes (P0), < 4 hours (P1)
- **Alert Fatigue Score**: < 2 alerts per day per person

### Monitoring

- Weekly alert review meetings
- Monthly alert effectiveness analysis
- Quarterly alert rule optimization
- Annual notification channel review

## Implementation Notes

### Sentry Configuration

- Use environment-specific DSNs
- Configure proper sampling rates
- Set up custom tags for tenant routing
- Implement PII scrubbing for GDPR compliance

### Integration Requirements

- Slack webhook URLs configured
- Email SMTP settings verified
- SMS provider API keys secured
- PagerDuty integration established

### Testing Procedures

- Monthly alert fire drills
- Quarterly escalation path testing
- Annual notification channel verification
- Continuous alert rule validation

---

**Status**: Ready for implementation
**Next Steps**: Configure in Sentry dashboard, test notification channels, document on-call procedures
**Owner**: @observability-team
**Review**: @tech-lead
