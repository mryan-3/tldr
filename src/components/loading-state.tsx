import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center py-16 space-y-5">
      <div className="w-5 h-5 border-2 border-[#E2E0D8] border-t-terracotta rounded-full animate-spin" />
      <p className="text-sm font-medium text-sage tracking-wide uppercase">Reading...</p>
    </div>
  );
};
