import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';

export function LocationPrompt() {
  const { locationState, requestLocation, language } = useAppContext();

  if (locationState === 'granted') return null;

  return (
    <div className="ticker-gradient text-white py-1.5 px-6 flex items-center gap-4 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <MapPin className="text-white h-4 w-4 shrink-0" />
          <p className="text-[11px] font-bold uppercase tracking-wider leading-tight">
            Enable location to automatically set your timezone and language for the best local news experience.
          </p>
        </div>
        
        {locationState === 'prompt' && (
          <button 
            onClick={requestLocation}
            className="whitespace-nowrap rounded bg-white/20 px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-white/30 transition-colors w-full sm:w-auto"
          >
            {getTranslation(language, 'allowLocation')}
          </button>
        )}
        
        {locationState === 'loading' && (
          <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase w-full sm:w-auto justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            {getTranslation(language, 'locationLoading')}
          </div>
        )}

        {locationState === 'denied' && (
          <div className="text-red-300 text-[10px] font-bold uppercase w-full sm:w-auto text-center">
            {getTranslation(language, 'locationDenied')}
          </div>
        )}
      </div>
    </div>
  );
}
