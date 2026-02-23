# wcag-2.2-criteria.md

## Overview

WCAG 2.2 introduces 9 new success criteria to improve web accessibility, with specific focus on input modalities, focus management, and authentication. This document covers the key criteria referenced in the master list: 2.4.11, 2.5.7, 2.5.8, and 3.3.8.

## Key Success Criteria

### 2.4.11 Focus Not Obscured (Minimum) - Level AA

**Requirement**: When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.

**Implementation Guidelines**:

- Ensure focused elements are not completely obscured by overlays, modals, or dynamic content
- Provide mechanisms to dismiss obscuring content (e.g., ESC key to close modals)
- Test keyboard focus visibility across all interactive elements
- Consider z-index management and positioning strategies

**Testing Approach**:

```javascript
// Example test for focus visibility
function testFocusNotObscured(element) {
  element.focus();
  const rect = element.getBoundingClientRect();
  const isVisible = rect.width > 0 && rect.height > 0;
  const notObscured = element === document.activeElement;

  return isVisible && notObscured;
}
```

### 2.5.7 Dragging Movements - Level AA

**Requirement**: All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential.

**Implementation Guidelines**:

- Provide alternative input methods for drag-and-drop interfaces
- Implement click-to-select + click-to-move patterns
- Offer keyboard alternatives for dragging operations
- Maintain the same functionality and outcome across input methods

**Example Implementation**:

```html
<!-- Drag alternative with click interface -->
<div class="sortable-item" tabindex="0" role="button">
  <div class="drag-handle">⋮⋮</div>
  <div class="item-content">Item content</div>
  <div class="move-controls">
    <button aria-label="Move up">↑</button>
    <button aria-label="Move down">↓</button>
  </div>
</div>
```

### 2.5.8 Target Size (Minimum) - Level AA

**Requirement**: The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except when:

- The target is available through an equivalent link or component on the same page
- The target is within a sentence or block of text
- The presentation would be altered by changing the target size
- The target size is controlled by the user agent

**Implementation Guidelines**:

- Ensure touch targets meet minimum 24×24 CSS pixel requirement
- Consider spacing between adjacent targets to prevent accidental activation
- Use CSS padding or explicit sizing to meet requirements
- Test across different devices and input methods

**CSS Example**:

```css
.button {
  min-width: 24px;
  min-height: 24px;
  padding: 8px 16px;
  /* Ensure adequate spacing */
  margin: 4px;
}

.touch-target {
  position: relative;
}

.touch-target::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  /* Invisible expanded touch area */
}
```

### 3.3.8 Accessible Authentication (Minimum) - Level AA

**Requirement**: A cognitive function test is not required for any step in an authentication process unless at least one of the following is provided:

- Alternative authentication methods without cognitive tests
- Object recognition or personal content alternatives
- Support for password managers
- Copy and paste functionality

**Implementation Guidelines**:

- Implement passwordless authentication options (biometrics, security keys)
- Ensure password manager compatibility with proper autocomplete attributes
- Provide copy/paste support for passwords and codes
- Offer multi-factor authentication without cognitive challenges
- Implement passwordless email magic links or passkeys

**Example Implementation**:

```html
<!-- Password manager friendly form -->
<form action="/login" method="post">
  <label for="username">Username</label>
  <input type="text" id="username" name="username" autocomplete="username" required />

  <label for="password">Password</label>
  <input type="password" id="password" name="password" autocomplete="current-password" required />

  <!-- Enable password manager support -->
  <button type="submit">Sign In</button>
</form>

<!-- Alternative authentication methods -->
<div class="auth-alternatives">
  <button type="button" id="biometric-auth">Use Biometrics</button>
  <button type="button" id="passkey-auth">Use Passkey</button>
  <a href="/magic-link">Send Magic Link</a>
</div>
```

## Compliance Strategy

### Implementation Timeline

- **Phase 1**: Audit existing components for WCAG 2.2 compliance
- **Phase 2**: Implement missing success criteria in new components
- **Phase 3**: Retrofit legacy components with accessibility improvements
- **Phase 4**: Comprehensive testing and validation

### Testing Requirements

- Automated testing with axe-core for detectable issues
- Manual keyboard navigation testing
- Screen reader testing with NVDA, JAWS, and VoiceOver
- Touch/mobile device testing on various screen sizes
- User testing with people with disabilities

### Documentation Requirements

- Accessibility statement with WCAG 2.2 compliance claims
- Component accessibility documentation
- Testing procedures and results
- User feedback and complaint procedures

## References

- [WCAG 2.2 Specification](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 Understanding Documents](https://www.w3.org/WAI/WCAG22/Understanding/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [W3C Web Accessibility Initiative](https://www.w3.org/WAI/)
- [Section 508 Refresh Requirements](https://www.access-board.gov/ict/)
