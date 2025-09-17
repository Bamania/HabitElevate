"use client";
import { useState } from "react";
import { Play, MessageSquare, Sparkles, Eye } from 'lucide-react';

interface DemoTest {
  id: string;
  title: string;
  message: string;
  expectedUI: string;
  description: string;
}

export default function GenerativeUIDemo() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const demoTests: DemoTest[] = [
    {
      id: 'progress',
      title: 'Progress Tracker',
      message: 'Show my progress on morning workouts',
      expectedUI: 'Interactive progress tracker with streak counter',
      description: 'Displays current streak, goal progress, and completion percentage'
    },
    {
      id: 'schedule',
      title: 'Daily Schedule',
      message: 'What\'s my daily routine for today?',
      expectedUI: 'Interactive schedule with checkboxes',
      description: 'Shows today\'s habits with completion checkboxes and timing'
    },
    {
      id: 'timer',
      title: 'Habit Timer',
      message: 'Start a meditation timer',
      expectedUI: 'Interactive countdown timer',
      description: 'Functional timer with play/pause controls and reset button'
    },
    {
      id: 'stats',
      title: 'Analytics Dashboard',
      message: 'Show me my habit analytics and insights',
      expectedUI: 'Stats dashboard with charts and insights',
      description: 'Displays completion rates, active habits, and personalized insights'
    },
    {
      id: 'actions',
      title: 'Quick Actions',
      message: 'What can I do right now?',
      expectedUI: 'Action buttons grid',
      description: 'Shows quick action buttons for logging habits, adding new ones, etc.'
    },
    {
      id: 'achievement',
      title: 'Achievement Badge',
      message: 'Congratulations on completing your first week!',
      expectedUI: 'Achievement unlock animation',
      description: 'Displays achievement badge with rarity and unlock details'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Generative UI Demo</h2>
        </div>
        <p className="text-gray-600">Test AGUI's dynamic UI component generation</p>
        
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700">
            <strong>How it works:</strong> Type the test messages below in the chat to see dynamic UI components appear!
          </p>
        </div>
      </div>

      {/* Demo Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoTests.map((test) => (
          <div
            key={test.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer ${
              selectedTest === test.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Play className="h-4 w-4 text-purple-600 mr-2" />
                {test.title}
              </h3>
              <Eye className={`h-4 w-4 ${selectedTest === test.id ? 'text-purple-600' : 'text-gray-400'}`} />
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Test Message:</div>
                    <div className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded border">
                      "{test.message}"
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedTest === test.id && (
                <div className="space-y-2">
                  <div className="text-xs text-green-600 font-medium">Expected Result:</div>
                  <div className="text-sm text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                    {test.expectedUI}
                  </div>
                  <div className="text-xs text-gray-500">
                    {test.description}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(test.message);
                }}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                📋 Copy Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Testing Instructions:</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Copy any test message above</li>
          <li>Paste it into the AGUI chat interface</li>
          <li>Send the message and watch for the AI response</li>
          <li>The corresponding UI component should appear below the AI's text response</li>
          <li>Interact with the generated components (timers, checkboxes, buttons work!)</li>
        </ol>
        
        <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
          <p className="text-xs text-blue-600">
            <strong>Pro Tip:</strong> You can also ask natural questions like "How am I doing with my habits?" 
            and the AI will automatically generate the appropriate UI component!
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-medium text-green-800">Context Aware</div>
          <div className="text-xs text-green-600">AI detects intent and shows relevant UI</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-sm font-medium text-blue-800">Real-time</div>
          <div className="text-xs text-blue-600">Components appear instantly with responses</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl mb-2">🔄</div>
          <div className="text-sm font-medium text-purple-800">Interactive</div>
          <div className="text-xs text-purple-600">Fully functional UI components</div>
        </div>
      </div>
    </div>
  );
}
