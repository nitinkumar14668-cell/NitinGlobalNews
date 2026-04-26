import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';

export function LocationPrompt() {
  const { locationState, requestLocation, language } = useAppContext();

  if (locationState === 'granted') return null;

  return (
    <div className="bg-blue-50 border-b border-blue-100 p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-blue-500 h-6 w-6 shrink-0" />
          <p className="text-sm sm:text-base text-blue-900 font-medium leading-tight">
            Enable location to automatically set your timezone and language for the best local news experience.
          </p>
        </div>
        
        {locationState === 'prompt' && (
          <button 
            onClick={requestLocation}
            className="whitespace-nowrap rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors w-full sm:w-auto"
          >
            {getTranslation(language, 'allowLocation')}
          </button>
        )}
        
        {locationState === 'loading' && (
          <div className="flex items-center gap-2 text-blue-700 text-sm font-medium w-full sm:w-auto justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            {getTranslation(language, 'locationLoading')}
          </div>
        )}

        {locationState === 'denied' && (
          <div className="text-red-600 text-sm font-medium w-full sm:w-auto text-center">
            {getTranslation(language, 'locationDenied')}
          </div>
        )}
      </div>
    </div>
  );
}
