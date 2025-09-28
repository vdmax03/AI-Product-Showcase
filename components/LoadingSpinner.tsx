import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  progress?: number;
  showProgress?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Generating...', 
  progress,
  showProgress = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {/* Animated Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        {showProgress && progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-white mb-2">{text}</p>
        {showProgress && progress !== undefined && (
          <div className="w-48 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        <p className="text-sm text-gray-400 mt-2">Please wait while we create your content...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
