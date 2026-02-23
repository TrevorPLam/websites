# hhs-section-504-docs.md

## Overview

The U.S. Department of Health and Human Services (HHS) updated Section 504 regulations in May 2024, requiring federally funded healthcare providers and organizations to ensure their digital content is accessible to people with disabilities. This rule mandates WCAG 2.1 Level AA compliance for websites, mobile applications, and digital kiosks.

## Key Requirements

### WCAG 2.1 Level AA Compliance

All digital content must meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, including:

- **Websites**: Public-facing and internal web applications
- **Mobile Applications**: iOS and Android apps
- **Digital Kiosks**: Self-service terminals and check-in systems
- **Electronic Documents**: PDFs, Word documents, and other digital formats

### Compliance Deadlines

#### Phased Implementation Timeline

- **May 11, 2026**: Large organizations (15+ employees) must comply
- **May 11, 2027**: Small organizations (<15 employees) must comply
- **July 8, 2024**: Rule took effect (start of compliance period)

#### Organization Size Classification

- **Large Organizations**: 15 or more employees
- **Small Organizations**: Fewer than 15 employees
- **Deadline based on**: Organization size at time of federal funding

## Scope of Requirements

### Covered Entities

**Required to Comply:**

- Hospitals and healthcare systems receiving federal funding
- Public health departments
- Community health centers
- Medical schools and universities with federal grants
- State and local health agencies receiving HHS funding
- Research institutions with federal funding

**Digital Assets Covered:**

- Patient portals and electronic health records
- Appointment scheduling systems
- Telehealth platforms
- Billing and payment systems
- Educational and informational content
- Internal staff systems
- Mobile health applications

### Exemptions and Exceptions

**Archived Content:**

- Content not needed for active operations
- Pre-existing content not regularly updated
- Historical documents not required for current services

**Third-Party Content:**

- Content posted by users on public platforms
- Social media posts (with limitations)
- External links to non-compliant content (with proper notice)

**Technical Feasibility:**

- Fundamental alteration would burden the organization
- Specific technical limitations that cannot be reasonably overcome
- Legacy systems where compliance would require complete replacement

## WCAG 2.1 Level AA Requirements

### Perceivable (1.0)

#### 1.1 Text Alternatives

- **1.1.1 Non-text Content**: All images have descriptive alt text
- **1.2.1 Audio-only and Video-only**: Transcripts for audio, descriptions for video
- **1.2.2 Captions**: Synchronized captions for all video content
- **1.2.3 Audio Description or Alternative**: Audio descriptions for video
- **1.2.4 Captions (Live)**: Live captions for real-time video
- **1.2.5 Audio Description (Prerecorded)**: Audio descriptions for existing video

#### 1.2 Time-based Media

- **1.2.6 Sign Language (Prerecorded)**: Sign language interpretation for video

#### 1.3 Adaptable

- **1.3.1 Info and Relationships**: Semantic HTML and proper heading structure
- **1.3.2 Meaningful Sequence**: Logical reading order when CSS is removed
- **1.3.3 Sensory Characteristics**: Instructions don't rely solely on sensory characteristics

#### 1.4 Distinguishable

- **1.4.1 Use of Color**: Color not the only means of conveying information
- **1.4.2 Audio Control**: No auto-playing audio for more than 3 seconds
- **1.4.3 Contrast (Minimum)**: 4.5:1 contrast ratio for normal text
- **1.4.4 Resize Text**: Text can be resized up to 200% without loss of functionality
- **1.4.5 Images of Text**: Text images used only when essential
- **1.4.10 Reflow**: Content reflows properly on zoom (400%)
- **1.4.11 Non-text Contrast**: 3:1 contrast for UI components and graphics
- **1.4.12 Text Spacing**: Adequate spacing for readability

### Operable (2.0)

#### 2.1 Keyboard Accessible

- **2.1.1 Keyboard**: All functionality available via keyboard
- **2.1.2 No Keyboard Trap**: Focus can be moved away from any component
- **2.1.4 Character Key Shortcuts**: Can be disabled or remapped

#### 2.2 Enough Time

- **2.2.1 Timing Adjustable**: Users can adjust or disable time limits
- **2.2.2 Pause, Stop, Hide**: Controls for moving, blinking, or scrolling content
- **2.2.3 No Timing**: Essential time limits are not required
- **2.2.4 Interruptions**: Interruptions can be postponed or suppressed
- **2.2.5 Re-authenticating**: No re-authentication after session expiration
- **2.2.6 Timeouts**: Users are warned before timeouts

#### 2.3 Seizures and Physical Reactions

- **2.3.1 Three Flashes or Below**: No content that flashes more than 3 times per second
- **2.3.2 Three Flashes**: Below flash and red flash thresholds

#### 2.4 Navigable

- **2.4.1 Bypass Blocks**: Skip links to navigate repeated content
- **2.4.2 Page Titled**: Descriptive page titles
- **2.4.3 Focus Order**: Logical focus order
- **2.4.4 Link Purpose (In Context)**: Clear link purposes from context
- **2.4.5 Multiple Ways**: Multiple navigation methods
- **2.4.6 Headings and Labels**: Descriptive headings and labels
- **2.4.7 Focus Visible**: Visible focus indicators
- **2.4.8 Location**: Page location information
- **2.4.9 Link Purpose (Link Only)**: Link purpose from text alone
- **2.4.10 Section Headings**: Section headings for organization

#### 2.5 Input Modalities

- **2.5.1 Pointer Gestures**: Single-pointer alternatives to multi-point gestures
- **2.5.2 Pointer Cancellation**: Prevent accidental activation
- **2.5.3 Label in Name**: Accessible names contain visible labels
- **2.5.4 Motion Actuation**: Motion-based controls have alternatives
- **2.5.5 Target Size (Enhanced)**: 44×44 CSS pixel targets
- **2.5.6 Concurrent Input**: No input method restrictions
- **2.5.7 Dragging Movements**: Alternatives to drag operations
- **2.5.8 Target Size (Minimum)**: 24×24 CSS pixel targets

### Understandable (3.0)

#### 3.1 Readable

- **3.1.1 Language of Page**: Page language is programmatically determined
- **3.1.2 Language of Parts**: Language changes are indicated
- **3.1.3 Reading Level**: Text requires no more than lower secondary education
- **3.1.4 Abbreviations**: Abbreviations are explained or defined
- **3.1.5 Reading Level (Enhanced)**: Unusual words are defined

#### 3.2 Predictable

- **3.2.1 On Focus**: No context changes on focus
- **3.2.2 On Input**: No context changes on input
- **3.2.3 Consistent Navigation**: Consistent navigation patterns
- **3.2.4 Consistent Identification**: Consistent component identification
- **3.2.5 Change on Request**: Changes only on user request

#### 3.3 Input Assistance

- **3.3.1 Error Identification**: Errors are clearly identified
- **3.3.2 Labels or Instructions**: Labels and instructions provided
- **3.3.3 Error Suggestion**: Suggestions for error correction
- **3.3.4 Error Prevention (Legal, Financial, Data)**: Confirmation for critical actions
- **3.3.5 Help**: Context-sensitive help available
- **3.3.6 Error Prevention (All)**: Error prevention mechanisms
- **3.3.7 Redundant Entry**: Information is auto-populated when possible
- **3.3.8 Accessible Authentication**: No cognitive function tests required
- **3.3.9 Accessible Authentication (Enhanced)**: Enhanced authentication options

### Robust (4.0)

#### 4.1 Compatible

- **4.1.1 Parsing**: Valid HTML and proper element nesting
- **4.1.2 Name, Role, Value**: Name, role, and value can be programmatically determined
- **4.1.3 Status Messages**: Status messages can be programmatically determined

## Implementation Strategy

### Phase 1: Assessment and Planning (Months 1-3)

#### Accessibility Audit

- **Comprehensive Evaluation**: Audit all digital assets against WCAG 2.1 AA
- **Gap Analysis**: Identify specific compliance gaps
- **Priority Matrix**: Rank fixes by impact and implementation complexity
- **Resource Assessment**: Determine budget and staffing requirements

#### Compliance Planning

- **Roadmap Development**: Create detailed implementation timeline
- **Vendor Selection**: Choose accessibility tools and consultants
- **Team Training**: Educate developers and content creators
- **Documentation**: Establish accessibility policies and procedures

### Phase 2: Technical Implementation (Months 4-18)

#### Website Remediation

```html
<!-- Semantic HTML Structure -->
<header role="banner">
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <h1>Patient Portal</h1>
  <section aria-labelledby="appointments">
    <h2 id="appointments">Appointments</h2>
    <!-- Appointment booking interface -->
  </section>
</main>

<!-- Skip Navigation Link -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

#### Form Accessibility

```html
<form aria-labelledby="appointment-form">
  <h2 id="appointment-form">Schedule Appointment</h2>

  <div class="form-group">
    <label for="patient-name"> Full Name <span aria-label="required">*</span> </label>
    <input
      id="patient-name"
      name="patient-name"
      type="text"
      required
      aria-describedby="name-error"
      aria-invalid="false"
    />
    <div id="name-error" class="error-message" role="alert"></div>
  </div>

  <div class="form-group">
    <label for="appointment-date"> Preferred Date <span aria-label="required">*</span> </label>
    <input
      id="appointment-date"
      name="appointment-date"
      type="date"
      required
      aria-describedby="date-help date-error"
    />
    <div id="date-help" class="help-text">Select a date within the next 30 days</div>
    <div id="date-error" class="error-message" role="alert"></div>
  </div>

  <button type="submit">Schedule Appointment</button>
</form>
```

#### Mobile Application Considerations

- **Native Accessibility**: Use platform-specific accessibility APIs
- **VoiceOver/TalkBack**: Ensure screen reader compatibility
- **Touch Targets**: Minimum 44×44 pixel touch areas
- **Gesture Alternatives**: Provide button alternatives to gestures
- **Color Contrast**: Maintain 4.5:1 contrast ratios

### Phase 3: Testing and Validation (Months 16-20)

#### Automated Testing

```javascript
// Accessibility testing with axe-core
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('patient portal is accessible', async () => {
  const { container } = render(<PatientPortal />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Manual Testing

- **Screen Reader Testing**: VoiceOver, NVDA, JAWS evaluation
- **Keyboard Navigation**: Full keyboard-only navigation testing
- **Color Contrast**: Contrast ratio verification
- **Mobile Accessibility**: Touch and gesture testing

#### User Testing

- **People with Disabilities**: Include users with various disabilities
- **Assistive Technology**: Test with common assistive technologies
- **Real-world Scenarios**: Test actual user workflows
- **Feedback Collection**: Gather and implement user feedback

### Phase 4: Documentation and Training (Months 18-24)

#### Policy Documentation

```markdown
# Accessibility Policy

## Commitment

[Organization Name] is committed to ensuring digital accessibility for people with disabilities.

## Standards

We comply with WCAG 2.1 Level AA as required by HHS Section 504 regulations.

## Scope

This policy applies to all websites, mobile applications, and digital content.

## Procedures

- Regular accessibility audits
- Accessibility training for all staff
- Accessibility testing in development lifecycle
- User feedback and complaint procedures
```

#### Staff Training Programs

- **Developers**: Accessibility coding standards and techniques
- **Content Creators**: Accessible content creation guidelines
- **Designers**: Accessibility principles in design
- **Project Managers**: Accessibility requirements in project planning

## Compliance Documentation

### Records of Compliance

Maintain comprehensive documentation including:

- **Accessibility Audits**: Reports and remediation plans
- **Training Records**: Staff training completion certificates
- **Testing Results**: Automated and manual testing reports
- **User Feedback**: Complaint resolution documentation
- **Policy Updates**: Version-controlled policy documents

### Monitoring and Maintenance

- **Regular Audits**: Quarterly accessibility assessments
- **Continuous Monitoring**: Automated accessibility testing
- **Content Reviews**: Accessibility review of new content
- **Technology Updates**: Stay current with accessibility standards

## Enforcement and Penalties

### HHS Enforcement

- **Complaint Process**: Individuals can file complaints with HHS
- **Investigation**: HHS may investigate accessibility complaints
- **Corrective Action**: Required remediation within specified timeframe
- **Funding Impact**: Potential loss of federal funding for non-compliance

### Legal Risks

- **Discrimination Claims**: ADA and Section 504 lawsuits
- **Regulatory Penalties**: HHS enforcement actions
- **Funding Loss**: Suspension of federal financial assistance
- **Reputational Damage**: Negative publicity and patient trust

## Best Practices

### Development Workflow Integration

#### Accessibility in Development

```typescript
// Accessibility-focused component development
import { useA11y } from './hooks/useA11y';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const { getButtonProps } = useA11y({
    role: 'button',
    onClick,
    disabled,
  });

  return (
    <button
      {...getButtonProps()}
      className={`btn btn-${variant}`}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};
```

#### Content Management System

- **Accessible Templates**: Pre-built accessible content templates
- **Content Guidelines**: Accessibility checklists for content creators
- **Image Alt Text**: Required alt text for all images
- **Document Accessibility**: Accessible PDF and document creation

### Ongoing Compliance

#### Regular Reviews

- **Monthly**: Automated accessibility scans
- **Quarterly**: Manual accessibility audits
- **Annually**: Comprehensive compliance review
- **As Needed**: Post-major update accessibility testing

#### Continuous Improvement

- **User Feedback**: Regular collection of accessibility feedback
- **Technology Updates**: Stay current with accessibility standards
- **Staff Training**: Ongoing accessibility education
- **Process Optimization**: Improve accessibility workflows

## Resources and Tools

### Testing Tools

- **axe-core**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Color Contrast Analyzer**: Contrast ratio checking
- **Screen Readers**: VoiceOver, NVDA, JAWS for testing

### Development Resources

- **WebAIM**: Web accessibility in mind resources
- **A11y Project**: Web accessibility community
- **W3C WAI**: Web Accessibility Initiative guidelines
- **Section508.gov**: Federal accessibility resources

### Training and Certification

- **IAAP**: International Association of Accessibility Professionals
- **CPACC**: Certified Professional in Accessibility Core Competencies
- **WAS**: Web Accessibility Specialist certification
- **CPWA**: Certified Professional in Web Accessibility

## References

- [HHS Section 504 Final Rule](https://www.hhs.gov/civil-rights/for-providers/section504/index.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WebAIM WCAG 2.1 Checklist](https://webaim.org/standards/wcag/checklist)
- [Section508.gov Accessibility Requirements](https://www.section508.gov/)
- [Deque University Accessibility Training](https://dequeuniversity.com/)
- [A11y Project Accessibility Resources](https://www.a11yproject.com/)
