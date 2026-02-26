/**
 * @file apps/web/src/features/lead-capture/api/submit-lead.ts
 * @summary Lead submission API.
 * @description API function for submitting lead data.
 */

export interface LeadData {
  name: string
  email: string
  phone?: string
  company?: string
  message?: string
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to submit lead')
    }

    const result = await response.json()
    return { success: true, id: result.id }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
