"use client";
import { useState, useRef } from "react";
import { Sparkles, Zap, Target, Brain, Eye, EyeOff, User, Calendar, Clock, Heart, TrendingUp } from 'lucide-react';
import { useUIState } from "../../lib/customHooks/useUIState";
import AGUIChat from "./AGUIChat";

export default function ChatInterface() {
  // Use UI state from Redux store for context sidebar only
  const {
    showContext,
    showSuggestions,
    toggleContext,
    setShowSuggestions,
  } = useUIState();

  const [userContext, setUserContext] = useState({
    name: "Alex",
    age: 28,
    occupation: "Software Developer",
    lifestyle: "Busy professional",
    goals: ["Fitness", "Productivity", "Work-life balance"],
    preferences: ["Morning routines", "Short sessions", "Tech-friendly"],
    challenges: ["Time constraints", "Motivation", "Consistency"],
    currentHabits: ["Coffee drinking", "Social media checking"],
    energyLevel: "High in morning, low in evening",
    schedule: "9-5 job, gym 3x/week",
    personality: "Goal-oriented, tech-savvy, analytical"
  });

  const [suggestions] = useState([
    "I want to build a plan for a morning routine",
    "Help me create a workout habit plan",
    "I need to plan a meditation habit",
    "Build a plan for reading daily",
    "Create a plan for drinking more water",
    "Help me plan to stop procrastinating"
  ]);

  const aguiChatRef = useRef<any>(null);

  const handleSuggestionClick = async (suggestion: string) => {
    // Hide suggestions when one is clicked
    setShowSuggestions(false);
    
    // Send message directly to AGUI chat
    if (aguiChatRef.current?.sendMessage) {
      aguiChatRef.current.sendMessage(suggestion);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
        {/* Simplified Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Your AI Habit Coach
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build amazing habits with interactive planning forms and personalized AI guidance
          </p>
          
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              ✨ AGUI Powered
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              📋 Interactive Forms
            </div>
            <button
              onClick={() => toggleContext()}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Brain className="h-3 w-3" />
              <span>{showContext ? 'Hide' : 'Show'} Context</span>
            </button>
          </div>
        </div>

        {/* Main AGUI Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <AGUIChat ref={aguiChatRef} userId="Alex" className="h-full" />
        </div>

        {/* Quick Start Suggestions */}
        {showSuggestions && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                <h3 className="font-semibold text-gray-800">Quick Start - Try These</h3>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Hide
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-sm group"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Context Sidebar */}
      {showContext && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-800">AI Context</h2>
              </div>
              <button
                onClick={() => toggleContext()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <EyeOff className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Profile */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{userContext.name}</h3>
                    <p className="text-sm text-gray-600">{userContext.occupation}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{userContext.lifestyle}</p>
              </div>

              {/* Goals */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-green-500" />
                  Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userContext.goals.map((goal, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-pink-500" />
                  Preferences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userContext.preferences.map((pref, index) => (
                    <span key={index} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-orange-500" />
                  Challenges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userContext.challenges.map((challenge, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {challenge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Habits */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                  Current Habits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userContext.currentHabits.map((habit, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {habit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Energy & Schedule */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-500" />
                    Energy Level
                  </h3>
                  <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                    {userContext.energyLevel}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                    Schedule
                  </h3>
                  <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
                    {userContext.schedule}
                  </p>
                </div>
              </div>

              {/* Update Context Button */}
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Update My Context
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
