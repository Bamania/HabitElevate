"use client";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Send, Bot, User, Sparkles, FileText } from 'lucide-react';
import { useAGUI } from "../../lib/customHooks/useAGUI";
import HabitPlanForm from "./HabitPlanForm";
import { GenerativeUIRenderer } from "./GenerativeUIComponents";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
  hasForm?: boolean;
  formData?: any;
  generativeUI?: {
    type: string;
    data: any;
  };
}

interface AGUIChatProps {
  userId?: string;
  className?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

interface AGUIChatRef {
  sendMessage: (message: string) => void;
}

const AGUIChat = forwardRef<AGUIChatRef, AGUIChatProps>(({ userId = "default_user", className = "", onSuggestionClick }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [showingFormId, setShowingFormId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, isLoading, error } = useAGUI();

  // Function to detect if response should trigger a form
  const shouldShowForm = (content: string): boolean => {
    const formTriggers = [
      'build a plan',
      'create a plan', 
      'habit plan',
      'planning form',
      'fill out',
      'form to complete',
      'build your habit'
    ];
    
    return formTriggers.some(trigger => 
      content.toLowerCase().includes(trigger.toLowerCase())
    );
  };

  // Function to detect and parse generative UI components
  const parseGenerativeUI = (content: string): { type: string; data: any } | null => {
    // Look for JSON blocks that contain generative UI data
    const uiBlockRegex = /```ui-(\w+)\n([\s\S]*?)\n```/;
    const match = content.match(uiBlockRegex);
    
    if (match) {
      const [, type, jsonData] = match;
      try {
        const data = JSON.parse(jsonData);
        return { type, data };
      } catch (e) {
        console.error('Error parsing generative UI data:', e);
      }
    }

    // Alternative: Look for specific UI trigger phrases and generate sample data
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('show progress') || lowerContent.includes('track progress')) {
      return {
        type: 'progress',
        data: {
          title: 'Morning Workout Progress',
          currentStreak: 7,
          goal: 30,
          progress: 23,
          lastActivity: '2 hours ago'
        }
      };
    }
    
    if (lowerContent.includes('schedule') || lowerContent.includes('daily routine')) {
      return {
        type: 'schedule',
        data: {
          title: "Today's Habit Schedule",
          schedule: 'Daily • 7:00 AM',
          nextReminder: 'Tomorrow at 7:00 AM',
          tasks: [
            { name: '10 minutes meditation', duration: '10 min' },
            { name: '20 push-ups', duration: '5 min' },
            { name: 'Journal 3 gratitudes', duration: '5 min' }
          ]
        }
      };
    }
    
    if (lowerContent.includes('timer') || lowerContent.includes('start session')) {
      return {
        type: 'timer',
        data: {
          title: 'Meditation Session',
          duration: 10, // minutes
          type: 'Mindfulness'
        }
      };
    }
    
    if (lowerContent.includes('stats') || lowerContent.includes('analytics') || lowerContent.includes('insights')) {
      return {
        type: 'stats',
        data: {
          title: 'Weekly Habit Analytics',
          stats: [
            { value: '85%', label: 'Completion Rate' },
            { value: '12', label: 'Active Habits' },
            { value: '45', label: 'Total Days' },
            { value: '3.2x', label: 'Improvement' }
          ],
          insights: [
            'Your morning habits have 95% completion rate',
            'Best performance on weekdays',
            'Consider adding evening routine'
          ]
        }
      };
    }
    
    if (lowerContent.includes('quick actions') || lowerContent.includes('what can i do')) {
      return {
        type: 'actions',
        data: {
          title: 'Quick Actions',
          actions: [
            {
              title: 'Log Habit',
              description: 'Mark habit as done',
              icon: 'check',
              color: 'bg-green-100'
            },
            {
              title: 'Add Habit',
              description: 'Create new habit',
              icon: 'plus',
              color: 'bg-blue-100'
            },
            {
              title: 'View Calendar',
              description: 'See schedule',
              icon: 'calendar',
              color: 'bg-purple-100'
            },
            {
              title: 'Achievements',
              description: 'View badges',
              icon: 'award',
              color: 'bg-yellow-100'
            }
          ]
        }
      };
    }
    
    if (lowerContent.includes('achievement') || lowerContent.includes('congratulations') || lowerContent.includes('milestone')) {
      return {
        type: 'achievement',
        data: {
          title: 'First Week Warrior',
          description: 'Completed your first 7-day streak! Keep up the amazing work.',
          icon: 'award',
          rarity: 'rare',
          unlockedAt: 'just now'
        }
      };
    }
    
    return null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      type: 'ai',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    const messageToSend = prompt.trim();
    setPrompt("");

    try {
      // Track accumulated content for streaming
      let accumulatedContent = "";

      await sendMessage(
        messageToSend,
        userId,
        // Chunk callback for real-time streaming
        (chunk: string) => {
          accumulatedContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: accumulatedContent, isStreaming: true }
                : msg
            )
          );
        }
      );

      // Mark as completed and check if we should show a form or generative UI
      setMessages(prev => 
        prev.map(msg => {
          if (msg.id === aiMessageId) {
            const hasForm = shouldShowForm(accumulatedContent);
            const generativeUI = parseGenerativeUI(accumulatedContent);
            
            if (hasForm) {
              setShowingFormId(aiMessageId);
            }
            
            return { 
              ...msg, 
              isStreaming: false,
              hasForm,
              generativeUI
            };
          }
          return msg;
        })
      );

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: "Sorry, I encountered an error. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setStreamingMessageId(null);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFormSubmit = async (formData: any) => {
    // Hide the form
    setShowingFormId(null);
    
    // Create a summary message from the form data
    const formSummary = `I've filled out the habit plan form:
    
**Habit:** ${formData.habitName}
**Category:** ${formData.category}
**Frequency:** ${formData.frequency}
**Duration:** ${formData.duration} minutes
**Best time:** ${formData.timeOfDay}
**Start date:** ${formData.startDate}
**Motivation:** ${formData.motivation}
${formData.obstacles.length > 0 ? `**Potential obstacles:** ${formData.obstacles.join(', ')}` : ''}
${formData.rewards.length > 0 ? `**Rewards:** ${formData.rewards.join(', ')}` : ''}

Please create a detailed habit plan based on this information.`;

    // Add user message with form data
    const userMessage: Message = {
      id: Date.now().toString(),
      content: formSummary,
      type: 'user',
      timestamp: new Date(),
      formData
    };

    setMessages(prev => [...prev, userMessage]);

    // Send to AI for processing
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      type: 'ai',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      let accumulatedContent = "";

      await sendMessage(
        `Based on this habit plan form data, create a detailed and actionable habit plan: ${JSON.stringify(formData)}`,
        userId,
        (chunk: string) => {
          accumulatedContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: accumulatedContent, isStreaming: true }
                : msg
            )
          );
        }
      );

      // Mark as completed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error('Error processing form:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: "Sorry, I had trouble processing your form. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setStreamingMessageId(null);
    }
  };

  const handleFormCancel = () => {
    setShowingFormId(null);
  };

  // Method to send message externally (for suggestions)
  const sendExternalMessage = async (message: string) => {
    setPrompt(message);
    // Simulate form submit
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    sendMessage: sendExternalMessage
  }));

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">AGUI Chat</h2>
            <p className="text-sm text-gray-600">Powered by Agno</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Ask me anything about habit building!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-indigo-600' 
                  : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-600" />
                )}
              </div>

              {/* Message Content */}
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}>
                <div className="whitespace-pre-wrap">
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                  )}
                </div>
                
                {/* Show generative UI component if available */}
                {message.generativeUI && message.type === 'ai' && !message.isStreaming && (
                  <div className="mt-3">
                    <GenerativeUIRenderer 
                      type={message.generativeUI.type} 
                      data={message.generativeUI.data} 
                    />
                  </div>
                )}
                
                {/* Show form button if this message should have a form */}
                {message.hasForm && message.type === 'ai' && !message.isStreaming && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setShowingFormId(message.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Fill Out Habit Plan Form</span>
                    </button>
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">Error: {error}</p>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>

      {/* Form Modal Overlay */}
      {showingFormId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <HabitPlanForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
});

AGUIChat.displayName = 'AGUIChat';

export default AGUIChat;
