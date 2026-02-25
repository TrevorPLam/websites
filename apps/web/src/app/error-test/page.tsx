/**
 * @file apps/web/app/error-test/page.tsx
 * @summary Test page for error boundary functionality
 * @description Demonstrates error boundary catching component errors
 * @security Test page for error handling validation
 * @requirements PROD-003
 */

'use client';

import React, { useState } from 'react';

// Component that throws an error
const BuggyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error from BuggyComponent');
  }
  
  return (
    <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
      <h3 className="text-green-800 dark:text-green-200 font-medium">
        Buggy Component (Working)
      </h3>
      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
        This component is working fine!
      </p>
    </div>
  );
};

// Nested component that throws an error
const NestedBuggyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error from NestedBuggyComponent');
  }
  
  return (
    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg mt-4">
      <h3 className="text-blue-800 dark:text-blue-200 font-medium">
        Nested Component (Working)
      </h3>
      <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
        This nested component is working fine!
      </p>
    </div>
  );
};

// Simple error boundary for testing
class TestErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`${this.props.name} caught error:`, {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-2 border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950 rounded-lg">
          <h3 className="text-red-800 dark:text-red-200 font-medium">
            {this.props.name} Caught an Error
          </h3>
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 px-3 py-1 text-sm bg-red-200 dark:bg-red-800 rounded hover:bg-red-300 dark:hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorTestPage() {
  const [shouldThrow1, setShouldThrow1] = useState(false);
  const [shouldThrow2, setShouldThrow2] = useState(false);
  const [shouldThrowNested, setShouldThrowNested] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Error Boundary Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Test error boundary functionality by toggling component errors.
        </p>

        {/* Test Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Test 1: Component Error Boundary
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => setShouldThrow1(!shouldThrow1)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  shouldThrow1
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {shouldThrow1 ? 'Trigger Error' : 'Fix Component'}
              </button>
            </div>

            <TestErrorBoundary name="Boundary 1">
              <BuggyComponent shouldThrow={shouldThrow1} />
            </TestErrorBoundary>
          </div>
        </section>

        {/* Test Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Test 2: Independent Error Boundary
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => setShouldThrow2(!shouldThrow2)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  shouldThrow2
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {shouldThrow2 ? 'Trigger Error' : 'Fix Component'}
              </button>
            </div>

            <TestErrorBoundary name="Boundary 2">
              <BuggyComponent shouldThrow={shouldThrow2} />
            </TestErrorBoundary>
          </div>
        </section>

        {/* Test Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Test 3: Nested Error Boundary
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => setShouldThrowNested(!shouldThrowNested)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  shouldThrowNested
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {shouldThrowNested ? 'Trigger Nested Error' : 'Fix Nested Component'}
              </button>
            </div>

            <TestErrorBoundary name="Parent Boundary">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <h3 className="text-purple-800 dark:text-purple-200 font-medium">
                  Parent Component (Working)
                </h3>
                <TestErrorBoundary name="Nested Boundary">
                  <NestedBuggyComponent shouldThrow={shouldThrowNested} />
                </TestErrorBoundary>
              </div>
            </TestErrorBoundary>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            How to Test
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Click "Trigger Error" buttons to cause components to throw errors</li>
            <li>• Observe how error boundaries catch and display errors gracefully</li>
            <li>• Note that other components continue working when one fails</li>
            <li>• Click "Reset" or "Fix Component" to recover from errors</li>
            <li>• Check browser console for error logging</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
