'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import { createSupabaseClient } from '../../lib/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { 
  Phone, 
  User, 
  Briefcase, 
  Heart, 
  Target, 
  Calendar,
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Sparkles
} from 'lucide-react';

interface UserProfileData {
  phone: string;
  age: number;
  schedule: string;
  description: string;
  goals: string[];
  challenges: string[];
  currentHabits: string[];
}

interface GoalData {
  primaryGoal: string;
  goalDuration: number;
  durationType: 'days' | 'weeks' | 'months';
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState<UserProfileData>({
    phone: '',
    age: 0,
    schedule: '',
    description: '',
    goals: [],
    challenges: [],
    currentHabits: []
  });

  // Goal data
  const [goalData, setGoalData] = useState<GoalData>({
    primaryGoal: '',
    goalDuration: 0,
    durationType: 'weeks'
  });

  // Temporary string states for multi-value fields
  const [goalsInput, setGoalsInput] = useState('');
  const [challengesInput, setChallengesInput] = useState('');
  const [currentHabitsInput, setCurrentHabitsInput] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleProfileChange = (field: keyof UserProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (field: keyof GoalData, value: any) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!profileData.phone) {
      setError('Phone number is required');
      return false;
    }
    if (!profileData.age || profileData.age < 13) {
      setError('Please enter a valid age (13+)');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    // Step 2 has only optional fields
    setError('');
    return true;
  };

  const validateStep3 = () => {
    if (!goalData.primaryGoal) {
      setError('Please enter your primary goal');
      return false;
    }
    if (!goalData.goalDuration || goalData.goalDuration < 1) {
      setError('Please enter a valid duration');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    let isValid = false;
    
    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid && step < 3) {
      setStep(step + 1);
      setError('');
    } else if (isValid && step === 3) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const parseMultiValue = (input: string): string[] => {
    if (!input.trim()) return [];
    return input.split(',').map(item => item.trim()).filter(item => item);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setGeneratingPlan(true);
    setError('');

    try {
      const supabase = createSupabaseClient();

      // Parse multi-value inputs
      const parsedProfileData = {
        ...profileData,
        goals: parseMultiValue(goalsInput),
        challenges: parseMultiValue(challengesInput),
        currentHabits: parseMultiValue(currentHabitsInput)
      };

      // Save profile data to users_profile
      const { error: profileError } = await supabase
        .from('users_profile')
        .upsert({
          id: user?.id,
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          phone: parsedProfileData.phone,
          age: parsedProfileData.age,
          goals: parsedProfileData.goals,
          challenges: parsedProfileData.challenges,
          currenthabits: parsedProfileData.currentHabits,
          schedule: parsedProfileData.schedule,
          description: parsedProfileData.description,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        throw profileError;
      }

      // Generate AI plan using Python backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/generate-goal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          profile: {
            age: parsedProfileData.age,
            schedule: parsedProfileData.schedule,
            goals: parsedProfileData.goals,
            challenges: parsedProfileData.challenges,
            currenthabits: parsedProfileData.currentHabits,
            description: parsedProfileData.description
          },
          goal: {
            primary_goal: goalData.primaryGoal,
            goal_duration: goalData.goalDuration,
            duration_type: goalData.durationType
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const result = await response.json();

      console.log('CURRENT LOGGED IN USER ID` ', user?.id);
      // const { error: planError } = await supabase
      //   .from('users_profile')
      //   .update({
      //     generated_plan: result.plan,
      //     plan_generated_at: new Date().toISOString()
      //   })
      //   .eq('id', user?.id);

      // if (planError) {
      //   console.error('Error saving plan:', planError);
      // }

      // Redirect to main app
      router.push('/');
    } catch (err) {
      console.error('Error during onboarding:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during onboarding');
      setGeneratingPlan(false);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to HabitElevate! 🎯
          </h1>
          <p className="text-gray-600">
            Let's set you up for success in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us a bit about yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={profileData.age || ''}
                  onChange={(e) => handleProfileChange('age', parseInt(e.target.value) || 0)}
                  className="w-full"
                  min="13"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule Type</Label>
                <Input
                  id="schedule"
                  type="text"
                  placeholder="Flexible, Fixed, Busy, etc."
                  value={profileData.schedule}
                  onChange={(e) => handleProfileChange('schedule', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About You (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about yourself, your lifestyle, occupation, etc."
                  value={profileData.description}
                  onChange={(e) => handleProfileChange('description', e.target.value)}
                  className="w-full min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Detailed Profile */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-600" />
                Your Goals & Habits
              </CardTitle>
              <CardDescription>
                Help us understand you better (comma-separated values)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goals">General Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="Be healthier, Learn new skills, Build better habits"
                  value={goalsInput}
                  onChange={(e) => setGoalsInput(e.target.value)}
                  className="w-full min-h-20"
                />
                <p className="text-xs text-gray-500">Separate multiple goals with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="Procrastination, Time management, Staying motivated"
                  value={challengesInput}
                  onChange={(e) => setChallengesInput(e.target.value)}
                  className="w-full min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentHabits">Current Habits</Label>
                <Textarea
                  id="currentHabits"
                  placeholder="Exercise 3x week, Read daily, Meditate"
                  value={currentHabitsInput}
                  onChange={(e) => setCurrentHabitsInput(e.target.value)}
                  className="w-full min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Goal Setting */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                What's Your Primary Goal?
              </CardTitle>
              <CardDescription>
                Let's create a personalized plan to help you achieve it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryGoal">
                  What do you want to achieve? *
                </Label>
                <Textarea
                  id="primaryGoal"
                  placeholder="E.g., Master web development, Learn machine learning, Get fit and healthy, Build a successful startup..."
                  value={goalData.primaryGoal}
                  onChange={(e) => handleGoalChange('primaryGoal', e.target.value)}
                  className="w-full min-h-32"
                />
                <p className="text-xs text-gray-500">
                  Be as specific as possible. The more details, the better your plan will be!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalDuration" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline *
                </Label>
                <div className="flex gap-4">
                  <Input
                    id="goalDuration"
                    type="number"
                    placeholder="12"
                    value={goalData.goalDuration || ''}
                    onChange={(e) => handleGoalChange('goalDuration', parseInt(e.target.value) || 0)}
                    className="flex-1"
                    min="1"
                  />
                  <select
                    value={goalData.durationType}
                    onChange={(e) => handleGoalChange('durationType', e.target.value as 'days' | 'weeks' | 'months')}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">AI-Powered Plan</h4>
                    <p className="text-sm text-blue-700">
                      Our AI will analyze your profile and create a customized step-by-step plan
                      with actionable habits, milestones, and daily tasks tailored to your timeline.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State for Plan Generation */}
        {generatingPlan && (
          <Card className="mt-6">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Creating Your Personalized Plan ✨
                  </h3>
                  <p className="text-gray-600">
                    Our AI is analyzing your profile and crafting a tailored roadmap...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {!generatingPlan && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || loading}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step === 3 ? 'Generating...' : 'Processing...'}
                </>
              ) : (
                <>
                  {step === 3 ? 'Generate My Plan' : 'Next'}
                  {step < 3 && <ArrowRight className="h-4 w-4" />}
                  {step === 3 && <Sparkles className="h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
