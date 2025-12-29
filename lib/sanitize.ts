/**
 * Sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Escape HTML special characters to prevent XSS
 * Converts <, >, &, ", ' to their HTML entity equivalents
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char)
}

/**
 * Sanitize text for use in email subject lines
 * Removes newlines and control characters that could be used for email header injection
 */
export function sanitizeEmailSubject(subject: string): string {
  // Remove newlines, carriage returns, and other control characters
  return subject
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) // Limit length
}

/**
 * Convert plain text with newlines to HTML paragraphs
 * Safely escapes HTML while preserving line breaks
 */
export function textToHtmlParagraphs(text: string): string {
  const escaped = escapeHtml(text)
  const paragraphs = escaped
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  return paragraphs || `<p>${escaped.replace(/\n/g, '<br>')}</p>`
}

/**
 * Sanitize and validate email address
 * Basic sanitization for display purposes
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254) // Max email length per RFC
}

/**
 * Sanitize name for display
 * Removes potentially dangerous characters while preserving international names
 */
export function sanitizeName(name: string): string {
  return escapeHtml(name.trim().slice(0, 100))
}
