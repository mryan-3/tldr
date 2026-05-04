import React, { useState, useEffect } from 'react';
import { Lightning, Clock, ListBullets, Lightbulb, ArrowsClockwise, Warning, Gear } from '@phosphor-icons/react';
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
        // Check cache
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

      // 1. Trigger extraction
      const extraction: ExtractionResponse = await chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_CONTENT' });

      if (!extraction.success || !extraction.data) {
        throw new Error(extraction.error || 'Failed to extract page content');
      }

      // 2. Trigger summarization
      chrome.runtime.sendMessage(
        { action: 'SUMMARIZE_CONTENT', payload: extraction.data },
        (response: { success: boolean; data: SummaryData; error?: string }) => {
          if (response.success) {
            setSummary(response.data);
            // Cache result
            chrome.storage.local.set({ [currentUrl]: response.data });
          } else {
            setError(response.error || 'Failed to generate summary');
          }
          setLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setError(null);
    if (currentUrl) {
      chrome.storage.local.remove(currentUrl);
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[380px] min-h-[200px] max-h-[580px] flex flex-col bg-white text-gray-900 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Lightning size={22} weight="fill" className="text-yellow-500" />
          <h1 className="text-lg font-bold tracking-tight">tldr</h1>
        </div>
        <button 
          onClick={openOptions}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          title="Settings"
        >
          <Gear size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {!summary && !loading && !error && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <ArrowsClockwise size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Ready to summarize this page?</p>
              <p className="text-xs text-gray-400 mt-1">Get key points and insights in seconds.</p>
            </div>
            <button 
              onClick={handleSummarize}
              className="w-full py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-sm active:scale-[0.98]"
            >
              Summarize Page
            </button>
          </div>
        )}

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-black rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-600 animate-pulse">Analyzing content...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <Warning size={20} weight="fill" />
              <p className="text-sm">Something went wrong</p>
            </div>
            <p className="text-xs text-red-500 leading-relaxed">{error}</p>
            <button 
              onClick={handleSummarize}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {summary && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-dashed">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock size={16} />
                <span className="text-xs font-medium">{summary.readingTime}</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-wider"
              >
                Clear
              </button>
            </div>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-black font-bold text-sm uppercase tracking-tight">
                <ListBullets size={18} weight="bold" />
                <h2>Executive Summary</h2>
              </div>
              <ul className="space-y-2.5">
                {summary.summary.map((point, i) => (
                  <li key={i} className="text-[13px] leading-relaxed text-gray-600 flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-black font-bold text-sm uppercase tracking-tight">
                <Lightbulb size={18} weight="bold" className="text-yellow-500" />
                <h2>Key Insights</h2>
              </div>
              <div className="grid gap-2">
                {summary.keyInsights.map((insight, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg text-[13px] text-gray-700 italic border-l-2 border-black">
                    "{insight}"
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center text-[10px] text-gray-400">
        <span>v1.0.0</span>
        <span className="font-medium">tldr AI</span>
      </footer>
    </div>
  );
};

export default Popup;
