'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  Home,
  Heart,
  Map,
  BarChart3,
  MessageSquare,
  Phone,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', disabled: true },
  { label: 'Habits', icon: Heart, href: '/dashboard/habits', disabled: true },
  { label: 'Journey', icon: Map, href: '/dashboard/journey', disabled: true },
  { label: 'Insights', icon: BarChart3, href: '/dashboard/insights', disabled: true },
  { label: 'Coach Chat', icon: MessageSquare, href: '/dashboard', disabled: false },
  { label: 'Voice Coach Calls', icon: Phone, href: '/dashboard/voice-calls', disabled: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="relative">
          <Sprout className="h-7 w-7 text-blue-600" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" />
        </div>
        <div>
          <span className="text-lg font-bold text-gray-900">HabitElevate</span>
          <p className="text-[10px] leading-none text-gray-400">AI Coach</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href && !item.disabled;
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-300"
                title="Coming soon"
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings (bottom) */}
      <div className="border-t border-gray-100 px-3 py-4">
        <div
          className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-300"
          title="Coming soon"
        >
          <Settings className="h-[18px] w-[18px]" />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
}
