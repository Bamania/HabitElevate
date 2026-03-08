'use client';

import { Play, FileText } from 'lucide-react';
import type { PastCallSummary } from './types';

interface PastCallSummaryCardProps {
  call: PastCallSummary;
}

export function PastCallSummaryCard({ call }: PastCallSummaryCardProps) {
  const {
    title,
    date,
    duration,
    summarySnippet,
    onPlayAudio,
    onViewTranscript,
  } = call;

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {date} • {duration}
            </span>
          </div>
          <p className="mt-1.5 text-sm italic text-gray-500 line-clamp-2">
            &ldquo;{summarySnippet}&rdquo;
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            {onPlayAudio && (
              <button
                type="button"
                onClick={onPlayAudio}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
              >
                <Play className="h-4 w-4" />
                Play Audio
              </button>
            )}
            {onViewTranscript && (
              <button
                type="button"
                onClick={onViewTranscript}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
              >
                <FileText className="h-4 w-4" />
                Transcript
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
