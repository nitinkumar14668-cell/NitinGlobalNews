import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ArrowLeft, Globe, Bell, Save } from 'lucide-react';
import { getTranslation } from '../lib/translations';

export function UserSettings({ onBack }: { onBack: () => void }) {
  const { language, setLanguage } = useAppContext();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    newsletter: true
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, save to backend here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 max-w-3xl mx-auto mt-8 animate-in fade-in duration-300">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        </div>
        {saved && <span className="text-sm font-medium text-green-600 flex items-center gap-1"><Save className="w-4 h-4"/> Saved</span>}
      </div>

      <div className="p-6 space-y-8">
        {/* Language Preferences */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-5 h-5 text-blue-600" />
            Language Preferences
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600 mb-1">Select Interface Language</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'fr', label: 'Français' },
                { code: 'es', label: 'Español' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage?.(lang.code)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    language === lang.code 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600' 
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">Changes apply immediately to article titles, categories, and system text.</p>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Bell className="w-5 h-5 text-blue-600" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Push Notifications</h4>
                <p className="text-xs text-slate-500 mt-1">Get alerts for breaking news in your browser.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Email Digest</h4>
                <p className="text-xs text-slate-500 mt-1">Receive a daily summary of top stories.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Weekly Newsletter</h4>
                <p className="text-xs text-slate-500 mt-1">Our editor's picks delivered to your inbox every Sunday.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.newsletter}
                  onChange={(e) => setNotifications({...notifications, newsletter: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
