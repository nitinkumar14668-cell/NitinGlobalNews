import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { Globe, Twitter, Facebook, Linkedin } from 'lucide-react';

export function Footer({ onAboutClick }: { onAboutClick: () => void }) {
  const { language } = useAppContext();

  return (
    <footer className="bg-white border-t px-6 py-6 flex flex-col items-center justify-between text-[11px] text-slate-500 font-medium mt-auto w-full">
      <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span>{getTranslation(language, 'footer')}</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <span 
            className="cursor-pointer hover:text-blue-600 transition-colors"
            onClick={onAboutClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onAboutClick()}
          >
            About Us
          </span>
          <span className="cursor-pointer hover:text-blue-600 transition-colors">Terms of Service</span>
          <span className="cursor-pointer hover:text-blue-600 transition-colors">Privacy Policy</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

