"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Target, Brain, Eye, EyeOff, User, Calendar, Clock, Heart, TrendingUp } from 'lucide-react';
import { useAuth } from "../../providers/AuthProvider";
import { createSupabaseClient } from "../../lib/supabase/client";
import { useUIState } from "../../lib/customHooks/useUIState";
import AGUIChatInterface from "./ChatInterface";
import ReminderForm from "../ReminderForm/index";

export default function ChatInterface() {
  const router = useRouter();
  // Get current logged-in user
  const { user, loading: authLoading } = useAuth();
  const [checkingPhone, setCheckingPhone] = useState(true);
  const [hasPhone, setHasPhone] = useState(false);
  
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Use UI state from Redux store for context sidebar only
  const {
    showContext,
    showSuggestions,
    toggleContext,
    setShowSuggestions,
  } = useUIState();

  const toggleReminderForm = () => {
    setShowReminderForm(prev => !prev);
  };

  // Check if user has phone number
  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (!user?.id) {
        setCheckingPhone(false);
        return;
      }

      try {
        const supabase = createSupabaseClient();
        
        const { data, error } = await supabase
          .from('users_profile')
          .select('phone')
          .eq('id', user.id)
          .maybeSingle();

        // Ignore PGRST116 error (no rows) - redirect to setup
        if ((error && error.code !== 'PGRST116') || !data?.phone) {
          // No phone number, redirect to setup
          router.push('/setup-phone');
          return;
        }

        setHasPhone(true);
        setCheckingPhone(false);
      } catch (err) {
        console.error('Error checking phone:', err);
        setCheckingPhone(false);
      }
    };

    if (!authLoading) {
      checkPhoneNumber();
    }
  }, [user?.id, authLoading, router]);

  const [userContext, setUserContext] = useState({
    name: "Loading...",
    age: 0,
    occupation: "",
    lifestyle: "",
    goals: [] as string[],
    preferences: [] as string[],
    challenges: [] as string[],
    currentHabits: [] as string[],
    energyLevel: "",
    schedule: "",
    personality: "",
    phone: ""
  });

  const [loadingContext, setLoadingContext] = useState(true);

  // State for todos and habits
  const [userTodos, setUserTodos] = useState<any[]>([]);
  const [userHabits, setUserHabits] = useState<any[]>([]);

  // Fetch user profile data from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoadingContext(false);
        return;
      }

      try {
        const supabase = createSupabaseClient();
        
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('users_profile')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', profileError);
          setLoadingContext(false);
          return;
        }

        if (profileData) {
          // Parse arrays from JSON strings if needed
          const parseArray = (value: any): string[] => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') {
              try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                // If not JSON, split by comma or return as single item
                return value.includes(',') ? value.split(',').map((s: string) => s.trim()) : [value];
              }
            }
            return [];
          };

          setUserContext({
            name: profileData.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            age: profileData.age || 0,
            occupation: profileData.occupation || '',
            lifestyle: profileData.lifestyle || '',
            goals: parseArray(profileData.goals),
            preferences: parseArray(profileData.preferences),
            challenges: parseArray(profileData.challenges),
            currentHabits: parseArray(profileData.currenthabits),
            energyLevel: profileData.energy_level || profileData.energylevel || '',
            schedule: profileData.schedule || '',
            personality: profileData.personality || '',
            phone: profileData.phone || ''
          });
        } else {
          // Use fallback data from user metadata
          setUserContext({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            age: 0,
            occupation: '',
            lifestyle: '',
            goals: [],
            preferences: [],
            challenges: [],
            currentHabits: [],
            energyLevel: '',
            schedule: '',
            personality: '',
            phone: ''
          });
        }

        setLoadingContext(false);
      } catch (err) {
        console.error('Error fetching user context:', err);
        setLoadingContext(false);
      }
    };

    if (!authLoading && user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, authLoading]);

  // Fetch todos and habits from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const supabase = createSupabaseClient();
        
        // Fetch todos from Supabase (if available)
        const { data: todosData, error: todosError } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!todosError && todosData) {
          setUserTodos(todosData);
        }

        // Fetch habits from Supabase (if available)
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!habitsError && habitsData) {
          setUserHabits(habitsData);
        }
      } catch (err) {
        console.error('Error fetching todos/habits:', err);
      }
    };

    if (!authLoading && user?.id) {
      fetchUserData();
    }
  }, [user?.id, authLoading]);

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

  // Show loading while checking authentication or phone
  if (authLoading || checkingPhone) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Sparkles className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to HabitElevate</h2>
          <p className="text-gray-600 mb-6">Please log in to start chatting with your AI habit coach</p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // If no phone number, user will be redirected by useEffect
  if (!hasPhone) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Redirecting to phone setup...</p>
        </div>
      </div>
    );
  }

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
          
          <div className="mt-4 flex items-center justify-center space-x-2 flex-wrap">
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
            <button
              onClick={toggleReminderForm}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Clock className="h-3 w-3" />
              <span>Set Reminder</span>
            </button>
          </div>
        </div>

        {/* Main AGUI Chat Interface */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <AGUIChatInterface ref={aguiChatRef} userId={user.id} className="h-full" />
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
              {/* Loading State */}
              {loadingContext && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading context...</p>
                </div>
              )}

              {/* User Profile */}
              {!loadingContext && (
                <>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{userContext.name}</h3>
                        <h3 className="font-semibold text-gray-800">{userContext.phone}</h3>
                        {userContext.occupation && <p className="text-sm text-gray-600">{userContext.occupation}</p>}
                      </div>
                    </div>
                    {userContext.lifestyle && <p className="text-sm text-gray-600">{userContext.lifestyle}</p>}
                    {userContext.age > 0 && <p className="text-xs text-gray-500 mt-2">Age: {userContext.age}</p>}
                  </div>

                  {/* Active Habits from DB */}
                  {userHabits.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                        Active Habits ({userHabits.length})
                      </h3>
                      <div className="space-y-2">
                        {userHabits.slice(0, 5).map((habit, index) => (
                          <div key={index} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-800">{habit.name}</span>
                              <span className="text-xs text-purple-600">{habit.frequency}</span>
                            </div>
                            {habit.description && (
                              <p className="text-xs text-gray-600">{habit.description}</p>
                            )}
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="text-xs text-gray-500">Streak: {habit.current_streak || 0}</span>
                              {habit.longest_streak > 0 && (
                                <span className="text-xs text-green-600">Best: {habit.longest_streak}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Todos from DB */}
                  {userTodos.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-cyan-500" />
                        Recent Todos ({userTodos.length})
                      </h3>
                      <div className="space-y-2">
                        {userTodos.slice(0, 5).map((todo, index) => (
                          <div key={index} className={`p-2 rounded-lg border ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-cyan-50 border-cyan-200'}`}>
                            <div className="flex items-start space-x-2">
                              <input 
                                type="checkbox" 
                                checked={todo.completed} 
                                readOnly
                                className="mt-1"
                              />
                              <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {todo.text}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Goals */}
                  {userContext.goals.length > 0 && (
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
                  )}

                  {/* Preferences */}
                  {userContext.preferences.length > 0 && (
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
                  )}

                  {/* Challenges */}
                  {userContext.challenges.length > 0 && (
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
                  )}

                  {/* Current Habits from Profile */}
                  {userContext.currentHabits.length > 0 && (
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
                  )}

                  {/* Energy & Schedule */}
                  {(userContext.energyLevel || userContext.schedule) && (
                    <div className="space-y-3">
                      {userContext.energyLevel && (
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-purple-500" />
                            Energy Level
                          </h3>
                          <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                            {userContext.energyLevel}
                          </p>
                        </div>
                      )}
                      
                      {userContext.schedule && (
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                            Schedule
                          </h3>
                          <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
                            {userContext.schedule}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Personality */}
                  {userContext.personality && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-indigo-500" />
                        Personality
                      </h3>
                      <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
                        {userContext.personality}
                      </p>
                    </div>
                  )}

                  {/* Empty State Message */}
                  {!userContext.goals.length && 
                   !userContext.preferences.length && 
                   !userContext.challenges.length && 
                   !userContext.currentHabits.length && 
                   !userHabits.length && 
                   !userTodos.length && (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 mb-4">No context data available yet</p>
                      <p className="text-xs text-gray-400">Update your profile to help the AI coach understand you better!</p>
                    </div>
                  )}

                  {/* Update Context Button */}
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Update My Context
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reminder Form Sidebar */}
      {showReminderForm && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-800">Set Reminder</h2>
              </div>
              <button
                onClick={toggleReminderForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <EyeOff className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <ReminderForm />
          </div>
        </div>
      )}
    </div>
  );
}
