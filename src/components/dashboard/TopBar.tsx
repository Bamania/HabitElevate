'use client';

import { useAuth } from '../../providers/AuthProvider';
import { MessageSquare, Bell } from 'lucide-react';

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = 'Coach Chat' }: TopBarProps) {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Left — page title */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right — notification + profile */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium leading-tight text-gray-900">{displayName}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
