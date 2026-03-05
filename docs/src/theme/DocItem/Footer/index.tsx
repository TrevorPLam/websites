/**
 * @file docs/src/theme/DocItem/Footer/index.tsx
 * @summary Swizzled Docusaurus DocItem Footer – appends the documentation
 *   feedback widget to every documentation page.
 * @description Wraps the original @theme/DocItem/Footer component and renders
 *   <DocumentationFeedback> below it.  Uses Docusaurus's official "wrapper"
 *   swizzle approach so upstream theme updates are inherited automatically.
 * @security No server calls; feedback links open a pre-filled GitHub issue.
 */

import React from 'react';
import DocItemFooter from '@theme-original/DocItem/Footer';
import type DocItemFooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { DocumentationFeedback } from '@site/src/components/DocumentationFeedback';

type Props = WrapperProps<typeof DocItemFooterType>;

/**
 * Renders the original DocItem/Footer and appends the feedback widget.
 * The current page title and path are read from Docusaurus's `useDoc()` hook
 * so the feedback issue is pre-filled with the correct context.
 */
export default function DocItemFooterWrapper(props: Props): React.ReactElement {
  const { metadata } = useDoc();

  return (
    <>
      <DocItemFooter {...props} />
      <DocumentationFeedback
        pageTitle={metadata.title}
        pagePath={metadata.permalink}
      />
    </>
  );
}
