"use client";
import { useState } from "react";
import { Sprout, Send, Sparkles, MessageSquare, Zap, Target, TrendingUp, Brain, Eye, EyeOff, User, Calendar, Clock, Heart } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(false);
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
    "Create a morning routine that energizes me",
    "Help me build a consistent workout habit",
    "I want to start meditating daily",
    "Build a habit to read 30 minutes before bed",
    "Create a habit to drink more water throughout the day",
    "Help me quit procrastinating on important tasks"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      // For now, redirect to input page with the prompt
      router.push(`/input?prompt=${encodeURIComponent(prompt)}`);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
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
                onClick={() => setShowContext(false)}
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Your AI Habit Coach
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Tell me what habit you want to build, and I'll create a personalized plan just for you.
            </p>
          </div>

          {/* Main Prompt Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the habit you want to build... (e.g., 'I want to start a morning workout routine that fits my busy schedule')"
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Sparkles className="h-4 w-4" />
                  <span>Powered by AI</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowContext(!showContext)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Brain className="h-4 w-4" />
                    <span>{showContext ? 'Hide' : 'Show'} Context</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Generate Plan</span>
                        <Send className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <Zap className="h-4 w-4 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Popular Habit Ideas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-sm group"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="h-3 w-3 text-indigo-500 group-hover:text-indigo-600" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
