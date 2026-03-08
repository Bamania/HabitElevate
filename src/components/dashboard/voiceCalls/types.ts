/**
 * Shared types for the Voice Coach Calls feature.
 * Single source of truth for API/mock data shapes used by the abstraction layer.
 */

export interface AICallAnalysis {
  status: 'ANALYSIS COMPLETE' | 'PENDING' | 'IN_PROGRESS';
  lastCallDate: string;
  headline: string;
  explanation: string;
  suggestedAdjustment: string;
  onApplyPlan?: () => void;
  onViewTranscript?: () => void;
}

export interface UpcomingSession {
  label: string;
  date: string;
  time: string;
  onReschedule?: () => void;
}

export interface PastCallSummary {
  id: string;
  title: string;
  date: string;
  duration: string;
  summarySnippet: string;
  onPlayAudio?: () => void;
  onViewTranscript?: () => void;
}
