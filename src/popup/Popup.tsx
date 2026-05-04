import React, { useState, useEffect } from 'react';
import { Gear, ArrowRight, X } from '@phosphor-icons/react';
import type { SummaryData, ExtractionResponse } from '../types';

const Popup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
        chrome.storage.local.get(tabs[0].url, (result: { [key: string]: SummaryData }) => {
          if (tabs[0].url && result[tabs[0].url]) {
            setSummary(result[tabs[0].url]);
          }
        });
      }
    });
  }, []);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active tab found');

      const extraction: ExtractionResponse = await chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_CONTENT' });
      if (!extraction.success || !extraction.data) {
        throw new Error(extraction.error || 'Failed to extract page content');
      }

      chrome.runtime.sendMessage(
        { action: 'SUMMARIZE_CONTENT', payload: extraction.data },
        (response: { success: boolean; data: SummaryData; error?: string }) => {
          if (response.success) {
            setSummary(response.data);
            chrome.storage.local.set({ [currentUrl]: response.data });
          } else {
            setError(response.error || 'Failed to generate summary');
          }
          setLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setError(null);
    if (currentUrl) chrome.storage.local.remove(currentUrl);
  };

  return (
    <div className="w-[360px] min-h-[200px] max-h-[580px] flex flex-col bg-canvas text-charcoal overflow-hidden selection:bg-primary/10 selection:text-primary">
      <header className="flex items-center justify-between px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight text-charcoal">tldr.</h1>
        <button 
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-muted hover:text-charcoal transition-colors"
        >
          <Gear size={22} weight="bold" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
        {!summary && !loading && !error && (
          <div className="py-8 animate-fade-up">
            <h2 className="text-xl font-bold mb-3">Save time reading.</h2>
            <p className="text-sm text-muted mb-8 leading-relaxed">
              Generate a quick summary of any page in seconds.
            </p>
            <button onClick={handleSummarize} className="btn-primary w-full gap-2">
              <span>Summarize</span>
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        )}

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-4 animate-fade-up">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium text-muted">Reading page...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 rounded-3xl animate-fade-up">
            <h3 className="font-bold text-red-600 mb-2">Error</h3>
            <p className="text-sm text-red-500 mb-6 leading-relaxed">{error}</p>
            <button onClick={handleSummarize} className="text-sm font-bold text-red-600 hover:underline">
              Try again
            </button>
          </div>
        )}

        {summary && (
          <div className="space-y-8 animate-fade-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                {summary.readingTime}
              </span>
              <button onClick={handleReset} className="text-muted hover:text-charcoal transition-colors">
                <X size={18} weight="bold" />
              </button>
            </div>

            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Summary</h2>
              <div className="space-y-4">
                {summary.summary.map((point, i) => (
                  <div key={i} className="text-sm leading-relaxed text-charcoal flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted">Insights</h2>
              <div className="space-y-3">
                {summary.keyInsights.map((insight, i) => (
                  <div key={i} className="p-4 bg-surface rounded-2xl text-sm text-charcoal leading-relaxed shadow-sm border border-[#E8E6E0]">
                    {insight}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Popup;
