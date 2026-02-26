/**
 * @file packages/monitoring/src/client.ts
 * @summary Client-side Real User Monitoring (RUM) tracking utilities
 * @description Client components for collecting RUM metrics with privacy compliance
 * @security GDPR-compliant data collection with user consent management
 * @requirements TASK-007.1 / client-rum-tracking / privacy-compliance
 * @version 2026.02.26
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PerformanceMetrics } from '@repo/analytics/src/performance-monitoring';

export interface RUMTrackerConfig {
  tenantId: string;
  userId?: string;
  enableAutoTracking?: boolean;
  consentRequired?: boolean;
  sampleRate?: number; // 0-1, percentage of users to track
  debug?: boolean;
  apiEndpoint?: string;
  batchSize?: number;
  flushInterval?: number;
}

export interface RUMTrackerOptions {
  route?: string;
  customMetrics?: Record<string, number>;
  tags?: Record<string, string>;
  userConsent?: boolean;
}

export interface RUMSession {
  sessionId: string;
  userId?: string;
  tenantId: string;
  startTime: number;
  pageLoadStartTime: number;
  userAgent: string;
  viewport: { width: number; height: number };
  connection: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
}

export interface RUMEvent {
  type: 'performance' | 'interaction' | 'error' | 'custom';
  timestamp: number;
  data: any;
  sessionId: string;
  route: string;
}

/**
 * Client-side RUM tracker for collecting user performance metrics
 */
class RUMTracker {
  private config: RUMTrackerConfig;
  private session: RUMSession | null = null;
  private eventQueue: RUMEvent[] = [];
  private isTracking = false;
  private flushTimer: NodeJS.Timeout | null = null;
  private hasUserConsent = false;

  constructor(config: RUMTrackerConfig) {
    this.config = {
      enableAutoTracking: true,
      consentRequired: true,
      sampleRate: 1.0,
      debug: false,
      apiEndpoint: '/api/analytics/rum',
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      ...config,
    };

    // Check if user should be sampled
    if (Math.random() > this.config.sampleRate) {
      if (this.config.debug) {
        console.log('RUM: User not sampled for tracking');
      }
      return;
    }

    // Check user consent
    if (this.config.consentRequired) {
      this.hasUserConsent = this.getUserConsent();
      if (!this.hasUserConsent) {
        if (this.config.debug) {
          console.log('RUM: User consent not granted');
        }
        return;
      }
    } else {
      this.hasUserConsent = true;
    }

    this.initializeSession();
    this.setupAutoTracking();
  }

  /**
   * Initialize RUM session
   */
  private initializeSession(): void {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    this.session = {
      sessionId: this.generateSessionId(),
      userId: this.config.userId,
      tenantId: this.config.tenantId,
      startTime: now,
      pageLoadStartTime: navigation ? navigation.fetchStart : now,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: this.getConnectionInfo(),
      location: this.getLocationInfo(),
    };

    this.isTracking = true;
    this.startFlushTimer();

    if (this.config.debug) {
      console.log('RUM: Session initialized', this.session);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${this.config.tenantId}-${timestamp}-${random}`;
  }

  /**
   * Get connection information
   */
  private getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        effectiveType: conn.effectiveType || 'unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0,
      };
    }
    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
    };
  }

  /**
   * Get location information (with privacy considerations)
   */
  private getLocationInfo() {
    // Only collect location if user has consent and it's available
    if (!this.hasUserConsent) return undefined;

    // Use timezone as a privacy-friendly location indicator
    return {
      country: 'unknown', // Don't collect country without explicit consent
      city: 'unknown',   // Don't collect city without explicit consent
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * Check user consent for tracking
   */
  private getUserConsent(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for existing consent
    const consent = localStorage.getItem('rum-tracking-consent');
    if (consent) {
      return consent === 'granted';
    }

    // Check for GDPR region
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const euTimezones = ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'];
    const isInEU = euTimezones.some(tz => timezone.includes(tz.split('/')[0]));

    if (isInEU) {
      // Require explicit consent in EU regions
      return false;
    }

    // Default to consent for non-EU regions (can be overridden)
    return true;
  }

  /**
   * Setup automatic performance tracking
   */
  private setupAutoTracking(): void {
    if (!this.config.enableAutoTracking || !this.isTracking) return;

    // Track Core Web Vitals
    this.trackCoreWebVitals();

    // Track route changes
    this.trackRouteChanges();

    // Track errors
    this.trackErrors();

    // Track user interactions
    this.trackInteractions();
  }

  /**
   * Track Core Web Vitals using web-vitals library
   */
  private async trackCoreWebVitals(): Promise<void> {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB, getINP } = await import('web-vitals');

      const trackMetric = (name: string, metric: any) => {
        this.trackEvent('performance', {
          name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      };

      // Track Core Web Vitals
      getCLS((metric) => trackMetric('CLS', metric));
      getFID((metric) => trackMetric('FID', metric));
      getFCP((metric) => trackMetric('FCP', metric));
      getLCP((metric) => trackMetric('LCP', metric));
      getTTFB((metric) => trackMetric('TTFB', metric));
      getINP((metric) => trackMetric('INP', metric));

    } catch (error) {
      if (this.config.debug) {
        console.error('RUM: Failed to load web-vitals library', error);
      }
    }
  }

  /**
   * Track route changes for SPAs
   */
  private trackRouteChanges(): void {
    if (typeof window === 'undefined') return;

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });

    // Override pushState and replaceState to detect programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.trackPageView(window.location.pathname);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.trackPageView(window.location.pathname);
    };
  }

  /**
   * Track JavaScript errors
   */
  private trackErrors(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.trackEvent('error', {
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('error', {
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
      });
    });
  }

  /**
   * Track user interactions (clicks, scrolls, etc.)
   */
  private trackInteractions(): void {
    if (typeof window === 'undefined') return;

    let scrollTimeout: NodeJS.Timeout;

    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackEvent('interaction', {
        type: 'click',
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        textContent: target.textContent?.substring(0, 100),
      });
    });

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackEvent('interaction', {
          type: 'scroll',
          scrollTop: window.pageYOffset,
          scrollLeft: window.pageXOffset,
        });
      }, 1000);
    });
  }

  /**
   * Track page view
   */
  private trackPageView(route: string): void {
    if (!this.isTracking) return;

    this.trackEvent('performance', {
      type: 'page_view',
      route,
      referrer: document.referrer,
      title: document.title,
    });
  }

  /**
   * Track custom event
   */
  public trackEvent(type: RUMEvent['type'], data: any, route?: string): void {
    if (!this.isTracking || !this.session) return;

    const event: RUMEvent = {
      type,
      timestamp: Date.now(),
      data,
      sessionId: this.session.sessionId,
      route: route || window.location.pathname,
    };

    this.eventQueue.push(event);

    if (this.config.debug) {
      console.log('RUM: Event tracked', event);
    }

    // Flush immediately for critical events
    if (type === 'error') {
      this.flushEvents();
    }
  }

  /**
   * Start automatic flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  /**
   * Flush events to server
   */
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = this.eventQueue.splice(0, this.config.batchSize);

    try {
      await fetch(this.config.apiEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: this.session,
          events,
        }),
      });

      if (this.config.debug) {
        console.log(`RUM: Flushed ${events.length} events`);
      }
    } catch (error) {
      if (this.config.debug) {
        console.error('RUM: Failed to flush events', error);
      }
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Grant user consent for tracking
   */
  public grantConsent(): void {
    this.hasUserConsent = true;
    localStorage.setItem('rum-tracking-consent', 'granted');
    
    if (!this.isTracking) {
      this.initializeSession();
      this.setupAutoTracking();
    }
  }

  /**
   * Revoke user consent for tracking
   */
  public revokeConsent(): void {
    this.hasUserConsent = false;
    localStorage.setItem('rum-tracking-consent', 'denied');
    this.stopTracking();
  }

  /**
   * Stop tracking and cleanup
   */
  public stopTracking(): void {
    this.isTracking = false;
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush remaining events
    this.flushEvents();

    if (this.config.debug) {
      console.log('RUM: Tracking stopped');
    }
  }

  /**
   * Get current session info
   */
  public getSession(): RUMSession | null {
    return this.session;
  }

  /**
   * Check if tracking is active
   */
  public isTrackingActive(): boolean {
    return this.isTracking;
  }
}

/**
 * React hook for RUM tracking
 */
export function useRUMTracking(config: RUMTrackerConfig, options?: RUMTrackerOptions) {
  const [tracker, setTracker] = useState<RUMTracker | null>(null);
  const [isConsentGranted, setIsConsentGranted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rumTracker = new RUMTracker(config);
    setTracker(rumTracker);
    setIsConsentGranted(rumTracker.isTrackingActive());

    return () => {
      rumTracker.stopTracking();
    };
  }, [config.tenantId, config.userId]);

  const trackCustomEvent = useCallback((type: RUMEvent['type'], data: any) => {
    if (tracker) {
      tracker.trackEvent(type, data, options?.route);
    }
  }, [tracker, options?.route]);

  const grantConsent = useCallback(() => {
    if (tracker) {
      tracker.grantConsent();
      setIsConsentGranted(true);
    }
  }, [tracker]);

  const revokeConsent = useCallback(() => {
    if (tracker) {
      tracker.revokeConsent();
      setIsConsentGranted(false);
    }
  }, [tracker]);

  return {
    tracker,
    isTracking: tracker?.isTrackingActive() || false,
    isConsentGranted,
    trackCustomEvent,
    grantConsent,
    revokeConsent,
    session: tracker?.getSession() || null,
  };
}

/**
 * Initialize RUM tracking for non-React usage
 */
export function trackRUMMetrics(config: RUMTrackerConfig): RUMTracker {
  return new RUMTracker(config);
}

/**
 * Utility to check if tracking is allowed
 */
export function canTrackRUM(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for Do Not Track
  if (navigator.doNotTrack === '1') {
    return false;
  }

  // Check for privacy settings
  const privacySettings = navigator as any;
  if (privacySettings.globalPrivacyControl) {
    return false;
  }

  return true;
}
