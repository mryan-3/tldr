import React from 'react';
import type { SummaryData } from '../types';

interface SummaryViewProps {
  summary: SummaryData;
  onReset: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary, onReset }) => {
  return (
    <div className="px-6 pb-8 space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-4">
        <span className="text-[13px] font-medium text-sage uppercase tracking-wider">{summary.readingTime}</span>
        <button 
          onClick={onReset}
          className="text-[13px] font-medium text-terracotta hover:text-[#C05030] transition-colors"
        >
          Reset
        </button>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-espresso mb-5">Summary.</h2>
        <ul className="space-y-4">
          {summary.summary.map((point, i) => (
            <li key={i} className="text-[15px] leading-relaxed text-[#4A4543] flex items-start gap-4">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-espresso mb-5">Insights.</h2>
        <div className="space-y-4">
          {summary.keyInsights.map((insight, i) => (
            <div key={i} className="text-[15px] leading-relaxed text-[#4A4543] pl-4 border-l-[3px] border-terracotta">
              {insight}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
