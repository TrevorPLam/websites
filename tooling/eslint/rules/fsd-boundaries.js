/**
 * @file tooling/eslint/rules/fsd-boundaries.js
 * @summary Custom ESLint rule enforcing FSD layer boundaries.
 * @description Blocks upward imports (e.g., entities -> widgets) by comparing current and imported layer order.
 * @security Prevents architectural bypass patterns that can leak responsibilities across layers.
 * @adr none
 * @requirements Wave-0 Task-1 (custom FSD boundary lint rule)
 */

'use strict';

const LAYER_ORDER = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'];

function getLayer(value) {
  if (typeof value !== 'string') return null;
  for (const layer of LAYER_ORDER) {
    if (value.startsWith(`@/${layer}/`) || value.startsWith(`${layer}/`)) {
      return layer;
    }
  }
  return null;
}

function findCurrentLayer(filename) {
  if (typeof filename !== 'string') return null;
  const normalized = filename.replace(/\\/g, '/');
  const segments = normalized.split('/');
  for (const layer of LAYER_ORDER) {
    if (segments.includes(layer)) {
      return layer;
    }
  }
  return null;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent FSD upward import violations and direct cross-layer coupling',
    },
    schema: [],
    messages: {
      invalidBoundary:
        'FSD boundary violation: "{{from}}" layer cannot import from "{{to}}" layer directly.',
    },
  },

  create(context) {
    const filename = context.getFilename();
    const fromLayer = findCurrentLayer(filename);

    return {
      ImportDeclaration(node) {
        if (!node.source || !node.source.value) return;

        const toLayer = getLayer(node.source.value);
        if (!fromLayer || !toLayer) return;

        const fromIndex = LAYER_ORDER.indexOf(fromLayer);
        const toIndex = LAYER_ORDER.indexOf(toLayer);

        if (fromIndex === -1 || toIndex === -1) return;

        if (toIndex > fromIndex) {
          context.report({
            node,
            messageId: 'invalidBoundary',
            data: {
              from: fromLayer,
              to: toLayer,
            },
          });
        }
      },
    };
  },
};
