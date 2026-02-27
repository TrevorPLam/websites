/**
 * @file scripts/performance/k6-golden-path.js
 * @summary k6 load test for the public-site golden path.
 * @description Measures homepage and contact page latency plus contact endpoint reliability under load.
 * @security Sends synthetic payloads only; do not use production secrets in environment variables.
 * @requirements TASK-040, LOAD-TEST-GOLDEN-PATH-001
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL ?? 'http://localhost:3000';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<600'],
  },
  scenarios: {
    homepageTraffic: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 30 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
};

const payload = JSON.stringify({
  name: 'Load Test Visitor',
  email: `load-test-${Date.now()}@example.com`,
  message: 'k6 automated load test message',
  phone: '555-111-2222',
});

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  const homepage = http.get(baseUrl);
  check(homepage, {
    'homepage returns 200': (response) => response.status === 200,
    'homepage responds quickly': (response) => response.timings.duration < 1000,
  });

  const contactPage = http.get(`${baseUrl}/contact`);
  check(contactPage, {
    'contact page returns 200': (response) => response.status === 200,
  });

  const contactSubmission = http.post(`${baseUrl}/api/contact`, payload, params);
  check(contactSubmission, {
    'contact API accepted payload': (response) => response.status >= 200 && response.status < 300,
  });

  sleep(1);
}
