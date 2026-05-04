import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-start justify-center py-10 px-8 text-left">
      <h3 className="text-xl font-bold text-espresso mb-2">Something went wrong.</h3>
      <p className="text-sm text-sage mb-8 leading-relaxed max-w-[260px]">{error}</p>
      <button 
        onClick={onRetry}
        className="px-6 py-2.5 bg-[#E2E0D8] text-espresso rounded hover:bg-[#D1CFC7] transition-colors font-medium text-[15px]"
      >
        Try Again
      </button>
    </div>
  );
};
