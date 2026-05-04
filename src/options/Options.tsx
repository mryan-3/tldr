import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, Warning, CircleNotch } from '@phosphor-icons/react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    chrome.storage.local.get('apiKey', (res: { apiKey?: string }) => { if (res.apiKey) setApiKey(res.apiKey); });
  }, []);

  const [errorMsg, setErrorMsg] = useState('Invalid Key');

  const handleSave = async () => {
    setStatus('saving');
    setErrorMsg('Invalid Key');
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const result = await model.generateContent('ping');
      const response = await result.response;

      if (response.text()) {
        chrome.storage.local.set({ apiKey }, () => {
          setStatus('saved');
          setTimeout(() => setStatus('idle'), 2000);
        });
      }
    } catch (e: any) {
      if (e?.message?.includes('503') || e?.message?.includes('demand')) {
        setErrorMsg('API Busy - Try Later');
      }
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-20 px-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-10 animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Settings</h1>
          <p className="text-sm text-muted">Enter your API key to start using tldr.</p>
        </header>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">Gemini API Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-muted">
                  <Key size={18} weight="bold" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3 bg-surface border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                  placeholder="Paste your key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={status === 'saving'}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {status === 'saving' && <CircleNotch className="animate-spin" size={18} />}
              {status === 'error' ? errorMsg : status === 'saving' ? 'Verifying...' : 'Save & Verify'}
            </button>

            {status === 'saved' && (
              <div className="text-green-500 text-center animate-fade-up">
                <CheckCircle size={24} weight="fill" />
              </div>
            )}

            <div className="pt-4 flex items-start gap-3 p-4 bg-primary/5 rounded-2xl">
              <Warning size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary/80 leading-relaxed">
                Your key is stored locally and tested before saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Options;
