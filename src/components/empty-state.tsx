import React from 'react';

interface EmptyStateProps {
  onSummarize: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSummarize }) => {
  return (
    <div className="flex flex-col h-full items-start justify-center px-8 py-10">
      <h2 className="text-3xl font-bold text-espresso leading-tight mb-3">Distill the noise.</h2>
      <p className="text-base text-sage mb-10 max-w-[260px] leading-relaxed">
        Extract the core insights from this article in seconds. No fluff, just facts.
      </p>
      <button 
        onClick={onSummarize}
        className="w-full py-3.5 bg-terracotta text-white rounded hover:bg-[#C05030] transition-colors font-medium text-[15px]"
      >
        Summarize Page
      </button>
    </div>
  );
};
