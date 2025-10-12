"use client";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { Save, Calendar, Clock, Target, Zap, Plus, X, CheckCircle, AlertCircle, ListTodo } from 'lucide-react';

interface AgentOrderData {
  taskName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  deadline: string;
  estimatedDuration: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  context: string;
  userId?: string;
}

interface AgentOrderFormProps {
  onSubmit: (data: AgentOrderData) => void;
  onCancel?: () => void;
  initialData?: Partial<AgentOrderData>;
}

export default function AgentOrderForm({ onSubmit, onCancel, initialData }: AgentOrderFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<AgentOrderData>({
    taskName: initialData?.taskName || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || 'general',
    deadline: initialData?.deadline || '',
    estimatedDuration: initialData?.estimatedDuration || '30',
    description: initialData?.description || '',
    requirements: initialData?.requirements || [''],
    deliverables: initialData?.deliverables || [''],
    context: initialData?.context || '',
    userId: user?.id,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const priorities = [
    { value: 'low', label: 'Low Priority', icon: '🟢', color: 'green' },
    { value: 'medium', label: 'Medium Priority', icon: '🟡', color: 'yellow' },
    { value: 'high', label: 'High Priority', icon: '🟠', color: 'orange' },
    { value: 'urgent', label: 'Urgent', icon: '🔴', color: 'red' }
  ];

  const categories = [
    { value: 'general', label: 'General Task', icon: '📋' },
    { value: 'research', label: 'Research', icon: '🔍' },
    { value: 'analysis', label: 'Analysis', icon: '📊' },
    { value: 'writing', label: 'Writing', icon: '✍️' },
    { value: 'planning', label: 'Planning', icon: '🗓️' },
    { value: 'communication', label: 'Communication', icon: '💬' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'technical', label: 'Technical', icon: '⚙️' }
  ];

  const updateFormData = (field: keyof AgentOrderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: 'requirements' | 'deliverables') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateListItem = (field: 'requirements' | 'deliverables', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'requirements' | 'deliverables', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure user is logged in
    if (!user?.id) {
      alert('You must be logged in to create an order');
      return;
    }
    
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      userId: user.id, // Ensure userId is included
      requirements: formData.requirements.filter(item => item.trim() !== ''),
      deliverables: formData.deliverables.filter(item => item.trim() !== '')
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
        return formData.taskName.trim() !== '' && formData.category !== '';
      case 2:
        return formData.description.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-blue-200 w-full max-h-[500px] overflow-y-auto">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <ListTodo className="h-4 w-4 text-blue-600" />
          <h2 className="text-base font-bold text-black">Add Order</h2>
        </div>
        <p className="text-xs text-black text-center">Create a task for your AI agent</p>
        
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  i + 1 <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {i + 1 <= currentStep ? <CheckCircle className="h-3 w-3" /> : i + 1}
              </div>
            ))}
          </div>
          <div className="text-xs text-black text-center">Step {currentStep} of {totalSteps}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-black">What task do you need?</h3>
            
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.taskName}
                onChange={(e) => updateFormData('taskName', e.target.value)}
                placeholder="e.g., Research competitors, Write blog post"
                className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateFormData('category', cat.value)}
                    className={`p-2 rounded-lg border text-left transition-all text-xs ${
                      formData.category === cat.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-black'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="font-medium">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Priority Level *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => updateFormData('priority', priority.value)}
                    className={`p-2 rounded-lg border text-left transition-all text-xs ${
                      formData.priority === priority.value
                        ? `border-${priority.color}-500 bg-${priority.color}-50 text-${priority.color}-700`
                        : 'border-gray-200 hover:border-gray-300 text-black'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{priority.icon}</span>
                      <span className="font-medium">{priority.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-black">Provide task details</h3>
            
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Task Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe what you need..."
                rows={3}
                className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => updateFormData('deadline', e.target.value)}
                  className="w-full px-2 py-2 text-xs text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => updateFormData('estimatedDuration', e.target.value)}
                  min="5"
                  step="5"
                  className="w-full px-2 py-2 text-xs text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Additional Context
              </label>
              <textarea
                value={formData.context}
                onChange={(e) => updateFormData('context', e.target.value)}
                placeholder="Any extra info..."
                rows={2}
                className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        {/* Step 3: Requirements & Deliverables */}
        {currentStep === 3 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-black">Requirements & Deliverables</h3>
            
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Requirements
              </label>
              <div className="space-y-1">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateListItem('requirements', index, e.target.value)}
                      placeholder="Add a requirement..."
                      className="flex-1 px-2 py-1.5 text-xs text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('requirements', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('requirements')}
                  className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add requirement</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Expected Deliverables
              </label>
              <div className="space-y-1">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => updateListItem('deliverables', index, e.target.value)}
                      placeholder="What should be delivered..."
                      className="flex-1 px-2 py-1.5 text-xs text-black border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('deliverables', index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem('deliverables')}
                  className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add deliverable</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex space-x-1">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-3 py-1.5 text-xs text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-xs text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center space-x-1 px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <Zap className="h-3 w-3" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid()}
                className="flex items-center space-x-1 px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-3 w-3" />
                <span>Submit Order</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
