/**
 * @file packages/infra/security/sanitize.ts
 * Purpose: Input sanitization (sanitizeName, sanitizeEmail, escapeHtml, etc.) — XSS and injection prevention.
 * Relationship: Used by template lib/actions/helpers and contact flows. No @repo deps.
 * System role: Exports sanitize* and escapeHtml; config for allowBasicHtml/allowUnicode/strict.
 * Assumptions: Names/emails validated length and pattern; sanitize for storage/display only.
 */
// Import constants for validation limits
const FORM_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 254,
  EMAIL_SUBJECT_MAX_LENGTH: 200,
} as const;

const RELATIVE_URL_PATTERN = /^(\/(?!\/)|\.{1,2}\/|[?#])/;

/**
 * Sanitization configuration options
 * Allows fine-tuning of security vs functionality trade-offs
 */
export interface SanitizeConfig {
  /** Allow basic HTML formatting (bold, italic, links) */
  allowBasicHtml?: boolean;
  /** Allow international characters and emojis */
  allowUnicode?: boolean;
  /** Strict mode for high-security contexts */
  strict?: boolean;
  /** Maximum length for text content */
  maxLength?: number;
}

/**
 * HTML entity mapping for XSS prevention
 * Maps dangerous characters to safe HTML entities
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Allowed HTML tags for basic formatting (when allowBasicHtml is true)
 * Whitelist approach for maximum security
 */
// [Task 9.7.2] Converted from Array to Set for O(1) lookup instead of O(n) indexOf scans
const ALLOWED_HTML_TAGS = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'a', 'ul', 'ol', 'li']);

/**
 * Allowed HTML attributes for basic formatting
 * Extremely restrictive to prevent XSS
 */
// [Task 9.7.2] Converted from Array to Set for O(1) lookup
const ALLOWED_HTML_ATTRIBUTES = new Set(['href', 'title']);

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
 * ```
 *
 * @param text - User input to escape
 * @returns HTML-safe string with special characters escaped
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Sanitize HTML content using a whitelist approach
 * Implements 2026 best practices with DOMPurify-like functionality
 *
 * **Features:**
 * - Whitelist-based tag and attribute filtering
 * - Protocol validation for links
 * - Unicode and international character support
 * - Configurable security levels
 *
 * @param html - HTML content to sanitize
 * @param config - Sanitization configuration
 * @returns Sanitized HTML safe for display
 */
export function sanitizeHtml(html: string, config: SanitizeConfig = {}): string {
  const { allowBasicHtml = false, strict = true } = config;

  if (!allowBasicHtml || strict) {
    // Strict mode: escape everything
    return escapeHtml(html);
  }

  // Basic HTML mode: simple whitelist filtering
  // Note: This is a simplified implementation. In production, consider using DOMPurify
  return html
    .replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
      const lowerTag = tag.toLowerCase();
      // [Task 9.6.4] Replaced indexOf with Set.has() for clarity and performance
      if (!ALLOWED_HTML_TAGS.has(lowerTag)) {
        return escapeHtml(match);
      }

      // Process attributes
      const cleanAttrs = attrs
        .replace(
          /(\w+)=["']([^"']*)["']/g,
          (_attrMatch: string, attrName: string, attrValue: string) => {
            const lowerAttr = attrName.toLowerCase();
            if (!ALLOWED_HTML_ATTRIBUTES.has(lowerAttr)) {
              return '';
            }

            // Validate href attributes
            if (lowerAttr === 'href') {
              const sanitizedUrl = sanitizeUrl(attrValue);
              return sanitizedUrl ? `${attrName}="${sanitizedUrl}"` : '';
            }

            return `${attrName}="${escapeHtml(attrValue)}"`;
          }
        )
        .trim();

      return `<${lowerTag}${cleanAttrs ? ' ' + cleanAttrs : ''}>`;
    })
    .replace(/<\/(\w+)>/g, (match: string, tag: string) => {
      const lowerTag = tag.toLowerCase();
      // [Task 9.6.4] Replaced indexOf with Set.has()
      return ALLOWED_HTML_TAGS.has(lowerTag) ? `</${lowerTag}>` : escapeHtml(match);
    });
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
 * - Limits length to prevent abuse
 *
 * @param subject - User-provided subject text
 * @param maxLength - Maximum allowed length (defaults to EMAIL_SUBJECT_MAX_LENGTH)
 * @returns Sanitized single-line subject
 */
export function sanitizeEmailSubject(subject: string, maxLength?: number): string {
  const finalMaxLength = maxLength || FORM_VALIDATION.EMAIL_SUBJECT_MAX_LENGTH;
  return subject
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, finalMaxLength);
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
 * @param text - Plain text with newlines
 * @param config - Sanitization configuration
 * @returns HTML with escaped content in <p> and <br> tags
 */
export function textToHtmlParagraphs(text: string, config: SanitizeConfig = {}): string {
  const { allowBasicHtml = false } = config;

  const escaped = allowBasicHtml ? sanitizeHtml(text, config) : escapeHtml(text);
  const paragraphs = escaped
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return paragraphs || `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
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
 * @param email - Email address to sanitize
 * @returns Normalized email address
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, FORM_VALIDATION.EMAIL_MAX_LENGTH);
}

/**
 * Sanitize name for safe display in HTML/email.
 *
 * **Purpose:**
 * - Remove dangerous characters while preserving international names
 * - Support Unicode names (José, 李明, etc.)
 * - Limit length to prevent DoS
 *
 * **Features:**
 * - Escapes HTML characters for safe display
 * - Trims whitespace
 * - Limits to reasonable length
 * - Preserves Unicode (supports all languages)
 *
 * @param name - User name to sanitize
 * @param config - Sanitization configuration
 * @returns Sanitized name (safe for display)
 */
export function sanitizeName(name: string, config: SanitizeConfig = {}): string {
  const { maxLength = FORM_VALIDATION.NAME_MAX_LENGTH } = config;
  return escapeHtml(name.trim().slice(0, maxLength));
}

/**
 * Sanitize URLs for safe use in links.
 *
 * **Purpose:**
 * - Prevent javascript: or other dangerous URL schemes
 * - Normalize URLs for storage or rendering
 * - Support both absolute and relative URLs
 *
 * **Features:**
 * - Protocol validation (http/https only)
 * - Relative URL support for internal links
 * - Whitespace rejection to prevent parsing ambiguity
 *
 * @param url - User-provided URL
 * @returns Sanitized URL string, or empty string if invalid/unsafe
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  if (/\s/.test(trimmed)) {
    // Reject whitespace to avoid ambiguous parsing and header-style injections
    return '';
  }

  if (RELATIVE_URL_PATTERN.test(trimmed)) {
    // Relative URLs are safe for internal navigation
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize user input based on content type and context
 * Context-aware sanitization for different use cases
 *
 * @param input - User input to sanitize
 * @param contentType - Type of content (text, html, email, url, name)
 * @param config - Sanitization configuration
 * @returns Sanitized content appropriate for the context
 */
export function sanitizeInput(
  input: string,
  contentType: 'text' | 'html' | 'email-subject' | 'email' | 'url' | 'name',
  config: SanitizeConfig = {}
): string {
  switch (contentType) {
    case 'html':
      return sanitizeHtml(input, config);
    case 'email-subject':
      return sanitizeEmailSubject(input, config.maxLength);
    case 'email':
      return sanitizeEmail(input);
    case 'url':
      return sanitizeUrl(input);
    case 'name':
      return sanitizeName(input, config);
    case 'text':
    default:
      return escapeHtml(input);
  }
}

/**
 * Validate and sanitize content with comprehensive checks
 * Combines validation and sanitization for maximum security
 *
 * @param input - User input to validate and sanitize
 * @param contentType - Type of content
 * @param config - Sanitization configuration
 * @returns Object with isValid flag and sanitized content
 */
export function validateAndSanitize(
  input: string,
  contentType: 'text' | 'html' | 'email-subject' | 'email' | 'url' | 'name',
  config: SanitizeConfig = {}
): { isValid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  let sanitized = input;

  // Basic validation
  if (!input || typeof input !== 'string') {
    errors.push('Input is required and must be a string');
    return { isValid: false, sanitized: '', errors };
  }

  // Length validation
  if (config.maxLength && input.length > config.maxLength) {
    errors.push(`Content exceeds maximum length of ${config.maxLength} characters`);
  }

  // Content-type specific validation
  switch (contentType) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
      break;
    case 'url':
      if (!sanitizeUrl(input)) {
        errors.push('Invalid or unsafe URL');
      }
      break;
    case 'name':
      if (input.length < FORM_VALIDATION.NAME_MIN_LENGTH) {
        errors.push(`Name must be at least ${FORM_VALIDATION.NAME_MIN_LENGTH} characters`);
      }
      break;
  }

  // Sanitize regardless of validation (defense in depth)
  sanitized = sanitizeInput(input, contentType, config);

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Legacy compatibility wrapper
 * Maintains backward compatibility with existing implementations
 * @deprecated Use specific sanitize functions or validateAndSanitize
 */
export const legacySanitize = {
  escapeHtml,
  sanitizeEmailSubject,
  textToHtmlParagraphs,
  sanitizeEmail,
  sanitizeName,
  sanitizeUrl,
};
