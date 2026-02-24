'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveOnboardingStep, completeOnboarding } from '../model/save-step';
import {
  ONBOARDING_STEPS,
  STEP_META,
  type OnboardingStep,
  type OnboardingData,
} from '../model/onboarding-machine';

interface OnboardingWizardProps {
  initialStep: OnboardingStep;
  initialData: Partial<OnboardingData>;
}

export function OnboardingWizard({ initialStep, initialData }: OnboardingWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [savedData, setSavedData] = useState<Partial<OnboardingData>>(initialData);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const stepMeta = STEP_META[currentStep];
  const isLastDataStep = currentStep === 'integrations';
  const isReviewStep = currentStep === 'review';
  const totalDataSteps = 6;

  const handleStepSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      setError(null);

      startTransition(async () => {
        if (isReviewStep) {
          const result = await completeOnboarding({});
          if ('error' in result && result.error) {
            setError(result.error);
            return;
          }
          router.push('/dashboard?onboarded=1');
          return;
        }

        // Save step data
        const result = await saveOnboardingStep({
          step: currentStep as any,
          data,
        });

        if ('error' in result && result.error) {
          setError(result.error);
          return;
        }

        // Update local state
        setSavedData((prev) => ({ ...prev, [currentStep]: data }));

        // Advance to next step
        const nextIndex = stepIndex + 1;
        if (nextIndex < ONBOARDING_STEPS.length) {
          setCurrentStep(ONBOARDING_STEPS[nextIndex]);
        }
      });
    },
    [currentStep, isReviewStep, router, stepIndex]
  );

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[stepIndex - 1]);
    }
  }, [stepIndex]);

  const handleSkip = useCallback(() => {
    if (stepMeta.optional) {
      setCurrentStep(ONBOARDING_STEPS[stepIndex + 1]);
    }
  }, [stepIndex, stepMeta.optional]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              Step {Math.min(stepIndex + 1, totalDataSteps)} of {totalDataSteps}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((stepIndex / totalDataSteps) * 100)}% complete
            </span>
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-valuenow={stepIndex}
            aria-valuemin={0}
            aria-valuemax={totalDataSteps}
            aria-label="Onboarding progress"
            className="h-2 bg-gray-200 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(stepIndex / totalDataSteps) * 100}%` }}
            />
          </div>

          {/* Step pills */}
          <nav aria-label="Onboarding steps" className="mt-3">
            <ol className="flex gap-1 overflow-x-auto pb-1">
              {ONBOARDING_STEPS.filter((s) => s !== 'complete').map((step, i) => {
                const isCompleted = i < stepIndex;
                const isCurrent = step === currentStep;

                return (
                  <li key={step}>
                    <button
                      type="button"
                      onClick={() => isCompleted && setCurrentStep(step)}
                      disabled={!isCompleted}
                      className={`
                        px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap
                        ${isCurrent ? 'bg-primary text-white' : ''}
                        ${isCompleted && !isCurrent ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                      `}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      {isCompleted && !isCurrent ? '✓ ' : ''}
                      {STEP_META[step].title.split(' ').slice(0, 3).join(' ')}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{stepMeta.title}</h1>
            <p className="mt-2 text-gray-500">{stepMeta.description}</p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Dynamic step form — renders the right form for the current step */}
          <StepForm
            step={currentStep}
            defaultValues={(savedData as any)[currentStep] ?? {}}
            onSubmit={handleStepSubmit}
            isPending={isPending}
            onBack={stepIndex > 0 ? handleBack : undefined}
            onSkip={stepMeta.optional ? handleSkip : undefined}
            isReview={isReviewStep}
            allData={savedData}
          />
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP FORM ROUTER
// Each step renders its own form component with pre-filled defaults.

function StepForm({
  step,
  defaultValues,
  onSubmit,
  isPending,
  onBack,
  onSkip,
  isReview,
  allData,
}: {
  step: OnboardingStep;
  defaultValues: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isPending: boolean;
  onBack?: () => void;
  onSkip?: () => void;
  isReview?: boolean;
  allData: Partial<OnboardingData>;
}) {
  const schema = STEP_META[step]?.schema;

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: 'onChange',
  });

  if (isReview) {
    return (
      <ReviewStep
        allData={allData}
        onSubmit={() => onSubmit({})}
        isPending={isPending}
        onBack={onBack}
      />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit as any)}
      noValidate
      aria-label={`${STEP_META[step].title} form`}
    >
      {/* Step-specific fields would be rendered here via a component map */}
      {/* e.g. step === 'business-info' ? <BusinessInfoFields form={form} /> : ... */}

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary"
          >
            ← Back
          </button>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="ml-auto flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary"
          aria-disabled={isPending}
        >
          {isPending ? (
            <>
              <span
                className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                aria-hidden="true"
              />
              Saving…
            </>
          ) : (
            'Continue →'
          )}
        </button>

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Skip for now
          </button>
        )}
      </div>

      {/* Auto-save indicator */}
      {form.formState.isDirty && (
        <p className="mt-3 text-xs text-gray-400 text-right" aria-live="polite">
          Progress is saved automatically when you continue.
        </p>
      )}
    </form>
  );
}

function ReviewStep({
  allData,
  onSubmit,
  isPending,
  onBack,
}: {
  allData: Partial<OnboardingData>;
  onSubmit: () => void;
  isPending: boolean;
  onBack?: () => void;
}) {
  const businessInfo = allData['business-info'];
  const contactHours = allData['contact-hours'];

  return (
    <div>
      <div className="space-y-4 mb-8">
        <SummaryCard title="Business" value={businessInfo?.businessName ?? '—'} />
        <SummaryCard title="Phone" value={contactHours?.phone ?? '—'} />
        <SummaryCard title="Email" value={contactHours?.email ?? '—'} />
        <SummaryCard
          title="Services"
          value={`${allData.services?.services?.length ?? 0} configured`}
        />
        <SummaryCard
          title="Domain"
          value={
            allData.domain?.subdomain
              ? `${allData.domain.subdomain}.youragency.com`
              : (allData.domain?.customDomain ?? '—')
          }
        />
      </div>

      <div className="flex items-center gap-3 pt-6 border-t">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="ml-auto flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? 'Launching…' : '🚀 Launch My Site'}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
