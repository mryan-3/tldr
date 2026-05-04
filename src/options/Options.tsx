import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, Warning } from '@phosphor-icons/react';

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    chrome.storage.local.get('apiKey', (result) => {
      if (result.apiKey) setApiKey(result.apiKey);
    });
  }, []);

  const handleSave = () => {
    setStatus('saving');
    chrome.storage.local.set({ apiKey }, () => {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">tldr Settings</h1>
          <p className="mt-2 text-sm text-gray-500">Configure your Gemini API key to start summarizing.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Gemini API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="apiKey"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black sm:text-sm"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Your key is stored locally in your browser and is only used to make requests to Google's Gemini API.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
          >
            {status === 'saving' ? 'Saving...' : 'Save Settings'}
          </button>

          {status === 'saved' && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <CheckCircle size={18} weight="fill" />
              <span>Settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Options;
