-- Tinybird API Pipes for Marketing Platform Analytics
-- Domain 13.3 - Analytics Dashboard Schema

-- leads_over_time.pipe — Leads grouped by day, last 30 days
SELECT
  tenant_id,
  toDate(created_at) as date,
  count() as total_leads,
  countIf(score >= 70) as qualified_leads,
  countIf(score >= 40 AND score < 70) as warm_leads,
  countIf(score < 40) as cold_leads,
  avg(score) as avg_score
FROM leads
WHERE
  created_at >= now() - INTERVAL 30 DAY
  {% if defined(tenant_id) %}
    AND tenant_id = {{ String(tenant_id, '') }}
  {% end %}
GROUP BY tenant_id, date
ORDER BY date ASC

-- top_sources.pipe — Lead sources ranked by conversion
SELECT
  tenant_id,
  utm_source,
  count() as lead_count,
  countIf(score >= 70) as qualified,
  avg(score) as avg_score,
  qualified / lead_count * 100 as conversion_rate
FROM page_views pv
INNER JOIN leads l ON pv.session_id = l.session_id
WHERE
  l.created_at >= now() - INTERVAL 30 DAY
  AND pv.utm_source IS NOT NULL
  {% if defined(tenant_id) %}
    AND pv.tenant_id = {{ String(tenant_id, '') }}
  {% end %}
GROUP BY tenant_id, utm_source
HAVING lead_count >= 5
ORDER BY qualified DESC
LIMIT 10

-- funnel.pipe — Visitor → Lead conversion funnel
WITH
  sessions AS (
    SELECT tenant_id, session_id, count() as page_views
    FROM page_views
    WHERE timestamp >= now() - INTERVAL 30 DAY
    {% if defined(tenant_id) %}
      AND tenant_id = {{ String(tenant_id, '') }}
    {% end %}
    GROUP BY tenant_id, session_id
  ),
  phone_clicks AS (
    SELECT DISTINCT tenant_id, session_id
    FROM events
    WHERE event_type = 'phone_click'
    AND timestamp >= now() - INTERVAL 30 DAY
    {% if defined(tenant_id) %}
      AND tenant_id = {{ String(tenant_id, '') }}
    {% end %}
  ),
  form_starts AS (
    SELECT DISTINCT tenant_id, session_id
    FROM events
    WHERE event_type = 'form_start'
    AND timestamp >= now() - INTERVAL 30 DAY
    {% if defined(tenant_id) %}
      AND tenant_id = {{ String(tenant_id, '') }}
    {% end %}
  )
SELECT
  s.tenant_id,
  count(DISTINCT s.session_id) as total_visitors,
  count(DISTINCT pc.session_id) as phone_clickers,
  count(DISTINCT fs.session_id) as form_starters,
  phone_clickers / total_visitors * 100 as phone_click_rate,
  form_starters / total_visitors * 100 as form_start_rate
FROM sessions s
LEFT JOIN phone_clicks pc USING (tenant_id, session_id)
LEFT JOIN form_starts fs USING (tenant_id, session_id)
{% if defined(tenant_id) %}
  WHERE s.tenant_id = {{ String(tenant_id, '') }}
{% end %}
GROUP BY s.tenant_id

-- cwv_p75_per_tenant.pipe — Core Web Vitals 75th percentile per tenant
SELECT
  tenant_id,
  quantileExactWeighted(0.75)(lcp) as lcp_p75,
  quantileExactWeighted(0.75)(inp) as inp_p75,
  quantileExactWeighted(0.75)(cls) as cls_p75,
  count() as sample_count
FROM core_web_vitals
WHERE
  timestamp >= now() - INTERVAL 30 DAY
  {% if defined(tenant_id) %}
    AND tenant_id = {{ String(tenant_id, '') }}
  {% end %}
GROUP BY tenant_id
ORDER BY tenant_id

-- top_pages.pipe — Most visited pages per tenant
SELECT
  tenant_id,
  pathname,
  count(DISTINCT session_id) as unique_visitors,
  count() as total_page_views,
  avg(length(pathname)) as avg_path_length
FROM page_views
WHERE
  timestamp >= now() - INTERVAL 30 DAY
  {% if defined(tenant_id) %}
    AND tenant_id = {{ String(tenant_id, '') }}
  {% end %}
GROUP BY tenant_id, pathname
ORDER BY unique_visitors DESC
LIMIT 20

-- event_summary.pipe — All events grouped by type
SELECT
  tenant_id,
  event_type,
  count() as event_count,
  count(DISTINCT session_id) as unique_sessions,
  min(timestamp) as first_event,
  max(timestamp) as last_event
FROM events
WHERE
  timestamp >= now() - INTERVAL 30 DAY
  {% if defined(tenant_id) %}
    AND tenant_id = {{ String(tenant_id, '') }}
  {% end %}
GROUP BY tenant_id, event_type
ORDER BY event_count DESC
