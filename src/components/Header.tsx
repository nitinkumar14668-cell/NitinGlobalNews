import React from 'react';
import { Globe, LogIn, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { Clock } from './Clock';
import { SearchBar } from './SearchBar';
import { Article } from '../data/news';

export function Header({ onLogoClick, onProfileClick, onArticleSelect }: { onLogoClick: () => void, onProfileClick: () => void, onArticleSelect: (article: Article) => void }) {
  const { user, login, logout, language } = useAppContext();

  return (
    <header className="sticky top-0 z-40 bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between google-shadow">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-blue-900 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold tracking-tighter text-blue-900 italic">
            <Globe className="h-6 w-6 text-blue-600 hidden sm:block" />
            <span className="hidden sm:inline-block">NITIN<span className="text-red-600">GLOBAL</span>NEWS</span>
            <span className="sm:hidden text-blue-900">N<span className="text-red-600">G</span>N</span>
          </a>
        </div>

        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <Clock />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <SearchBar onSelectArticle={onArticleSelect} />
          
          <div className="hidden lg:flex flex-col items-end text-[10px] leading-tight text-slate-500">
            <span className="font-bold text-blue-800 uppercase">Lang: {language}</span>
          </div>
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={onProfileClick} className="flex flex-col sm:flex-row items-center gap-2 hover:opacity-80 transition-opacity" title="View Profile">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0D8ABC&color=fff`} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full border border-slate-200" />
              </button>
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded text-sm font-semibold text-slate-700 google-shadow hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{getTranslation(language, 'logout')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded text-sm font-semibold text-slate-700 google-shadow hover:bg-slate-50 transition-colors"
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
