/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Header';
import { LocationPrompt } from './components/LocationPrompt';
import { NewsGrid } from './components/NewsGrid';
import { Footer } from './components/Footer';
import { AboutUs } from './components/AboutUs';
import { UserProfile } from './components/UserProfile';
import { SEO } from './components/SEO';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'profile'>('home');

  return (
    <AppProvider>
      <SEO />
      <div className="min-h-screen border-t-4 border-blue-900 bg-slate-50 font-sans text-gray-900 flex flex-col">
        <Header 
          onLogoClick={() => setCurrentPage('home')} 
          onProfileClick={() => setCurrentPage('profile')} 
        />
        <LocationPrompt />
        <div className="flex-1">
          {currentPage === 'home' && <NewsGrid />}
          {currentPage === 'about' && <AboutUs />}
          {currentPage === 'profile' && <UserProfile />}
        </div>
        <Footer onAboutClick={() => setCurrentPage('about')} />
      </div>
    </AppProvider>
  );
}

