'use client';

import { useEffect, useRef, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

interface BookingEmbedProps {
  calUsername: string; // e.g. "john-hvac" or "agency/free-consultation"
  eventSlug?: string; // e.g. "free-consultation" (uses default if omitted)
  tenantId: string; // Passed as Cal metadata for webhook routing
  prefillName?: string;
  prefillEmail?: string;
  mode?: 'inline' | 'popup' | 'floatingButton';
  buttonText?: string;
  buttonClassName?: string;
}

// Inline embed (renders full calendar in page)
export function BookingEmbedInline({
  calUsername,
  eventSlug = 'free-consultation',
  tenantId,
  prefillName,
  prefillEmail,
}: BookingEmbedProps) {
  const calRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: tenantId });

      // Theme matches tenant's CSS variables
      cal('ui', {
        theme: 'auto',
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: {
            'cal-brand': 'var(--color-primary)',
            'cal-brand-text': '#ffffff',
            'cal-border-subtle': '#e5e7eb',
          },
          dark: {
            'cal-brand': 'var(--color-primary)',
            'cal-brand-text': '#ffffff',
          },
        },
      });

      // Track booking events for analytics
      cal('on', {
        action: 'bookingSuccessful',
        callback: (e: any) => {
          window.dispatchEvent(
            new CustomEvent('booking_completed', {
              detail: {
                tenantId,
                eventType: e.detail?.data?.eventType?.slug,
                attendeeEmail: e.detail?.data?.booking?.attendees?.[0]?.email,
              },
            })
          );
        },
      });
    })();
  }, [tenantId]);

  return (
    <div aria-label="Schedule an appointment" role="region">
      <Cal
        namespace={tenantId}
        calLink={`${calUsername}/${eventSlug}`}
        config={{
          layout: 'month_view',
          ...(prefillName ? { name: prefillName } : {}),
          ...(prefillEmail ? { email: prefillEmail } : {}),
          metadata: { tenantId }, // Included in webhook payload
        }}
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      />
    </div>
  );
}

// Popup trigger (button opens Cal modal)
export function BookingEmbedPopup({
  calUsername,
  eventSlug = 'free-consultation',
  tenantId,
  buttonText = 'Book a Free Consultation',
  buttonClassName,
}: BookingEmbedProps) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: `${tenantId}-popup` });
      cal('ui', {
        theme: 'auto',
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { 'cal-brand': 'var(--color-primary)' },
        },
      });
    })();
  }, [tenantId]);

  return (
    <button
      type="button"
      data-cal-namespace={`${tenantId}-popup`}
      data-cal-link={`${calUsername}/${eventSlug}`}
      data-cal-config={JSON.stringify({ metadata: { tenantId } })}
      className={buttonClassName ?? 'btn-primary'}
      aria-label={`${buttonText} — opens scheduling calendar`}
    >
      {buttonText}
    </button>
  );
}

// Floating button (fixed bottom-right)
export function BookingFloatingButton({
  calUsername,
  eventSlug = 'free-consultation',
  tenantId,
  buttonText = 'Book Now',
}: BookingEmbedProps) {
  const [visible, setVisible] = useState(false);

  // Show after 5 seconds or 50% scroll depth
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.5) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const cal = await getCalApi({ namespace: `${tenantId}-float` });
      cal('floatingButton', {
        calLink: `${calUsername}/${eventSlug}`,
        config: { metadata: { tenantId } },
        buttonText,
        buttonColor: 'var(--color-primary)',
        buttonTextColor: '#ffffff',
        hideButtonIcon: false,
      });
    })();
  }, [visible, calUsername, eventSlug, tenantId, buttonText]);

  return null; // Cal.com renders the button itself into the DOM
}
