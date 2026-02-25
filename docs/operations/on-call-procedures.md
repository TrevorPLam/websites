# On-Call Procedures and Escalation Paths

> **Critical**: Emergency response procedures for production incidents
> **Purpose**: Wake someone up when critical issues occur affecting paying customers
> **Scope**: P0/P1 alerts, security incidents, revenue-impacting issues
> **Standard**: 2026 incident response best practices

## On-Call Structure

### Primary Roles

- **Primary On-Call Engineer**: First responder, 24/7 availability required
- **Secondary On-Call Engineer**: Backup, escalates after 15 minutes
- **Engineering Manager**: Escalation point, business decisions
- **CTO/Executive**: Critical escalations, revenue impact > $10K/hour

### Rotation Schedule

- **Weekly Rotation**: Changes every Monday at 09:00 UTC
- **Handoff Period**: 30-minute overlap for knowledge transfer
- **Coverage Gaps**: No gaps allowed, must arrange backup for time off
- **Time Zone Considerations**: Primary and secondary in different time zones

## Alert Triage Process

### P0 - Critical Alerts (Immediate Wake-up)

#### Response Time Requirements

- **Acknowledge**: < 5 minutes from alert
- **Initial Assessment**: < 10 minutes from alert
- **Mitigation Started**: < 15 minutes from alert
- **Resolution**: < 30 minutes for simple issues, < 2 hours for complex

#### Triage Steps

1. **Immediate Assessment** (0-5 minutes)
   - Read alert details and affected services
   - Check Sentry for related issues
   - Verify customer impact (are paying customers affected?)

2. **Quick Mitigation** (5-15 minutes)
   - Can we rollback recent deployment?
   - Can we restart affected services?
   - Can we disable failing feature?
   - Can we scale up resources?

3. **Communication** (15-30 minutes)
   - Update Slack channel with status
   - Inform manager of customer impact
   - Document in incident log

4. **Resolution Planning** (30+ minutes)
   - Root cause investigation
   - Permanent fix implementation
   - Post-mortem preparation

### P1 - High Priority Alerts (Business Hours)

#### Response Time Requirements

- **Acknowledge**: < 30 minutes during business hours
- **Initial Assessment**: < 1 hour
- **Resolution**: < 4 hours

#### Triage Steps

1. **Assessment** (0-30 minutes)
   - Review alert context
   - Check for related issues
   - Determine business impact

2. **Planning** (30-60 minutes)
   - Plan resolution approach
   - Coordinate with team if needed
   - Schedule fix if complex

3. **Resolution** (1-4 hours)
   - Implement fix
   - Monitor for recurrence
   - Update documentation

## Escalation Paths

### Automatic Escalation Triggers

- **No Response**: 15 minutes after P0 alert
- **No Progress**: 1 hour after P0 alert without mitigation
- **Revenue Impact**: Any confirmed revenue loss > $1K/hour
- **Security Incident**: Any confirmed security breach

### Escalation Flow

#### Level 1: Primary On-Call → Secondary On-Call

- **Trigger**: No response to P0 alert within 15 minutes
- **Method**: SMS + Phone call
- **Expected Response**: < 5 minutes

#### Level 2: Secondary → Engineering Manager

- **Trigger**: No response from secondary within 10 minutes
- **Method**: Phone call + Slack @mention
- **Expected Response**: < 15 minutes

#### Level 3: Manager → CTO/Executive

- **Trigger**: Revenue impact > $10K/hour or security breach
- **Method**: Phone call + Email
- **Expected Response**: < 30 minutes

#### Level 4: Executive → Crisis Team

- **Trigger**: Platform-wide outage > 1 hour
- **Method**: Conference call + War room
- **Expected Response**: Immediate

## Communication Procedures

### Internal Communication

#### Slack Channels

- `#incidents`: All incident discussion
- `#alerts-critical`: P0 alert notifications only
- `#alerts-performance`: P1 performance issues
- `#leadership`: Executive escalations only

#### Communication Templates

**Initial Incident Report** (within 15 minutes of P0):

```
🚨 INCIDENT DECLARED

**Time**: [timestamp]
**Severity**: P0
**Impact**: [affected services/customers]
**Status**: [investigating/mitigating/resolved]
**On-Call**: [@primary] [@secondary]

**Summary**: [brief description]
**Next Steps**: [immediate actions]

#incident-XXX
```

**Status Updates** (every 15 minutes during P0):

```
📊 INCIDENT UPDATE - #incident-XXX

**Status**: [investigating/mitigating/resolved]
**Time Elapsed**: [X minutes]
**Customer Impact**: [yes/no, details]
**Latest Findings**: [what we know]
**Next ETA**: [estimated resolution time]

**Actions Taken**:
- [action 1]
- [action 2]
```

**Resolution Report** (within 1 hour of resolution):

```
✅ INCIDENT RESOLVED - #incident-XXX

**Resolution Time**: [timestamp]
**Total Duration**: [X hours Y minutes]
**Root Cause**: [technical explanation]
**Customer Impact**: [number affected, duration]
**Resolution**: [what was fixed]

**Prevention**:
- [immediate prevention]
- [long-term fixes]

**Post-Mortem**: Scheduled for [date/time]
```

### External Communication

#### Customer Communication Triggers

- **Downtime > 15 minutes**: Status page update
- **Revenue Impact**: Customer email notification
- **Data Breach**: Legal compliance notifications

#### Communication Channels

- **Status Page**: status.youragency.com
- **Customer Email**: For paying customers only
- **Twitter/X**: For public incidents
- **Direct Support**: For enterprise customers

## Common Incident Scenarios

### Database Issues

**Symptoms**: Connection errors, slow queries, timeouts
**Immediate Actions**:

1. Check database metrics in Supabase dashboard
2. Restart application servers if connection pool exhausted
3. Scale up database if CPU/memory high
4. Rollback recent database migrations if needed

**Escalation**: Manager if > 10 minutes of downtime

### Authentication Failures

**Symptoms**: Login errors, session issues, auth API failures
**Immediate Actions**:

1. Check Clerk/Supabase auth status
2. Restart auth services
3. Clear session cache if corrupted
4. Disable auth features if security risk

**Escalation**: Manager if > 5 minutes of auth downtime

### Payment Processing Issues

**Symptoms**: Stripe failures, checkout errors, revenue loss
**Immediate Actions**:

1. Check Stripe status page
2. Verify API keys and webhooks
3. Enable backup payment method if available
4. Pause checkout if security concern

**Escalation**: Executive if > $1K/hour revenue loss

### Performance Degradation

**Symptoms**: Slow page loads, high latency, timeout errors
**Immediate Actions**:

1. Check Vercel deployment status
2. Scale up edge functions if needed
3. Enable caching if possible
4. Rollback recent deployment

**Escalation**: Manager if > 1 hour of degraded performance

## Emergency Contacts

### On-Call Engineers

- **Primary**: [Phone number] - SMS and voice
- **Secondary**: [Phone number] - SMS and voice
- **Backup**: [Phone number] - SMS and voice

### Management

- **Engineering Manager**: [Phone number]
- **CTO**: [Phone number]
- **CEO**: [Phone number] (executive escalations only)

### External Services

- **Supabase Support**: [phone/email] - database issues
- **Vercel Support**: [phone/email] - deployment issues
- **Stripe Support**: [phone/email] - payment issues
- **Clerk Support**: [phone/email] - auth issues

## Tools and Access

### Required Access

- **Sentry**: Full admin access to all projects
- **Vercel**: Deployment and configuration access
- **Supabase**: Database and auth admin access
- **Slack**: All incident channels
- **Status Page**: Update permissions

### Monitoring Dashboards

- **Sentry**: sentry.io/organization/project
- **Vercel**: vercel.com/dashboard
- **Supabase**: supabase.com/dashboard
- **Custom**: internal monitoring dashboard

### Emergency Scripts

- **Rollback**: `pnpm rollback-deployment`
- **Restart**: `pnpm restart-services`
- **Scale**: `pnpm scale-resources`
- **Status**: `pnpm health-check`

## Post-Incident Procedures

### Post-Mortem Requirements

- **Timeline**: Detailed timeline of events
- **Root Cause**: Technical and process root causes
- **Impact**: Customer and business impact metrics
- **Actions**: Immediate and long-term prevention actions
- **Follow-up**: Assigned owners and due dates

### Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date**: [incident date]
**Duration**: [start time] - [end time] ([X hours])
**Severity**: [P0/P1/P2]
**On-Call**: [@primary], [@secondary]

## Summary

[Brief description of what happened and why]

## Timeline

- [HH:MM] - [event 1]
- [HH:MM] - [event 2]
- [HH:MM] - [event 3]

## Impact

- **Customers Affected**: [number]
- **Revenue Impact**: [$X]
- **Downtime**: [X minutes]

## Root Cause

[Technical explanation of what went wrong]

## Resolution

[How we fixed it]

## Prevention

### Immediate

- [action 1] - [owner] - [due date]
- [action 2] - [owner] - [due date]

### Long-term

- [action 1] - [owner] - [due date]
- [action 2] - [owner] - [due date]

## Lessons Learned

[What we learned and how to improve]
```

## Training and Preparation

### On-Call Training Requirements

- **System Architecture**: Complete understanding of platform
- **Tools Proficiency**: Sentry, Vercel, Supabase dashboards
- **Emergency Procedures**: Regular incident response drills
- **Communication Skills**: Clear, concise incident updates

### Preparation Checklist

- [ ] Phone charged and accessible
- [ ] Laptop with reliable internet
- [ ] VPN access to internal systems
- [ ] All tool credentials working
- [ ] Emergency contacts saved
- [ ] Incident response guide bookmarked

### Drills and Practice

- **Monthly**: P0 incident simulation
- **Quarterly**: Full team incident response drill
- **Bi-annual**: Crisis communication exercise

## Quality Metrics

### Response Time Targets

- **P0 Acknowledgment**: < 5 minutes (95% compliance)
- **P0 Mitigation**: < 15 minutes (90% compliance)
- **P0 Resolution**: < 2 hours (85% compliance)
- **P1 Acknowledgment**: < 30 minutes (95% compliance)
- **P1 Resolution**: < 4 hours (90% compliance)

### Quality Indicators

- **False Alert Rate**: < 5% of total alerts
- **Escalation Rate**: < 10% of P0 alerts
- **Customer Satisfaction**: > 90% for incident handling
- **Post-Mortem Completion**: 100% for P0/P1 incidents

---

**Status**: Ready for implementation
**Next Steps**: Configure on-call schedules, test escalation paths, train team members
**Owner**: @observability-team
**Review**: @tech-lead, @engineering-manager
