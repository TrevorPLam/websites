

'use client';

import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@repo/ui';
import { UI_TIMING } from '@/lib/constants';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * InstallPrompt component for PWA installation.
 *
 * **Memory Safety:** All timers properly cleaned up on unmount.
 * **SSR Safety:** All browser API access guarded with window checks.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // SSR Safety: Check if window is available (Issue #026 fixed)
    if (typeof window === 'undefined') return;

    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const installed = localStorage.getItem('pwa-installed');

    if (dismissed || installed) {
      return;
    }

    // Timer ID for cleanup (Issue #025 fixed - proper cleanup scope)
    let promptTimerId: NodeJS.Timeout | null = null;

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show the install prompt after a delay (to not be too intrusive)
      // Memory-safe: Timer will be cleaned up on unmount
      promptTimerId = setTimeout(() => {
        setShowPrompt(true);
      }, UI_TIMING.PWA_INSTALL_PROMPT_DELAY_MS);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      localStorage.setItem('pwa-installed', 'true');
    }

    // Cleanup: Remove event listener AND cancel timer
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (promptTimerId) {
        clearTimeout(promptTimerId);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // SSR Safety check
    if (typeof window === 'undefined') return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
    } else {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // SSR Safety check
    if (typeof window === 'undefined') return;

    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl animate-slide-up md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-lg">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Dismiss install prompt"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Install Our App</h3>
          <p className="text-sm text-blue-100 mb-3">
            Get quick access to our hair salon services with our mobile app. Works offline!
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={handleInstall}
              className="bg-white text-blue-600 hover:bg-blue-50 border-0"
            >
              Install
            </Button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
