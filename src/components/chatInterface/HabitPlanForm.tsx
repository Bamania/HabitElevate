"use client";
import { useState } from "react";
import { Save, Calendar, Clock, Target, Zap, Plus, X, CheckCircle } from 'lucide-react';

interface HabitPlanData {
  habitName: string;
  category: string;
  frequency: string;
  duration: string;
  timeOfDay: string;
  motivation: string;
  obstacles: string[];
  rewards: string[];
  startDate: string;
}

interface HabitPlanFormProps {
  onSubmit: (data: HabitPlanData) => void;
  onCancel?: () => void;
  initialData?: Partial<HabitPlanData>;
}

export default function HabitPlanForm({ onSubmit, onCancel, initialData }: HabitPlanFormProps) {
  const [formData, setFormData] = useState<HabitPlanData>({
    habitName: initialData?.habitName || '',
    category: initialData?.category || 'health',
    frequency: initialData?.frequency || 'daily',
    duration: initialData?.duration || '15',
    timeOfDay: initialData?.timeOfDay || 'morning',
    motivation: initialData?.motivation || '',
    obstacles: initialData?.obstacles || [''],
    rewards: initialData?.rewards || [''],
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const categories = [
    { value: 'health', label: 'Health & Fitness', icon: '💪' },
    { value: 'productivity', label: 'Productivity', icon: '⚡' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'other', label: 'Other', icon: '🎯' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Every day' },
    { value: 'weekdays', label: 'Weekdays only' },
    { value: 'weekends', label: 'Weekends only' },
    { value: '3-times-week', label: '3 times a week' },
    { value: 'weekly', label: 'Once a week' },
    { value: 'custom', label: 'Custom schedule' }
  ];

  const timesOfDay = [
    { value: 'morning', label: 'Morning (6-10 AM)' },
    { value: 'midday', label: 'Midday (10 AM-2 PM)' },
    { value: 'afternoon', label: 'Afternoon (2-6 PM)' },
    { value: 'evening', label: 'Evening (6-10 PM)' },
    { value: 'night', label: 'Night (10 PM+)' },
    { value: 'flexible', label: 'Flexible timing' }
  ];

  const updateFormData = (field: keyof HabitPlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: 'obstacles' | 'rewards') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'obstacles' | 'rewards', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'obstacles' | 'rewards', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      obstacles: formData.obstacles.filter(item => item.trim() !== ''),
      rewards: formData.rewards.filter(item => item.trim() !== '')
    };
    onSubmit(cleanedData);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.habitName.trim() !== '' && formData.category !== '';
      case 2:
        return formData.frequency !== '' && formData.duration !== '';
      case 3:
        return formData.motivation.trim() !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Target className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Build Your Habit Plan</h2>
        </div>
        <p className="text-gray-600">Let's create a personalized plan for your new habit</p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1 <= currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What habit do you want to build?</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                value={formData.habitName}
                onChange={(e) => updateFormData('habitName', e.target.value)}
                placeholder="e.g., Morning meditation, Daily workout, Read for 30 minutes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateFormData('category', cat.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      formData.category === cat.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">When and how often?</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <div className="space-y-2">
                {frequencies.map((freq) => (
                  <label key={freq.value} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq.value}
                      checked={formData.frequency === freq.value}
                      onChange={(e) => updateFormData('frequency', e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{freq.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', e.target.value)}
                  min="1"
                  max="480"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Best time of day
                </label>
                <select
                  value={formData.timeOfDay}
                  onChange={(e) => updateFormData('timeOfDay', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  {timesOfDay.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        )}

        {/* Step 3: Motivation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What's your motivation?</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to build this habit? *
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => updateFormData('motivation', e.target.value)}
                placeholder="e.g., I want to feel more energized, improve my health, be more productive..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
          </div>
        )}

        {/* Step 4: Obstacles & Rewards */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan for success</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potential Obstacles
              </label>
              <p className="text-sm text-gray-500 mb-3">What might prevent you from doing this habit?</p>
              {formData.obstacles.map((obstacle, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={obstacle}
                    onChange={(e) => updateListItem('obstacles', index, e.target.value)}
                    placeholder="e.g., Lack of time, feeling tired, bad weather..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                  />
                  {formData.obstacles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('obstacles', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('obstacles')}
                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add obstacle</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rewards & Motivators
              </label>
              <p className="text-sm text-gray-500 mb-3">How will you reward yourself?</p>
              {formData.rewards.map((reward, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={reward}
                    onChange={(e) => updateListItem('rewards', index, e.target.value)}
                    placeholder="e.g., Favorite coffee, movie night, new book..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                  />
                  {formData.rewards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem('rewards', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem('rewards')}
                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add reward</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Create Plan</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
