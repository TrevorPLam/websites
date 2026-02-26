/**
 * @file e2e/contracts/consumers/resend-consumer.spec.ts
 * @summary Consumer-driven contract tests for Resend email service integration.
 * @security Test-only contract validation; no real API calls or secrets exposed.
 * @requirements TASK-002-5: Implement consumer-driven contract tests with validation
 */

import { Pact } from '@pact-foundation/pact';
import { ContractTestingUtils } from '@repo/testing-contracts';
import { ResendMocks } from '@repo/testing-contracts/mocks';

describe('Resend API Consumer Contract Tests', () => {
  const provider = new Pact({
    consumer: 'marketing-websites-app',
    provider: 'resend-api',
    port: 1236,
    log: 'pact/logs/resend-consumer.log',
    dir: 'pact/pacts',
    logLevel: 'info',
    spec: 2,
  });

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  afterEach(async () => {
    await provider.removeInteractions();
  });

  describe('Email Sending', () => {
    it('should send email notification', async () => {
      const to = 'test@example.com';
      const subject = 'Test Email';
      const html = '<p>This is a test email</p>';
      const emailId = 'email_1234567890';

      await provider.addInteraction({
        state: 'resend API is available',
        uponReceiving: 'send email notification',
        withRequest: ResendMocks.sendEmailRequest(to, subject, html),
        willRespondWith: ResendMocks.sendEmailResponse(emailId),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to,
          subject,
          html,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(emailId);
      expect(data.object).toBe('email');
    });

    it('should send email with template', async () => {
      const to = 'test@example.com';
      const subject = 'Welcome Email';
      const templateData = {
        name: 'Test User',
        tenantName: 'Test Tenant',
      };
      const emailId = 'email_template_1234567890';

      await provider.addInteraction({
        state: 'resend API is available',
        uponReceiving: 'send email with template',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to,
            subject,
            html: `<h1>Welcome ${templateData.name}!</h1><p>Thank you for joining ${templateData.tenantName}.</p>`,
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: emailId,
            object: 'email',
          },
        },
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to,
          subject,
          html: `<h1>Welcome ${templateData.name}!</h1><p>Thank you for joining ${templateData.tenantName}.</p>`,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(emailId);
      expect(data.object).toBe('email');
    });

    it('should send email with attachments', async () => {
      const to = 'test@example.com';
      const subject = 'Email with Attachments';
      const html = '<p>Please find the attached documents.</p>';
      const emailId = 'email_attachments_1234567890';

      await provider.addInteraction({
        state: 'resend API is available',
        uponReceiving: 'send email with attachments',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to,
            subject,
            html,
            attachments: [
              {
                filename: 'document.pdf',
                content: 'base64_encoded_content',
              },
            ],
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: emailId,
            object: 'email',
          },
        },
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to,
          subject,
          html,
          attachments: [
            {
              filename: 'document.pdf',
              content: 'base64_encoded_content',
            },
          ],
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe(emailId);
      expect(data.object).toBe('email');
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', async () => {
      const invalidEmail = 'invalid-email-format';
      const subject = 'Test Email';
      const html = '<p>This is a test email</p>';

      await provider.addInteraction({
        state: 'resend validation fails',
        uponReceiving: 'send email with invalid format',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to: invalidEmail,
            subject,
            html,
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Invalid email format', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to: invalidEmail,
          subject,
          html,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email format');
    });

    it('should validate required fields', async () => {
      const to = 'test@example.com';
      const html = '<p>This is a test email</p>';
      // Missing subject

      await provider.addInteraction({
        state: 'resend validation fails',
        uponReceiving: 'send email with missing required field',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to,
            // Missing subject
            html,
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Subject is required', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to,
          // Missing subject
          html,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Subject is required');
    });

    it('should validate sender domain', async () => {
      const to = 'test@example.com';
      const subject = 'Test Email';
      const html = '<p>This is a test email</p>';
      const invalidSender = 'invalid@unverified-domain.com';

      await provider.addInteraction({
        state: 'resend validation fails',
        uponReceiving: 'send email with unverified sender',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: invalidSender,
            to,
            subject,
            html,
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Sender domain not verified', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: invalidSender,
          to,
          subject,
          html,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Sender domain not verified');
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      await provider.addInteraction({
        state: 'resend API authentication fails',
        uponReceiving: 'request with invalid credentials',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer invalid_token',
            'Content-Type': 'application/json',
          },
          body: {},
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Invalid API key', 401),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer invalid_token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid API key');
    });

    it('should handle rate limit errors', async () => {
      await provider.addInteraction({
        state: 'resend rate limit exceeded',
        uponReceiving: 'request exceeding rate limit',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to: 'test@example.com',
            subject: 'Test Email',
            html: '<p>This is a test email</p>',
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Rate limit exceeded', 429),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to: 'test@example.com',
          subject: 'Test Email',
          html: '<p>This is a test email</p>',
        }),
      });

      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Rate limit exceeded');
    });

    it('should handle service unavailable errors', async () => {
      await provider.addInteraction({
        state: 'resend service is unavailable',
        uponReceiving: 'request during service outage',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to: 'test@example.com',
            subject: 'Test Email',
            html: '<p>This is a test email</p>',
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Service temporarily unavailable', 503),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to: 'test@example.com',
          subject: 'Test Email',
          html: '<p>This is a test email</p>',
        }),
      });

      expect(response.status).toBe(503);
      const data = await response.json();
      expect(data.error).toBe('Service temporarily unavailable');
    });
  });

  describe('Content Security', () => {
    it('should prevent XSS in email content', async () => {
      const to = 'test@example.com';
      const subject = 'Test Email';
      const maliciousHtml = '<script>alert("xss")</script><p>Safe content</p>';

      await provider.addInteraction({
        state: 'resend content security validation',
        uponReceiving: 'send email with malicious content',
        withRequest: {
          method: 'POST',
          path: '/emails',
          headers: {
            'Authorization': 'Bearer re_mock_api_key',
            'Content-Type': 'application/json',
          },
          body: {
            from: 'noreply@example.com',
            to,
            subject,
            html: maliciousHtml,
          },
        },
        willRespondWith: ContractTestingUtils.generateErrorResponse('Malicious content detected', 400),
      });

      // Test the actual integration
      const response = await fetch(`http://localhost:${provider.mockService.port}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_mock_api_key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@example.com',
          to,
          subject,
          html: maliciousHtml,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Malicious content detected');
    });
  });
});
