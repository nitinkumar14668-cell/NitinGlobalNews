/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Header';
import { LocationPrompt } from './components/LocationPrompt';
import { NewsGrid } from './components/NewsGrid';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 flex flex-col">
        <Header />
        <LocationPrompt />
        <div className="flex-1">
          <NewsGrid />
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}

