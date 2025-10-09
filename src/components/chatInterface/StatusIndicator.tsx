"use client";

import React from 'react';
import { Loader2, Cog, Palette, CheckCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'thinking' | 'executing_tools' | 'generating_ui' | 'complete';
  message: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'thinking':
        return {
          icon: Loader2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500'
        };
      case 'executing_tools':
        return {
          icon: Cog,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          iconColor: 'text-orange-500'
        };
      case 'generating_ui':
        return {
          icon: Palette,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-500'
        };
      case 'complete':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500'
        };
      default:
        return {
          icon: Loader2,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`mb-3 p-3 ${config.bgColor} border ${config.borderColor} rounded-lg transition-all duration-300`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <IconComponent 
            className={`h-4 w-4 ${config.iconColor} ${
              status !== 'complete' ? 'animate-spin' : ''
            }`} 
          />
        </div>
        <div className="flex-1">
          <span className={`text-sm font-medium ${config.color}`}>
            {message}
          </span>
        </div>
        {status !== 'complete' && (
          <div className="flex-shrink-0">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;
