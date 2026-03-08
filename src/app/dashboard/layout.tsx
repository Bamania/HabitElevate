'use client';

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import Sidebar from '../../components/dashboard/Sidebar';
import TopBar from '../../components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gray-50/50">
        <Sidebar />
        <div className="ml-[220px] flex flex-1 flex-col">
          <TopBar />
          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
