import React from 'react';
import { Globe, LogIn, LogOut, Menu } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { Clock } from './Clock';

export function Header() {
  const { user, login, logout, language } = useAppContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight text-brand-900">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="hidden sm:inline-block">NitinGlobalNews</span>
            <span className="sm:hidden text-blue-600">NGN</span>
          </a>
        </div>

        <Clock />

        <div className="flex items-center gap-4">
          <div className="hidden md:flex text-sm text-gray-600 uppercase font-semibold">
            {language}
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full border border-gray-200" />
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block">{getTranslation(language, 'logout')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline-block">{getTranslation(language, 'login')}</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
