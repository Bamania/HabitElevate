'use client';

import { Plus } from 'lucide-react';

interface AddFlashCallCardProps {
  onAdd?: () => void;
}

export function AddFlashCallCard({ onAdd }: AddFlashCallCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-left transition-colors hover:bg-gray-100/80 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-blue-300 text-blue-600">
        <Plus className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Want an extra boost?</p>
        <p className="text-sm font-medium text-blue-600">Add Flash Call</p>
      </div>
    </button>
  );
}
