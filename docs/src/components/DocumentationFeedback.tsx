/**
 * @file DocumentationFeedback.tsx
 * @summary User feedback widget for documentation pages.
 * @description Collects thumbs-up / thumbs-down signals and optional written
 *   comments from readers. Submits feedback via a GitHub issue link (no
 *   server required) so that the team can track documentation quality in the
 *   existing issue tracker.
 * @security No PII collected; all input is optional and user-initiated.
 */

import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './DocumentationFeedback.module.css';

type FeedbackState = 'idle' | 'positive' | 'negative' | 'submitted';

interface DocumentationFeedbackProps {
  /** Current page title, injected by the Docusaurus theme wrapper. */
  pageTitle?: string;
  /** Current page path, used to build the issue URL. */
  pagePath?: string;
}

/**
 * Renders a "Was this page helpful?" widget at the bottom of every
 * documentation page.  Clicking 👎 reveals a textarea where the reader can
 * describe what was missing or unclear.  On submission the component opens a
 * pre-filled GitHub issue so the team is notified without requiring any
 * backend infrastructure.
 *
 * The GitHub repository URL is derived from the Docusaurus `siteConfig`
 * (specifically `siteConfig.customFields.githubRepo`) so it remains correct
 * in forks and renamed repositories.
 */
export function DocumentationFeedback({
  pageTitle = 'this page',
  pagePath = '',
}: DocumentationFeedbackProps): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const githubRepo =
    (siteConfig.customFields?.githubRepo as string | undefined) ??
    'TrevorPLam/websites';

  const [state, setState] = useState<FeedbackState>('idle');
  const [comment, setComment] = useState('');

  function handlePositive(): void {
    setState('submitted');
  }

  function handleNegative(): void {
    setState('negative');
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();

    const issueTitle = encodeURIComponent(`Docs feedback: ${pageTitle}`);
    const issueBody = encodeURIComponent(
      [
        `**Page**: ${pagePath || pageTitle}`,
        '',
        '**Feedback**:',
        comment || '(No comment provided)',
        '',
        '---',
        '_Submitted via the documentation feedback widget._',
      ].join('\n'),
    );

    const issueUrl = `https://github.com/${githubRepo}/issues/new?title=${issueTitle}&body=${issueBody}&labels=documentation`;
    window.open(issueUrl, '_blank', 'noopener,noreferrer');

    setState('submitted');
  }

  if (state === 'submitted') {
    return (
      <div className={styles.feedback} aria-live="polite">
        <p className={styles.thankYou}>✅ Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className={styles.feedback}>
      <p className={styles.question}>Was this page helpful?</p>

      {state === 'idle' && (
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.btnPositive}
            onClick={handlePositive}
            aria-label="Yes, this page was helpful"
          >
            👍 Yes
          </button>
          <button
            type="button"
            className={styles.btnNegative}
            onClick={handleNegative}
            aria-label="No, this page needs improvement"
          >
            👎 No
          </button>
        </div>
      )}

      {state === 'negative' && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="feedback-comment" className={styles.label}>
            How can we improve this page?
          </label>
          <textarea
            id="feedback-comment"
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what was missing or unclear…"
            rows={4}
          />
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.btnSubmit}
              aria-label="Submit documentation feedback"
            >
              Submit feedback
            </button>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={() => setState('idle')}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default DocumentationFeedback;
