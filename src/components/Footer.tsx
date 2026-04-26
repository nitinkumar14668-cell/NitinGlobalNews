import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { Globe } from 'lucide-react';

export function Footer() {
  const { language } = useAppContext();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Globe className="h-6 w-6 text-blue-500" />
            <span>NitinGlobalNews</span>
          </div>
          <p className="text-sm leading-5 text-gray-400 text-center md:text-left">
            {getTranslation(language, 'footer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
