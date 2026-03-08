'use client';

import {
  AICallAnalysisCard,
  UpcomingSessionCard,
  AddFlashCallCard,
  PastCallSummaryCard,
  LinkButton,
} from '../../../components/dashboard/voiceCalls';
import type { AICallAnalysis, UpcomingSession, PastCallSummary } from '../../../components/dashboard/voiceCalls';
import { Calendar, History, Crosshair } from 'lucide-react';

// Mock data — replace with API/hooks when backend is ready
function useVoiceCallsData() {
  const analysis: AICallAnalysis = {
    status: 'ANALYSIS COMPLETE',
    lastCallDate: 'Oct 24, 2023',
    headline: 'You sounded less motivated this week. Consider shorter workouts.',
    explanation:
      'Our AI detected a 15% drop in vocal energy compared to last week. Adapting your plan might help maintain consistency during this low-energy phase.',
    suggestedAdjustment:
      'Shift from 45-minute sessions to 20-minute HIIT sessions for the next 3 days.',
    onApplyPlan: () => {},
    onViewTranscript: () => {},
  };

  const upcomingSession: UpcomingSession = {
    label: 'Next Session',
    date: 'Wednesday, Oct 27',
    time: '09:00 AM',
    onReschedule: () => {},
  };

  const pastCalls: PastCallSummary[] = [
    {
      id: '1',
      title: 'Weekly Reflection',
      date: 'Oct 20',
      duration: '12m 45s',
      summarySnippet:
        '...actually felt quite productive on Tuesday, but the morning routine is still a bit of a struggle when it\'s raining outside...',
      onPlayAudio: () => {},
      onViewTranscript: () => {},
    },
    {
      id: '2',
      title: 'Goal Alignment',
      date: 'Oct 18',
      duration: '8m 20s',
      summarySnippet:
        '...we aligned on three focus areas for the month and set a checkpoint for next week...',
      onPlayAudio: () => {},
      onViewTranscript: () => {},
    },
    {
      id: '3',
      title: 'Monthly Kickoff',
      date: 'Oct 15',
      duration: '15m 10s',
      summarySnippet:
        '...kicked off the new habit stack and discussed sleep and hydration as priorities...',
      onPlayAudio: () => {},
      onViewTranscript: () => {},
    },
  ];

  return { analysis, upcomingSession, pastCalls };
}

export default function VoiceCallsPage() {
  const { analysis, upcomingSession, pastCalls } = useVoiceCallsData();

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-gray-50/50">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Voice Coach Calls</h1>
            <p className="mt-1 text-sm text-gray-500">
              Personalized audio guidance based on your weekly progress.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <LinkButton href="/dashboard/voice-calls/schedule">Schedule New Call</LinkButton>
          </div>
        </div>

        {/* Latest AI Analysis */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Crosshair className="h-4 w-4" />
            </span>
            Latest AI Analysis
          </h2>
          <AICallAnalysisCard data={analysis} />
        </section>

        {/* Two columns: Upcoming + Past */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upcoming Calls */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Calendar className="h-4 w-4" />
              </span>
              Upcoming Calls
            </h2>
            <div className="flex flex-col gap-3">
              <UpcomingSessionCard session={upcomingSession} />
              <AddFlashCallCard onAdd={() => {}} />
            </div>
          </section>

          {/* Past Calls */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <History className="h-4 w-4" />
              </span>
              Past Calls
            </h2>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              {pastCalls.map((call) => (
                <PastCallSummaryCard key={call.id} call={call} />
              ))}
              <div className="pt-4 text-center">
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300"
                >
                  Load Older Sessions
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
