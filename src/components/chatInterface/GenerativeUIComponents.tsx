"use client";
import { useState } from "react";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Star, 
  Play, 
  Pause, 
  BarChart3,
  Award,
  Zap,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

// Progress Tracker Component
export function ProgressTracker({ data }: { data: any }) {
  const { title, currentStreak, goal, progress, lastActivity } = data;
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
          {title}
        </h3>
        <div className="text-2xl font-bold text-green-600">
          {currentStreak} day{currentStreak !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress to goal</span>
          <span>{progress}% ({currentStreak}/{goal} days)</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-500">
          Last activity: {lastActivity}
        </div>
      </div>
    </div>
  );
}

// Habit Schedule Component
export function HabitSchedule({ data }: { data: any }) {
  const { title, schedule, nextReminder, tasks } = data;
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  
  const toggleTask = (taskId: number) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Calendar className="h-5 w-5 text-purple-600 mr-2" />
          {title}
        </h3>
        <div className="text-sm text-purple-600 font-medium">
          {schedule}
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task: any, index: number) => (
          <div key={index} className="flex items-center space-x-3">
            <button
              onClick={() => toggleTask(index)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                completedTasks.has(index)
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              {completedTasks.has(index) && (
                <CheckCircle className="h-3 w-3 text-white" />
              )}
            </button>
            <span className={`flex-1 ${
              completedTasks.has(index) 
                ? 'text-gray-500 line-through' 
                : 'text-gray-700'
            }`}>
              {task.name}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {task.duration}
            </span>
          </div>
        ))}
        
        {nextReminder && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
            <div className="text-sm text-purple-700 font-medium">
              Next Reminder: {nextReminder}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Habit Timer Component
export function HabitTimer({ data }: { data: any }) {
  const { title, duration, type } = data;
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    if (!isRunning) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  const resetTimer = () => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };
  
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 my-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Clock className="h-5 w-5 text-orange-600 mr-2" />
          {title}
        </h3>
        
        <div className="text-4xl font-bold text-orange-600 mb-4">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={toggleTimer}
            disabled={isCompleted && timeLeft === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning
                ? 'bg-red-600 text-white hover:bg-red-700'
                : isCompleted
                  ? 'bg-green-600 text-white'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Completed!</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start</span>
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {type} Session • {duration} minutes
        </div>
      </div>
    </div>
  );
}

// Habit Stats Component
export function HabitStats({ data }: { data: any }) {
  const { title, stats, insights } = data;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.map((stat: any, index: number) => (
          <div key={index} className="text-center p-3 bg-white rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      
      {insights && (
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Zap className="h-4 w-4 text-yellow-500 mr-2" />
            Insights
          </h4>
          <ul className="space-y-1">
            {insights.map((insight: string, index: number) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <Star className="h-3 w-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Quick Actions Component
export function QuickActions({ data }: { data: any }) {
  const { title, actions } = data;
  
  const handleAction = (action: any) => {
    // This would typically trigger some action in the parent component
    console.log('Action triggered:', action);
  };
  
  return (
    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 my-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Target className="h-5 w-5 text-gray-600 mr-2" />
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action: any, index: number) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.color || 'bg-indigo-100'}`}>
              {action.icon === 'plus' && <Plus className="h-4 w-4 text-indigo-600" />}
              {action.icon === 'check' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {action.icon === 'calendar' && <Calendar className="h-4 w-4 text-blue-600" />}
              {action.icon === 'award' && <Award className="h-4 w-4 text-yellow-600" />}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                {action.title}
              </div>
              <div className="text-xs text-gray-500">
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Achievement Badge Component
export function AchievementBadge({ data }: { data: any }) {
  const { title, description, icon, rarity, unlockedAt } = data;
  
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600'
  };
  
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 my-4">
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${rarityColors[rarity as keyof typeof rarityColors]} flex items-center justify-center`}>
          <Award className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🎉 Achievement Unlocked!
        </h3>
        
        <h4 className="text-lg font-semibold text-yellow-700 mb-2">
          {title}
        </h4>
        
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
            rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
            rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {rarity.toUpperCase()}
          </span>
          <span>Unlocked {unlockedAt}</span>
        </div>
      </div>
    </div>
  );
}

// Main Generative UI Component Renderer
export function GenerativeUIRenderer({ type, data }: { type: string; data: any }) {
  switch (type) {
    case 'progress':
      return <ProgressTracker data={data} />;
    case 'schedule':
      return <HabitSchedule data={data} />;
    case 'timer':
      return <HabitTimer data={data} />;
    case 'stats':
      return <HabitStats data={data} />;
    case 'actions':
      return <QuickActions data={data} />;
    case 'achievement':
      return <AchievementBadge data={data} />;
    default:
      return null;
  }
}
