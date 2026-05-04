import React from 'react';
import { Lightning } from '@phosphor-icons/react';

const Popup: React.FC = () => {
  return (
    <div className="w-[350px] p-4 bg-white text-gray-900">
      <header className="flex items-center gap-2 mb-4 border-b pb-2">
        <Lightning size={24} weight="fill" className="text-yellow-500" />
        <h1 className="text-xl font-bold tracking-tight">tldr</h1>
      </header>
      
      <main className="space-y-4">
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
          <p>Ready to summarize this page?</p>
          <button className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Summarize Page
          </button>
        </div>
      </main>

      <footer className="mt-4 pt-2 border-t text-[10px] text-gray-400 text-center">
        Powered by AI
      </footer>
    </div>
  );
};

export default Popup;
