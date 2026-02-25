# Webhook Troubleshooting Guide

> **Webhook Failure Handling & Recovery**  
> **Version**: 1.0  
> **Last Updated**: 2026-02-25  
> **Owner**: Integrations Team

## Overview

This document provides comprehensive procedures for diagnosing and resolving webhook failures across all integrated services (Stripe, Cal.com, and future integrations).

## 🚨 Common Webhook Issues

### Stripe Webhook Failures

#### Symptoms

- Payments not updating in database
- Customer reports of paid services not activated
- "Webhook signature verification failed" errors
- Stripe dashboard shows webhook delivery failures

#### Immediate Diagnosis

1. **Check Webhook Endpoint Status**

   ```bash
   # Test webhook endpoint health
   curl -X POST "https://agency.com/api/webhooks/stripe" \
     -H "Content-Type: application/json" \
     -d '{"test": "health_check"}' \
     -v

   # Expected response: 200 OK
   ```

2. **Verify Webhook Configuration**

   ```bash
   # List webhook endpoints
   curl -X GET "https://api.stripe.com/v1/webhook_endpoints" \
     -u "sk_test_...:$STRIPE_SECRET_KEY" \
     -G -d "limit=10"

   # Check webhook secret
   curl -X GET "https://api.stripe.com/v1/webhook_endpoints/{wh_id}" \
     -u "sk_test_...:$STRIPE_SECRET_KEY"
   ```

3. **Review Recent Delivery Attempts**

   ```bash
   # Check recent webhook events
   curl -X GET "https://api.stripe.com/v1/events" \
     -u "sk_test_...:$STRIPE_SECRET_KEY" \
     -G -d "limit=10" \
     -d "type=payment_intent.succeeded"

   # Check webhook delivery logs
   curl -X GET "https://api.stripe.com/v1/webhook_endpoints/{wh_id}/delivery_attempts" \
     -u "sk_test_...:$STRIPE_SECRET_KEY"
   ```

#### Common Issues & Solutions

**Signature Verification Failures:**

```bash
# Check webhook secret configuration
echo "Webhook Secret: $STRIPE_WEBHOOK_SECRET"

# Test signature verification
curl -X POST "https://agency.com/api/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  -d '{"test": "signature_verification"}'
```

**Endpoint Timeout Issues:**

```bash
# Check endpoint response time
time curl -X POST "https://agency.com/api/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -d '{"test": "timing_test"}'

# If > 30 seconds, Stripe will timeout
# Solutions:
# 1. Optimize webhook processing
# 2. Implement async processing
# 3. Increase processing capacity
```

**Missing Event Types:**

```bash
# Check configured event types
curl -X GET "https://api.stripe.com/v1/webhook_endpoints/{wh_id}" \
  -u "sk_test_...:$STRIPE_SECRET_KEY" | jq '.enabled_events[]'

# Common required events:
# - payment_intent.succeeded
# - payment_intent.payment_failed
# - invoice.payment_succeeded
# - invoice.payment_failed
# - customer.subscription.created
# - customer.subscription.deleted
```

#### Recovery Procedures

**Manual Webhook Replay:**

```bash
# Replay specific event
curl -X POST "https://api.stripe.com/v1/events/{event_id}/replay" \
  -u "sk_test_...:$STRIPE_SECRET_KEY"

# Replay multiple events
for event_id in evt_1 evt_2 evt_3; do
  curl -X POST "https://api.stripe.com/v1/events/$event_id/replay" \
    -u "sk_test_...:$STRIPE_SECRET_KEY"
  sleep 1  # Rate limiting
done
```

**Manual Payment Sync:**

```sql
-- Sync missed payments from Stripe
INSERT INTO payments (stripe_payment_intent_id, amount, status, created_at)
SELECT
  pi.id,
  pi.amount,
  pi.status,
  pi.created_at
FROM stripe_payment_intents pi
WHERE pi.status = 'succeeded'
AND NOT EXISTS (
  SELECT 1 FROM payments p
  WHERE p.stripe_payment_intent_id = pi.id
);
```

### Cal.com Webhook Failures

#### Symptoms

- Booking sync issues
- Calendar events not updating
- "Webhook timeout" errors
- Booking status inconsistencies

#### Immediate Diagnosis

1. **Check Cal.com API Status**

   ```bash
   # Test API connectivity
   curl -X GET "https://api.cal.com/v1/me" \
     -H "Authorization: Bearer $CALCOM_API_KEY"

   # Check webhook endpoints
   curl -X GET "https://api.cal.com/v1/webhooks" \
     -H "Authorization: Bearer $CALCOM_API_KEY"
   ```

2. **Verify Webhook Configuration**

   ```bash
   # List webhook subscriptions
   curl -X GET "https://api.cal.com/v1/webhooks/{webhook_id}/subscriptions" \
     -H "Authorization: Bearer $CALCOM_API_KEY"

   # Test webhook endpoint
   curl -X POST "https://agency.com/api/webhooks/cal" \
     -H "Content-Type: application/json" \
     -H "X-Cal-Signature-256: test_signature" \
     -d '{"test": "health_check"}'
   ```

3. **Review Recent Booking Events**
   ```bash
   # Check recent bookings
   curl -X GET "https://api.cal.com/v1/bookings" \
     -H "Authorization: Bearer $CALCOM_API_KEY" \
     -G -d "limit=10" \
     -d "status=confirmed"
   ```

#### Common Issues & Solutions

**Signature Verification Issues:**

```bash
# Check webhook secret
echo "Cal.com Webhook Secret: $CALCOM_WEBHOOK_SECRET"

# Test signature format
# Cal.com uses HMAC-SHA256 with X-Cal-Signature-256 header
```

**Booking State Mismatches:**

```sql
-- Find inconsistent booking states
SELECT
  cb.id as calcom_booking_id,
  cb.status as calcom_status,
  b.status as local_status,
  cb.updated_at as calcom_updated,
  b.updated_at as local_updated
FROM calcom_bookings cb
LEFT JOIN bookings b ON cb.id = b.calcom_booking_id
WHERE cb.status != b.status
OR b.updated_at < cb.updated_at;
```

#### Recovery Procedures

**Manual Booking Sync:**

```bash
# Sync specific booking
curl -X POST "https://api.cal.com/v1/bookings/{booking_id}/resync" \
  -H "Authorization: Bearer $CALCOM_API_KEY"

# Sync all recent bookings
curl -X GET "https://api.cal.com/v1/bookings" \
  -H "Authorization: Bearer $CALCOM_API_KEY" \
  -G -d "limit=50" \
  -d "startTime=$(date -d '1 hour ago' -Iseconds)" | \
  jq '.[] | .id' | \
  xargs -I {} curl -X POST "https://api.cal.com/v1/bookings/{}/resync" \
    -H "Authorization: Bearer $CALCOM_API_KEY"
```

## 🔧 Debugging Tools

### Webhook Testing

**Stripe CLI Testing:**

```bash
# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger invoice.payment_succeeded
```

**Manual Webhook Testing:**

```bash
# Create test webhook payload
cat > test_stripe_webhook.json << EOF
{
  "id": "evt_test_123",
  "object": "event",
  "api_version": "2023-10-16",
  "created": 1678901234,
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_123",
      "object": "payment_intent",
      "amount": 2000,
      "currency": "usd",
      "status": "succeeded",
      "metadata": {
        "tenant_id": "test-tenant-123"
      }
    }
  }
}
EOF

# Send test webhook
curl -X POST "https://agency.com/api/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -d @test_stripe_webhook.json
```

### Monitoring & Logging

**Webhook Logging:**

```typescript
// Enhanced webhook logging
export async function logWebhookEvent(
  service: 'stripe' | 'calcom',
  eventType: string,
  payload: any,
  status: 'received' | 'processed' | 'failed',
  error?: string
) {
  await supabase.from('webhook_logs').insert({
    service,
    event_type: eventType,
    payload,
    status,
    error,
    received_at: new Date().toISOString(),
    processed_at: status === 'processed' ? new Date().toISOString() : null,
  });
}
```

**Webhook Monitoring Query:**

```sql
-- Monitor webhook health
SELECT
  service,
  event_type,
  status,
  COUNT(*) as event_count,
  AVG(EXTRACT(EPOCH FROM (processed_at - received_at))) as avg_processing_time
FROM webhook_logs
WHERE received_at > now() - interval '1 hour'
GROUP BY service, event_type, status
ORDER BY event_count DESC;
```

## 📊 Performance Optimization

### Async Processing

**Implement Queue System:**

```typescript
// Queue webhook processing for better performance
export async function queueWebhookProcessing(service: string, eventType: string, payload: any) {
  await redis.lpush(
    'webhook_queue',
    JSON.stringify({
      service,
      eventType,
      payload,
      timestamp: Date.now(),
    })
  );
}

// Process webhook queue
export async function processWebhookQueue() {
  const webhook = await redis.brpop('webhook_queue', 10);
  if (webhook) {
    const { service, eventType, payload } = JSON.parse(webhook[1]);
    await processWebhook(service, eventType, payload);
  }
}
```

### Rate Limiting

**Implement Rate Limiting:**

```typescript
// Rate limit webhook processing per tenant
export async function checkWebhookRateLimit(tenantId: string): Promise<boolean> {
  const key = `webhook_rate:${tenantId}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }

  return count <= 100; // Max 100 webhooks per minute per tenant
}
```

## 🆘 Escalation Procedures

### When to Escalate

- **Immediate**: Complete webhook failure for > 15 minutes
- **Urgent**: Payment processing failures affecting revenue
- **High**: Booking sync issues affecting customer experience
- **Medium**: Intermittent webhook failures

### Escalation Contacts

**Stripe Support:**

- Email: support@stripe.com
- Phone: +1-555-STRIPE (24/7)
- Documentation: https://stripe.com/docs/webhooks

**Cal.com Support:**

- Email: support@cal.com
- Documentation: https://cal.com/docs/webhooks

**Internal Contacts:**

- Integrations Team: integrations@agency.com
- On-Call Engineer: oncall@agency.com, +1-555-ONCALL

## 📋 Prevention Checklist

### Daily Monitoring

- [ ] Check webhook delivery success rates
- [ ] Monitor webhook processing times
- [ ] Review webhook error logs
- [ ] Verify endpoint health

### Weekly Maintenance

- [ ] Test webhook endpoints
- [ ] Review webhook signatures
- [ ] Update webhook documentation
- [ ] Check rate limiting effectiveness

### Monthly Reviews

- [ ] Analyze webhook failure patterns
- [ ] Update error handling procedures
- [ ] Review performance metrics
- [ ] Update monitoring thresholds

---

**Remember: Webhooks are critical for business operations. Always test webhook changes in staging before deploying to production.**
