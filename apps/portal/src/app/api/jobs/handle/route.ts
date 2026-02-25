/**
 * QStash Webhook Handler with Signature Verification
 * Handles incoming job callbacks from QStash with proper security validation
 */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { JobHandlerFactory } from '@repo/jobs';
import crypto from 'crypto';

// ============================================================================
// QSTASH SIGNATURE VERIFICATION
// Prevents forged job invocations by verifying QStash signatures
// ============================================================================

function verifyQStashSignature(
  body: string,
  signature: string,
  signingKey: string
): boolean {
  try {
    // QStash uses HMAC-SHA256 for signatures
    const expectedSignature = crypto
      .createHmac('sha256', signingKey)
      .update(body)
      .digest('hex');

    // Remove any prefix from the signature (QStash may add one)
    const receivedSignature = signature.replace(/^sha256=/, '');

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// ============================================================================
// JOB EXECUTION WITH ERROR HANDLING
// Processes jobs with proper error handling and retry logic
// ============================================================================

async function executeJob(jobType: string, payload: any): Promise<void> {
  try {
    const handler = JobHandlerFactory.createHandler(jobType);
    await handler(payload);

    console.log(`✅ Job executed successfully: ${jobType}`);
  } catch (error) {
    console.error(`❌ Job execution failed: ${jobType}`, error);

    // Re-throw to let QStash handle retries
    throw error;
  }
}

// ============================================================================
// MAIN WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get headers for signature verification
    const headersList = await headers();
    const signature = headersList.get('upstash-signature') || '';
    const tenantId = headersList.get('x-tenant-id') || '';
    const jobType = headersList.get('x-job-type') || '';

    // Validate required headers
    if (!signature) {
      console.error('Missing QStash signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    if (!tenantId || !jobType) {
      console.error('Missing required job headers');
      return NextResponse.json(
        { error: 'Missing job metadata' },
        { status: 400 }
      );
    }

    // Get request body for signature verification
    const body = await request.text();

    // Get QStash signing key from environment
    const signingKey = process.env.QSTASH_SIGNING_KEY;
    if (!signingKey) {
      console.error('QStash signing key not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify signature to prevent forged requests
    if (!verifyQStashSignature(body, signature, signingKey)) {
      console.error('Invalid QStash signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse job payload
    let jobPayload;
    try {
      jobPayload = JSON.parse(body);
    } catch (parseError) {
      console.error('Invalid JSON payload:', parseError);
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Validate job structure
    if (!jobPayload.jobId || !jobPayload.type || !jobPayload.payload) {
      console.error('Invalid job structure:', jobPayload);
      return NextResponse.json(
        { error: 'Invalid job structure' },
        { status: 400 }
      );
    }

    // Log job execution start
    console.log(`🔄 Executing job: ${jobPayload.jobId} (${jobPayload.type}) for tenant: ${tenantId}`);

    // Execute the job with error handling
    await executeJob(jobPayload.type, jobPayload.payload);

    // Return success response
    return NextResponse.json({
      success: true,
      jobId: jobPayload.jobId,
      executedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Webhook handler error:', error);

    // Return error to let QStash retry
    return NextResponse.json(
      {
        error: 'Job execution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'qstash-webhook-handler',
  });
}
