"use client";
import { Sprout } from 'lucide-react';
import ChatInterface from "../components/chatInterface";
import { CopilotSidebar } from '@copilotkit/react-ui';
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative z-10 w-full max-w-3xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <Sprout className="h-10 w-10 text-indigo-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  HabitElevate
                </span>
              </div>
            </div>

            {/* Chat Interface Component */}
            <ChatInterface />
            <CopilotSidebar /> 
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}