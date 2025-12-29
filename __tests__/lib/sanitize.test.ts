import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  sanitizeEmailSubject,
  textToHtmlParagraphs,
  sanitizeEmail,
  sanitizeName,
} from '@/lib/sanitize'

describe('sanitize utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>'
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
      expect(escapeHtml(input)).toBe(expected)
    })

    it('should escape ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
    })

    it('should escape quotes', () => {
      expect(escapeHtml(`"Hello" and 'World'`)).toBe('&quot;Hello&quot; and &#x27;World&#x27;')
    })

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('')
    })

    it('should not double-escape', () => {
      const input = '&lt;script&gt;'
      const expected = '&amp;lt;script&amp;gt;'
      expect(escapeHtml(input)).toBe(expected)
    })
  })

  describe('sanitizeEmailSubject', () => {
    it('should remove newlines', () => {
      const input = 'Subject\nwith\nnewlines'
      expect(sanitizeEmailSubject(input)).not.toContain('\n')
    })

    it('should remove carriage returns', () => {
      const input = 'Subject\rwith\rreturns'
      expect(sanitizeEmailSubject(input)).not.toContain('\r')
    })

    it('should limit length to 200 characters', () => {
      const input = 'a'.repeat(300)
      expect(sanitizeEmailSubject(input)).toHaveLength(200)
    })

    it('should trim whitespace', () => {
      const input = '  Subject with spaces  '
      expect(sanitizeEmailSubject(input)).toBe('Subject with spaces')
    })

    it('should collapse multiple spaces', () => {
      const input = 'Too    many    spaces'
      expect(sanitizeEmailSubject(input)).toBe('Too many spaces')
    })

    it('should handle email header injection attempts', () => {
      const input = 'Subject\r\nBcc: hacker@evil.com'
      const result = sanitizeEmailSubject(input)
      expect(result).not.toContain('\r')
      expect(result).not.toContain('\n')
    })
  })

  describe('textToHtmlParagraphs', () => {
    it('should convert single line to paragraph', () => {
      const input = 'Hello world'
      const expected = '<p>Hello world</p>'
      expect(textToHtmlParagraphs(input)).toBe(expected)
    })

    it('should escape HTML in text', () => {
      const input = '<script>alert("XSS")</script>'
      expect(textToHtmlParagraphs(input)).toContain('&lt;script&gt;')
    })

    it('should convert newlines to br tags', () => {
      const input = 'Line 1\nLine 2'
      expect(textToHtmlParagraphs(input)).toContain('<br>')
    })

    it('should handle multiple paragraphs', () => {
      const input = 'Paragraph 1\n\nParagraph 2'
      const result = textToHtmlParagraphs(input)
      expect(result).toContain('<p>Paragraph 1</p>')
      expect(result).toContain('<p>Paragraph 2</p>')
    })

    it('should handle empty input', () => {
      const input = ''
      expect(textToHtmlParagraphs(input)).toBe('<p></p>')
    })
  })

  describe('sanitizeEmail', () => {
    it('should lowercase email', () => {
      expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com')
    })

    it('should trim whitespace', () => {
      expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com')
    })

    it('should limit to 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      expect(sanitizeEmail(longEmail)).toHaveLength(254)
    })
  })

  describe('sanitizeName', () => {
    it('should escape HTML', () => {
      const input = '<script>John</script>'
      expect(sanitizeName(input)).toContain('&lt;script&gt;')
    })

    it('should trim whitespace', () => {
      expect(sanitizeName('  John Doe  ')).toBe('John Doe')
    })

    it('should limit to 100 characters', () => {
      const longName = 'a'.repeat(150)
      expect(sanitizeName(longName)).toHaveLength(100)
    })

    it('should preserve international characters', () => {
      const input = 'José García'
      expect(sanitizeName(input)).toBe('José García')
    })
  })
})
