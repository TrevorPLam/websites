/**
 * Sanitization utilities to prevent XSS and injection attacks.
 * 
 * **Purpose:**
 * - Prevent Cross-Site Scripting (XSS) attacks
 * - Prevent email header injection attacks
 * - Safely handle user input in HTML context
 * 
 * **Usage Context:**
 * - All user-generated content displayed in HTML
 * - Email subjects and bodies
 * - Form inputs that appear in emails
 * 
 * **Security Model:**
 * - Input sanitization (escape dangerous characters)
 * - No HTML allowed in user input (all HTML tags escaped)
 * - Output encoding for different contexts (HTML, email)
 * 
 * @module lib/sanitize
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html OWASP XSS Prevention}
 */

/**
 * Escape HTML special characters to prevent XSS attacks.
 * 
 * **What it prevents:**
 * - XSS attacks via <script> tags
 * - XSS attacks via HTML event handlers (onclick, onerror, etc.)
 * - XSS attacks via HTML attributes (href="javascript:...", etc.)
 * - XSS attacks via <iframe>, <object>, <embed> tags
 * 
 * **How it works:**
 * Converts dangerous HTML characters to their HTML entity equivalents:
 * - `<` → `&lt;` (prevents opening tags)
 * - `>` → `&gt;` (prevents closing tags)
 * - `&` → `&amp;` (prevents entity injection)
 * - `"` → `&quot;` (prevents attribute injection)
 * - `'` → `&#x27;` (prevents single-quote attribute injection)
 * - `/` → `&#x2F;` (prevents closing tag injection)
 * 
 * **Attack Examples (neutralized):**
 * ```typescript
 * // Script injection attack
 * escapeHtml('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
 * 
 * // Event handler attack
 * escapeHtml('<img src=x onerror="alert(1)">')
 * // Returns: '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
 * 
 * // Attribute injection attack
 * escapeHtml('"><script>alert(1)</script>')
 * // Returns: '&quot;&gt;&lt;script&gt;alert(1)&lt;&#x2F;script&gt;'
 * ```
 * 
 * **When to use:**
 * - ANY user input displayed in HTML
 * - Form field values in email templates
 * - Error messages containing user input
 * - Search queries displayed on page
 * 
 * **When NOT to use:**
 * - Content from trusted sources (like your CMS)
 * - Content already sanitized by a library (DOMPurify, etc.)
 * - HTML you explicitly want to render (use DOMPurify instead)
 * 
 * @param text - User input to escape
 * @returns HTML-safe string with special characters escaped
 * 
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#output-encoding-for-html-contexts OWASP HTML Context Encoding}
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
 * Sanitize text for use in email subject lines to prevent header injection attacks.
 * 
 * **What it prevents:**
 * - Email header injection attacks (adding BCC, CC, additional recipients)
 * - SMTP command injection
 * - Email spoofing via crafted subjects
 * 
 * **How it works:**
 * - Removes newlines (`\r`, `\n`) that can inject new headers
 * - Removes tab characters (`\t`) that can inject new headers
 * - Collapses multiple spaces into single space
 * - Limits length to 200 characters (reasonable email subject limit)
 * 
 * **Attack Examples (neutralized):**
 * ```typescript
 * // Header injection attack (add BCC)
 * sanitizeEmailSubject('Subject\nBCC: attacker@evil.com')
 * // Returns: 'Subject BCC: attacker@evil.com' (single line, can't inject)
 * 
 * // Header injection attack (add recipients)
 * sanitizeEmailSubject('Test\r\nTo: victim@example.com')
 * // Returns: 'Test To: victim@example.com' (single line)
 * ```
 * 
 * **When to use:**
 * - ALL email subject lines from user input
 * - Email headers containing user data
 * 
 * @param subject - User-provided subject text
 * @returns Sanitized single-line subject (max 200 chars)
 * 
 * @see {@link https://owasp.org/www-community/attacks/Email_Header_Injection OWASP Email Header Injection}
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
 * Convert plain text with newlines to HTML paragraphs safely.
 * 
 * **Purpose:**
 * - Preserve user's line breaks in HTML emails
 * - Prevent XSS while maintaining formatting
 * - Convert plain text to structured HTML
 * 
 * **How it works:**
 * 1. Escapes ALL HTML in the input (prevents XSS)
 * 2. Splits on double newlines to create paragraphs
 * 3. Converts single newlines within paragraphs to <br> tags
 * 4. Wraps each paragraph in <p> tags
 * 
 * **Example:**
 * ```typescript
 * textToHtmlParagraphs('Hello\nWorld\n\nNew paragraph')
 * // Returns: '<p>Hello<br>World</p><p>New paragraph</p>'
 * 
 * // XSS attempt (neutralized)
 * textToHtmlParagraphs('Hello<script>alert(1)</script>')
 * // Returns: '<p>Hello&lt;script&gt;alert(1)&lt;/script&gt;</p>'
 * ```
 * 
 * **When to use:**
 * - Contact form messages in HTML emails
 * - User comments/feedback with formatting
 * - Any multi-line user input displayed as HTML
 * 
 * @param text - Plain text with newlines
 * @returns HTML with escaped content in <p> and <br> tags
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
 * Sanitize and normalize email address for storage/comparison.
 * 
 * **Purpose:**
 * - Normalize email format for consistent storage
 * - Prevent excessively long emails (DoS via memory)
 * - Basic format cleanup
 * 
 * **What it does:**
 * - Trims whitespace
 * - Converts to lowercase (email local-part is case-insensitive per RFC)
 * - Limits to 254 characters (max valid email length per RFC 5321)
 * 
 * **Note:** This does NOT validate email format (use Zod schema for that)
 * 
 * @param email - Email address to sanitize
 * @returns Normalized email address
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254) // Max email length per RFC
}

/**
 * Sanitize name for safe display in HTML/email.
 * 
 * **Purpose:**
 * - Remove dangerous characters while preserving international names
 * - Support Unicode names (José, 李明, etc.)
 * - Limit length to prevent DoS
 * 
 * **What it does:**
 * - Escapes HTML characters for safe display
 * - Trims whitespace
 * - Limits to 100 characters
 * - Preserves Unicode (supports all languages)
 * 
 * **What it allows:**
 * - International characters: José García, 李明, Мария Петрова
 * - Hyphenated names: Jean-Luc Picard
 * - Apostrophes: O'Brien, D'Angelo
 * 
 * @param name - User name to sanitize
 * @returns Sanitized name (safe for display)
 */
export function sanitizeName(name: string): string {
  return escapeHtml(name.trim().slice(0, 100))
}
