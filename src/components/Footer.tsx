import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { Globe } from 'lucide-react';

export function Footer({ onAboutClick }: { onAboutClick: () => void }) {
  const { language } = useAppContext();

  return (
    <footer className="bg-white border-t px-6 py-4 flex items-center justify-between text-[10px] text-slate-400 font-medium mt-auto w-full">
      <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <span>{getTranslation(language, 'footer')}</span>
        <div className="flex gap-4">
          <span 
            className="cursor-pointer hover:text-slate-600 transition-colors"
            onClick={onAboutClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onAboutClick()}
          >
            About Us
          </span>
          <span className="cursor-pointer hover:text-slate-600">GitHub: NitinGlobalNews</span>
          <span className="cursor-pointer hover:text-slate-600">Terms of Service</span>
          <span className="cursor-pointer hover:text-slate-600">Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
