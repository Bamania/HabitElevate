"use client";
import { useState } from "react";
import { Play, CheckCircle, MessageSquare } from 'lucide-react';

interface TestStep {
  id: number;
  title: string;
  description: string;
  action: string;
  expected: string;
  completed: boolean;
}

export default function FormTestDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    {
      id: 1,
      title: "Start AGUI Chat",
      description: "Enable AGUI mode using the toggle switch",
      action: "Toggle AGUI switch to ON",
      expected: "Chat interface shows 'Using AGUI Protocol for enhanced AI interactions'",
      completed: false
    },
    {
      id: 2,
      title: "Request Habit Plan",
      description: "Ask the AI to help build a habit plan",
      action: "Type: 'I want to build a plan for a new habit'",
      expected: "AI responds with text mentioning 'build a plan' and shows a blue form button",
      completed: false
    },
    {
      id: 3,
      title: "Open Form",
      description: "Click the form button to open the interactive form",
      action: "Click 'Fill Out Habit Plan Form' button",
      expected: "Modal opens with step-by-step habit planning form",
      completed: false
    },
    {
      id: 4,
      title: "Fill Form",
      description: "Complete the multi-step form with habit details",
      action: "Fill out all form steps: Basic Info → Schedule → Motivation → Success Planning",
      expected: "Form validates each step and allows progression",
      completed: false
    },
    {
      id: 5,
      title: "Submit Form",
      description: "Submit the completed form",
      action: "Click 'Create Plan' button",
      expected: "Form closes, user message shows form summary, AI creates detailed plan",
      completed: false
    }
  ]);

  const markStepComplete = (stepId: number) => {
    setTestSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    if (stepId === currentStep + 1) {
      setCurrentStep(stepId);
    }
  };

  const resetTest = () => {
    setCurrentStep(0);
    setTestSteps(prev => 
      prev.map(step => ({ ...step, completed: false }))
    );
  };

  const completedSteps = testSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / testSteps.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Play className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Interactive Form Test</h2>
        </div>
        <p className="text-gray-600">Test the AGUI interactive habit planning form</p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {completedSteps} of {testSteps.length} steps completed
          </div>
        </div>
      </div>

      {/* Test Steps */}
      <div className="space-y-4">
        {testSteps.map((step, index) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 transition-all ${
              step.completed 
                ? 'border-green-200 bg-green-50' 
                : index === currentStep 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed 
                      ? 'bg-green-600 text-white' 
                      : index === currentStep 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-3">{step.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Action: </span>
                      <span className="text-sm text-gray-600">{step.action}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Expected: </span>
                      <span className="text-sm text-gray-600">{step.expected}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!step.completed && (
                <button
                  onClick={() => markStepComplete(step.id)}
                  className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
        <div className="text-sm text-gray-500">
          {completedSteps === testSteps.length ? (
            <span className="text-green-600 font-medium">🎉 All tests completed!</span>
          ) : (
            <span>Follow the steps above to test the interactive form functionality</span>
          )}
        </div>
        
        <button
          onClick={resetTest}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset Test
        </button>
      </div>

      {/* Quick Test Messages */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Quick Test Messages:</h4>
        <div className="space-y-1 text-sm">
          <div className="font-mono bg-white px-2 py-1 rounded border">"I want to build a plan"</div>
          <div className="font-mono bg-white px-2 py-1 rounded border">"Help me create a habit plan"</div>
          <div className="font-mono bg-white px-2 py-1 rounded border">"I need to plan a new habit"</div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Copy any of these messages to quickly trigger the form functionality
        </p>
      </div>
    </div>
  );
}
