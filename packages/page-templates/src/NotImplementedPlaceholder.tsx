/**
 * Placeholder UI for scaffolded page templates not yet implemented.
 * Renders a clear "coming soon" message instead of bare "TODO" text.
 * Use when templates are still under development.
 *
 * @see docs/architecture/ - Page template implementation status
 */
import type React from 'react';

interface NotImplementedPlaceholderProps {
  /** Template name for display (e.g. "HomePageTemplate") */
  templateName: string;
  /** Optional description of what will be implemented */
  description?: string;
}

export function NotImplementedPlaceholder({
  templateName,
  description = 'This template is scaffolded and will be implemented in a future release.',
}: NotImplementedPlaceholderProps): React.ReactElement {
  return (
    <section
      data-template={templateName}
      data-status="not-implemented"
      aria-label={`${templateName} placeholder`}
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center"
    >
      <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {templateName}
      </h2>
      <p className="max-w-md text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Status: Scaffolded — implementation pending
      </p>
    </section>
  );
}
