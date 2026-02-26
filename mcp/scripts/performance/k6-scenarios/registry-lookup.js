/**
 * @file registry-lookup.js
 * @summary k6 performance test for MCP Registry lookup operations
 * @version 1.0.0
 * @description Load testing script for registry API endpoints
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const lookupDuration = new Trend('lookup_duration');
const cacheHitRate = new Rate('cache_hits');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Peak load
    { duration: '5m', target: 200 }, // Sustain peak load
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'], // Error rate under 10%
    lookup_duration: ['p(95)<300'], // Registry lookup under 300ms p95
    errors: ['rate<0.05'], // Custom error rate under 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function setup() {
  // Initialize test data
  console.log('Setting up performance test...');
  
  // Create test skills if needed
  const setupResponse = http.post(`${BASE_URL}/api/test/setup`, {
    skillsCount: 1000,
    tenantsCount: 100,
  });
  
  check(setupResponse, {
    'setup completed': (r) => r.status === 200,
  });
  
  return {
    skillIds: Array.from({ length: 1000 }, (_, i) => `skill-${i}`),
    tenantIds: Array.from({ length: 100 }, (_, i) => `tenant-${i}`),
  };
}

export default function(data) {
  // Random operation selection
  const operations = [
    'single_lookup',
    'tenant_skills',
    'search_skills',
    'browse_skills',
    'skill_details',
  ];
  
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  switch (operation) {
    case 'single_lookup':
      singleLookup(data);
      break;
    case 'tenant_skills':
      tenantSkills(data);
      break;
    case 'search_skills':
      searchSkills(data);
      break;
    case 'browse_skills':
      browseSkills();
      break;
    case 'skill_details':
      skillDetails(data);
      break;
  }
  
  sleep(1); // 1 second think time
}

function singleLookup(data) {
  const skillId = data.skillIds[Math.floor(Math.random() * data.skillIds.length)];
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/api/skills/${skillId}`, {
    headers: {
      'X-Tenant-ID': data.tenantIds[Math.floor(Math.random() * data.tenantIds.length)],
    },
  });
  
  const duration = Date.now() - startTime;
  lookupDuration.add(duration);
  
  const success = check(response, {
    'single lookup status is 200': (r) => r.status === 200,
    'single lookup response time < 200ms': (r) => r.timings.duration < 200,
    'single lookup has data': (r) => r.json('data') !== undefined,
  });
  
  errorRate.add(!success);
  
  // Check cache headers
  const cacheControl = response.headers['Cache-Control'];
  if (cacheControl && cacheControl.includes('max-age')) {
    cacheHitRate.add(1);
  }
}

function tenantSkills(data) {
  const tenantId = data.tenantIds[Math.floor(Math.random() * data.tenantIds.length)];
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/api/tenants/${tenantId}/skills`, {
    headers: {
      'X-Tenant-ID': tenantId,
    },
  });
  
  const duration = Date.now() - startTime;
  lookupDuration.add(duration);
  
  const success = check(response, {
    'tenant skills status is 200': (r) => r.status === 200,
    'tenant skills response time < 300ms': (r) => r.timings.duration < 300,
    'tenant skills has array': (r) => Array.isArray(r.json('data')),
  });
  
  errorRate.add(!success);
}

function searchSkills(data) {
  const searchTerms = ['test', 'skill', 'api', 'data', 'service'];
  const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/api/skills/search?q=${term}`, {
    headers: {
      'X-Tenant-ID': data.tenantIds[Math.floor(Math.random() * data.tenantIds.length)],
    },
  });
  
  const duration = Date.now() - startTime;
  lookupDuration.add(duration);
  
  const success = check(response, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 400ms': (r) => r.timings.duration < 400,
    'search has results': (r) => Array.isArray(r.json('data')),
  });
  
  errorRate.add(!success);
}

function browseSkills() {
  const page = Math.floor(Math.random() * 10) + 1;
  const pageSize = 20;
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/api/skills?page=${page}&pageSize=${pageSize}`);
  
  const duration = Date.now() - startTime;
  lookupDuration.add(duration);
  
  const success = check(response, {
    'browse status is 200': (r) => r.status === 200,
    'browse response time < 250ms': (r) => r.timings.duration < 250,
    'browse has pagination': (r) => r.json('pagination') !== undefined,
  });
  
  errorRate.add(!success);
}

function skillDetails(data) {
  const skillId = data.skillIds[Math.floor(Math.random() * data.skillIds.length)];
  const startTime = Date.now();
  
  const response = http.get(`${BASE_URL}/api/skills/${skillId}/details`, {
    headers: {
      'X-Tenant-ID': data.tenantIds[Math.floor(Math.random() * data.tenantIds.length)],
    },
  });
  
  const duration = Date.now() - startTime;
  lookupDuration.add(duration);
  
  const success = check(response, {
    'skill details status is 200': (r) => r.status === 200,
    'skill details response time < 300ms': (r) => r.timings.duration < 300,
    'skill details has full data': (r) => r.json('data') && r.json('data').manifest,
  });
  
  errorRate.add(!success);
}

export function teardown(data) {
  console.log('Cleaning up test data...');
  
  const cleanupResponse = http.post(`${BASE_URL}/api/test/cleanup`);
  
  check(cleanupResponse, {
    'cleanup completed': (r) => r.status === 200,
  });
  
  console.log('Performance test completed');
}
