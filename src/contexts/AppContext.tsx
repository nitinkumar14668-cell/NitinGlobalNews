import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import axios from 'axios';

type AppContextType = {
  user: User | null;
  loadingAuth: boolean;
  locationState: 'prompt' | 'granted' | 'denied' | 'loading';
  countryCode: string;
  language: string;
  timezone: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  requestLocation: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [locationState, setLocationState] = useState<'prompt' | 'granted' | 'denied' | 'loading'>('prompt');
  const [countryCode, setCountryCode] = useState('US');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const getLanguageFromCountry = (country: string) => {
    const map: Record<string, string> = {
      'IN': 'hi',
      'US': 'en',
      'GB': 'en',
      'FR': 'fr',
      'DE': 'de',
      'ES': 'es',
      'JP': 'ja',
      'CN': 'zh',
      'RU': 'ru'
    };
    return map[country] || 'en';
  };

  const requestLocation = () => {
    setLocationState('loading');
    if (!navigator.geolocation) {
      setLocationState('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const country = res.data.countryCode || 'US';
          setCountryCode(country);
          setLanguage(getLanguageFromCountry(country));
          setLocationState('granted');
        } catch (error) {
          console.error("Geocoding error", error);
          setLocationState('denied');
        }
      },
      (error) => {
        console.error("Location error", error);
        setLocationState('denied');
      }
    );
  };

  return (
    <AppContext.Provider value={{ user, loadingAuth, locationState, countryCode, language, timezone, login, logout, requestLocation }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
