'use client';

import { Calendar } from 'lucide-react';
import type { UpcomingSession } from './types';

interface UpcomingSessionCardProps {
  session: UpcomingSession;
}

export function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  const { label, date, time, onReschedule } = session;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
        <Calendar className="h-6 w-6 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{date}</p>
        <p className="text-base font-bold text-gray-900">{time}</p>
      </div>
      {onReschedule && (
        <button
          type="button"
          onClick={onReschedule}
          className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
        >
          RESCHEDULE
        </button>
      )}
    </div>
  );
}
