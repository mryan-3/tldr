import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, Warning } from '@phosphor-icons/react';

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    chrome.storage.local.get('apiKey', (result: { apiKey?: string }) => {
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
    <div className="min-h-screen bg-surface py-20 px-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-10 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Settings</h1>
          <p className="text-sm text-muted">Enter your API key to start using tldr.</p>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Gemini API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Key size={18} weight="bold" />
                </div>
                <input
                  type="password"
                  id="apiKey"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                  placeholder="Paste your key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="btn-primary flex-1 py-3"
              >
                {status === 'saving' ? 'Saving...' : 'Save'}
              </button>
              
              {status === 'saved' && (
                <div className="text-green-500 animate-fade-up">
                  <CheckCircle size={24} weight="fill" />
                </div>
              )}
            </div>

            <div className="pt-4 flex items-start gap-3 p-4 bg-primary/5 rounded-2xl">
              <Warning size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary/80 leading-relaxed">
                Your key is stored locally on your device and is never shared.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs font-bold text-muted hover:text-primary transition-colors underline underline-offset-4"
          >
            Get an API key
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Options;
