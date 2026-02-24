'use client';

import { useState, useTransition } from 'react';

import { updateHoursSettings } from '../model';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type Day = (typeof DAYS)[number];

type HourEntry = {
  days: Day[];
  opens: string;
  closes: string;
};

export function HoursSettingsForm() {
  const [hours, setHours] = useState<HourEntry[]>([
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleDay = (entryIndex: number, day: Day) => {
    setHours((prev) =>
      prev.map((entry, index) => {
        if (index !== entryIndex) {
          return entry;
        }

        const updatedDays = entry.days.includes(day)
          ? entry.days.filter((candidate) => candidate !== day)
          : [...entry.days, day];

        return {
          ...entry,
          days: updatedDays,
        };
      })
    );
  };

  const handleTimeChange = (entryIndex: number, field: 'opens' | 'closes', value: string) => {
    setHours((prev) =>
      prev.map((entry, index) => (index === entryIndex ? { ...entry, [field]: value } : entry))
    );
  };

  const addSchedule = () => {
    setHours((prev) => [...prev, { days: [], opens: '09:00', closes: '17:00' }]);
  };

  const removeSchedule = (entryIndex: number) => {
    setHours((prev) => prev.filter((_, index) => index !== entryIndex));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await updateHoursSettings({ hours });

      if (result?.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return;
      }

      setError('Failed to save business hours. Please review your schedule and try again.');
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Business hours settings" className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-gray-900">Business Hours</h2>
        <p className="text-sm text-gray-500">
          Set your operating hours. These appear on your website and in search engines.
        </p>
      </header>

      {hours.map((entry, entryIndex) => (
        <section key={`schedule-${entryIndex}`} className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Days</p>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={`Days for schedule ${entryIndex + 1}`}>
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(entryIndex, day)}
                aria-pressed={entry.days.includes(day)}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  entry.days.includes(day)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-3">
            <label className="text-xs font-medium text-gray-500" htmlFor={`opens-${entryIndex}`}>
              Opens
              <input
                id={`opens-${entryIndex}`}
                type="time"
                className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={entry.opens}
                onChange={(event) => handleTimeChange(entryIndex, 'opens', event.target.value)}
              />
            </label>

            <label className="text-xs font-medium text-gray-500" htmlFor={`closes-${entryIndex}`}>
              Closes
              <input
                id={`closes-${entryIndex}`}
                type="time"
                className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={entry.closes}
                onChange={(event) => handleTimeChange(entryIndex, 'closes', event.target.value)}
              />
            </label>

            <button
              type="button"
              onClick={() => removeSchedule(entryIndex)}
              disabled={hours.length === 1}
              className="rounded px-2 py-1 text-sm text-gray-500 hover:text-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </section>
      ))}

      <button type="button" onClick={addSchedule} className="text-sm font-medium text-blue-600 hover:underline">
        + Add another schedule
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save Hours'}
        </button>

        {saved ? (
          <p role="status" className="text-sm font-medium text-green-600">
            ✓ Hours saved
          </p>
        ) : null}
      </div>
    </form>
  );
}
