/**
 * @file orchestrator-execution.js
 * @summary k6 performance test for MCP Orchestrator execution operations
 * @version 1.0.0
 * @description Load testing script for orchestrator skill execution
 * @security Performance testing only; no production data accessed.
 * @adr none
 * @requirements MCP-001, PERF-001
 */

import { check, sleep } from 'k6';
import http from 'k6/http';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const executionErrorRate = new Rate('execution_errors');
const executionDuration = new Trend('execution_duration');
const concurrentExecutions = new Counter('concurrent_executions');
const successfulExecutions = new Counter('successful_executions');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 5 }, // Warm up
    { duration: '3m', target: 20 }, // Moderate load
    { duration: '2m', target: 50 }, // High load
    { duration: '5m', target: 100 }, // Peak load
    { duration: '2m', target: 200 }, // Stress test
    { duration: '3m', target: 100 }, // Cool down
    { duration: '1m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% under 2s
    http_req_failed: ['rate<0.15'], // Error rate under 15%
    execution_duration: ['p(95)<1500'], // Execution under 1.5s p95
    execution_errors: ['rate<0.1'], // Execution error rate under 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const SKILLS = [
  { name: 'data-processor', complexity: 'low', expectedDuration: 500 },
  { name: 'text-analyzer', complexity: 'medium', expectedDuration: 1500 },
  { name: 'image-processor', complexity: 'high', expectedDuration: 3000 },
  { name: 'api-integrator', complexity: 'medium', expectedDuration: 1200 },
  { name: 'report-generator', complexity: 'high', expectedDuration: 2500 },
];

const TENANTS = ['tenant-1', 'tenant-2', 'tenant-3', 'tenant-4', 'tenant-5'];

export function setup() {
  console.log('Setting up orchestrator performance test...');

  // Verify orchestrator is ready
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  check(healthResponse, {
    'orchestrator is healthy': (r) => r.status === 200,
  });

  return { skills: SKILLS, tenants: TENANTS };
}

export default function (data) {
  const skill = data.skills[Math.floor(Math.random() * data.skills.length)];
  const tenant = data.tenants[Math.floor(Math.random() * data.tenants.length)];

  executeSkill(skill, tenant);

  // Variable think time based on skill complexity
  const thinkTime = skill.complexity === 'low' ? 0.5 : skill.complexity === 'medium' ? 1 : 2;
  sleep(thinkTime);
}

function executeSkill(skill, tenant) {
  const payload = generateSkillPayload(skill);
  const startTime = Date.now();

  concurrentExecutions.add(1);

  const response = http.post(`${BASE_URL}/api/orchestrator/execute`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenant,
      'X-Request-ID': `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },
    timeout: '30s',
  });

  const duration = Date.now() - startTime;
  executionDuration.add(duration);

  const success = check(response, {
    'execution started': (r) => r.status === 200 || r.status === 202,
    'execution has request ID': (r) => r.json('requestId') !== undefined,
    'execution within expected time': (r) => duration < skill.expectedDuration * 2,
  });

  if (response.status === 200 || response.status === 202) {
    const requestId = response.json('requestId');

    // Poll for completion if async
    if (response.status === 202) {
      pollExecutionCompletion(requestId, tenant, skill.expectedDuration * 3);
    } else {
      successfulExecutions.add(1);
    }
  }

  executionErrorRate.add(!success);
  concurrentExecutions.add(-1);
}

function pollExecutionCompletion(requestId, tenant, timeoutMs) {
  const startTime = Date.now();
  const pollInterval = 500; // 500ms polling interval

  while (Date.now() - startTime < timeoutMs) {
    const response = http.get(`${BASE_URL}/api/orchestrator/execution/${requestId}`, {
      headers: {
        'X-Tenant-ID': tenant,
      },
    });

    if (response.status === 200) {
      const status = response.json('status');

      if (status === 'completed') {
        successfulExecutions.add(1);
        return true;
      } else if (status === 'failed') {
        executionErrorRate.add(1);
        return false;
      }
    }

    sleep(pollInterval / 1000);
  }

  // Timeout
  executionErrorRate.add(1);
  return false;
}

function generateSkillPayload(skill) {
  const basePayload = {
    skillName: skill.name,
    version: '1.0.0',
    priority: 'normal',
    timeout: skill.expectedDuration * 2,
  };

  switch (skill.name) {
    case 'data-processor':
      return {
        ...basePayload,
        inputs: {
          data: Array.from({ length: 100 }, (_, i) => ({ id: i, value: Math.random() })),
          operation: 'aggregate',
        },
      };

    case 'text-analyzer':
      return {
        ...basePayload,
        inputs: {
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50),
          analysis: ['sentiment', 'entities', 'keywords'],
        },
      };

    case 'image-processor':
      return {
        ...basePayload,
        inputs: {
          imageUrl: 'https://example.com/test-image.jpg',
          operations: ['resize', 'compress', 'enhance'],
          quality: 80,
        },
      };

    case 'api-integrator':
      return {
        ...basePayload,
        inputs: {
          endpoints: [
            { url: 'https://api.example.com/users', method: 'GET' },
            { url: 'https://api.example.com/orders', method: 'POST' },
          ],
          timeout: 5000,
        },
      };

    case 'report-generator':
      return {
        ...basePayload,
        inputs: {
          template: 'monthly-report',
          data: {
            period: '2024-01',
            metrics: { revenue: 100000, users: 5000, orders: 1000 },
          },
          format: 'pdf',
        },
      };

    default:
      return {
        ...basePayload,
        inputs: { test: 'data' },
      };
  }
}

export function teardown(data) {
  console.log('Performance test completed');
  console.log(`Successful executions: ${successfulExecutions.value}`);
  console.log(`Execution error rate: ${(executionErrorRate.value * 100).toFixed(2)}%`);
  console.log(`Average execution duration: ${executionDuration.avg.toFixed(2)}ms`);
}
