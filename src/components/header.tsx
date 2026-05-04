import React from 'react';
import { Gear } from '@phosphor-icons/react';

interface HeaderProps {
  onOpenOptions: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOptions }) => {
  return (
    <header className="flex items-center justify-between px-6 py-5 bg-cream z-10 sticky top-0">
      <h1 className="text-xl font-bold tracking-tight text-espresso">tldr.</h1>
      <button 
        onClick={onOpenOptions}
        className="p-1 text-[#889C8D] hover:text-espresso transition-colors rounded-md"
        title="Settings"
      >
        <Gear size={20} weight="light" />
      </button>
    </header>
  );
};
