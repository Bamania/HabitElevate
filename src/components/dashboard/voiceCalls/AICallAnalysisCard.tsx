'use client';

import { Mic } from 'lucide-react';
import type { AICallAnalysis } from './types';
import { Button } from './Button';

interface AICallAnalysisCardProps {
  data: AICallAnalysis;
}

export function AICallAnalysisCard({ data }: AICallAnalysisCardProps) {
  const {
    status,
    lastCallDate,
    headline,
    explanation,
    suggestedAdjustment,
    onApplyPlan,
    onViewTranscript,
  } = data;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row min-h-[280px]">
        {/* Left — visual */}
        <div className="relative flex-shrink-0 w-full sm:w-[280px] bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/90 shadow-lg">
              <Mic className="h-10 w-10 text-blue-600" />
            </div>
            <div className="absolute -inset-4 rounded-full border-2 border-blue-300/40 animate-ping opacity-30" />
          </div>
        </div>

        {/* Right — content */}
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {status}
            </span>
            <span className="text-xs text-gray-500">Last Call: {lastCallDate}</span>
          </div>

          <h2 className="mb-3 text-lg font-bold text-gray-900">{headline}</h2>
          <p className="mb-3 text-sm leading-relaxed text-gray-600">{explanation}</p>
          <p className="mb-6 text-sm leading-relaxed text-gray-700">
            <span className="font-medium text-gray-800">Suggested adjustment: </span>
            {suggestedAdjustment}
          </p>

          <div className="mt-auto flex flex-wrap gap-3">
            {onApplyPlan && (
              <Button variant="primary" onClick={onApplyPlan}>
                Apply Plan Adjustment
              </Button>
            )}
            {onViewTranscript && (
              <Button variant="secondary" onClick={onViewTranscript}>
                View Full Transcript
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
