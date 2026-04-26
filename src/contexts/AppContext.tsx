import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, increment } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import axios from 'axios';

type AppContextType = {
  user: User | null;
  loadingAuth: boolean;
  locationState: 'prompt' | 'granted' | 'denied' | 'loading';
  countryCode: string;
  language: string;
  timezone: string;
  articleStats: Record<string, { viewCount: number }>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  requestLocation: () => void;
  recordView: (articleId: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [locationState, setLocationState] = useState<'prompt' | 'granted' | 'denied' | 'loading'>('prompt');
  const [countryCode, setCountryCode] = useState('US');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [articleStats, setArticleStats] = useState<Record<string, { viewCount: number }>>({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'articleStats'), (snapshot) => {
      const newStats: Record<string, { viewCount: number }> = {};
      snapshot.forEach(doc => {
        newStats[doc.id] = doc.data() as { viewCount: number };
      });
      setArticleStats(newStats);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'articleStats');
      } catch (e) {
        // catch the thrown error from handleFirestoreError during background sync
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error', error);
      if (error instanceof Error) {
        alert(`Login failed: ${error.message} - Make sure your domain is added to Firebase Authentication Authorized Domains.`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const recordView = async (articleId: string) => {
    try {
      const docRef = doc(db, 'articleStats', articleId);
      await setDoc(docRef, { viewCount: increment(1) }, { merge: true });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'articleStats');
      } catch (e) {
        // ignore errors so the UI doesn't crash on view record failure
      }
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
    <AppContext.Provider value={{ user, loadingAuth, locationState, countryCode, language, timezone, articleStats, login, logout, requestLocation, recordView }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
