'use client';

import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/TopBar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Coach Chat',
  '/dashboard/voice-calls': 'Voice Coach Calls',
  '/dashboard/voice-calls/schedule': 'Schedule New Call',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gray-50/50">
        <Sidebar />
        <div className="ml-[220px] flex flex-1 flex-col">
          <TopBar title={title} />
          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
