import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, KeyIcon } from './icons';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(savedApiKey.length > 0);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    const valid = value.trim().length > 0;
    setIsValid(valid);
    
    // Save to localStorage
    if (valid) {
      localStorage.setItem('gemini_api_key', value.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    
    onApiKeyChange(value.trim());
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <KeyIcon className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-gray-200">Gemini API Key</h3>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Enter your Google Gemini API key to generate images. 
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 ml-1"
        >
          Get your key here
        </a>
      </p>
      
      <div className="relative">
        <input
          type={showApiKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          placeholder="Enter your Gemini API key..."
          className={`w-full bg-slate-700 text-white p-3 pr-10 rounded-md border transition-colors outline-none ${
            apiKey.length === 0 
              ? 'border-slate-600 focus:border-blue-500' 
              : isValid 
                ? 'border-green-500 focus:border-green-400' 
                : 'border-red-500 focus:border-red-400'
          }`}
        />
        <button
          type="button"
          onClick={toggleShowApiKey}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          {showApiKey ? (
            <EyeSlashIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {apiKey.length > 0 && (
        <div className={`mt-2 text-xs ${isValid ? 'text-green-400' : 'text-red-400'}`}>
          {isValid ? '✓ API key saved' : '⚠ Please enter a valid API key'}
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;