import React, { useState, useEffect } from 'react';
import { CheckCircle } from '@phosphor-icons/react';

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    chrome.storage.local.get('apiKey', (res: { apiKey?: string }) => { if (res.apiKey) setApiKey(res.apiKey); });
  }, []);

  const handleSave = () => {
    setStatus('saving');
    chrome.storage.local.set({ apiKey }, () => {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-20 px-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Settings</h1>
          <p className="text-sm text-neutral-500">Enter your Gemini API key.</p>
        </header>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-neutral-100">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">How to get a key</h2>
              <ol className="text-sm text-neutral-600 list-decimal list-inside space-y-1">
                <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-neutral-900 underline">Google AI Studio</a>.</li>
                <li>Click "Create API key".</li>
                <li>Copy and paste the key below.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">API Key</label>
              <div className="relative">
                <input
                  type="password"
                  className="block w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-full focus:ring-1 focus:ring-neutral-900 outline-none text-sm"
                  placeholder="Paste key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={status === 'saving'}
              className="w-full py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-all"
            >
              {status === 'saving' ? 'Saving...' : 'Save'}
            </button>
            
            {status === 'saved' && (
              <div className="text-green-600 text-center text-sm font-medium flex items-center justify-center gap-2">
                <CheckCircle size={16} /> Key saved successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Options;
