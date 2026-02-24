-- Tinybird Data Sources for Marketing Platform Analytics
-- Domain 13.3 - Analytics Dashboard Schema

-- 1. page_views.datasource
-- Tracks all page views across all tenant sites
SCHEMA >
  `tenant_id`    String `json:$.tenant_id`,
  `session_id`   String `json:$.session_id`,
  `pathname`     String `json:$.pathname`,
  `referrer`     Nullable(String) `json:$.referrer`,
  `user_agent`   String `json:$.user_agent`,
  `utm_source`   Nullable(String) `json:$.utm_source`,
  `utm_medium`   Nullable(String) `json:$.utm_medium`,
  `utm_campaign` Nullable(String) `json:$.utm_campaign`,
  `timestamp`    DateTime64(3) `json:$.timestamp`

ENGINE "MergeTree"
ENGINE_SORTING_KEY "tenant_id, timestamp"
ENGINE_TTL "timestamp + interval 90 day"

-- 2. events.datasource
-- Tracks all custom events (form submissions, phone clicks, etc.)
SCHEMA >
  `tenant_id`    String `json:$.tenant_id`,
  `session_id`   String `json:$.session_id`,
  `event_type`   String `json:$.event_type`,
  `pathname`     String `json:$.pathname`,
  `payload`      String `json:$.payload`,
  `timestamp`    DateTime64(3) `json:$.timestamp`

ENGINE "MergeTree"
ENGINE_SORTING_KEY "tenant_id, event_type, timestamp"
ENGINE_TTL "timestamp + interval 90 day"

-- 3. leads.datasource
-- Tracks lead generation with scoring
SCHEMA >
  `tenant_id`    String `json:$.tenant_id`,
  `session_id`   String `json:$.session_id`,
  `lead_id`      String `json:$.lead_id`,
  `email`        String `json:$.email`,
  `phone`        Nullable(String) `json:$.phone`,
  `score`        UInt8 `json:$.score`,
  `source`       String `json:$.source`,
  `campaign`     Nullable(String) `json:$.campaign`,
  `created_at`   DateTime64(3) `json:$.created_at`

ENGINE "MergeTree"
ENGINE_SORTING_KEY "tenant_id, created_at"
ENGINE_TTL "created_at + interval 365 day"

-- 4. core_web_vitals.datasource
-- Tracks Core Web Vitals metrics per route
SCHEMA >
  `tenant_id`    String `json:$.tenant_id`,
  `pathname`     String `json:$.pathname`,
  `lcp`          Float32 `json:$.lcp`,
  `inp`          Float32 `json:$.inp`,
  `cls`          Float32 `json:$.cls`,
  `device_type`  String `json:$.device_type`,
  `timestamp`    DateTime64(3) `json:$.timestamp`

ENGINE "MergeTree"
ENGINE_SORTING_KEY "tenant_id, pathname, timestamp"
ENGINE_TTL "timestamp + interval 90 day"
