import React from 'react';
import { Globe, LogIn, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { Clock } from './Clock';

export function Header() {
  const { user, login, logout, language } = useAppContext();

  return (
    <header className="sticky top-0 z-50 bg-white border-b px-6 py-3 flex items-center justify-between google-shadow">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-slate-500 hover:text-blue-900 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <a href="#" className="flex items-center gap-2 text-2xl font-extrabold tracking-tighter text-blue-900 italic">
            <Globe className="h-6 w-6 text-blue-600 hidden sm:block" />
            <span className="hidden sm:inline-block">NITIN<span className="text-red-600">GLOBAL</span>NEWS</span>
            <span className="sm:hidden text-blue-900">N<span className="text-red-600">G</span>N</span>
          </a>
        </div>

        <Clock />

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-[10px] leading-tight text-slate-500">
            <span className="font-bold text-blue-800 uppercase">Language: {language}</span>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full border border-slate-200" />
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-1.5 rounded text-sm font-semibold text-slate-700 google-shadow hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block">{getTranslation(language, 'logout')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-1.5 rounded text-sm font-semibold text-slate-700 google-shadow hover:bg-slate-50 transition-colors"
            >
              <LogIn className="h-4 w-4 text-blue-500" />
              <span className="hidden sm:inline-block">{getTranslation(language, 'login')}</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
