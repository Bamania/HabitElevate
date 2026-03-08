'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function VoiceCallsSchedulePage() {
  return (
    <div className="flex flex-1 flex-col overflow-auto bg-gray-50/50 p-6 sm:p-8">
      <Link
        href="/dashboard/voice-calls"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Voice Coach Calls
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Schedule New Call</h1>
      <p className="mt-2 text-gray-500">Schedule flow — coming soon.</p>
    </div>
  );
}
