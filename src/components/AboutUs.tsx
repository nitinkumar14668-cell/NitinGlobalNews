import React from 'react';
import { getTranslation } from '../lib/translations';
import { useAppContext } from '../contexts/AppContext';

export function AboutUs() {
  const { language } = useAppContext();

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="news-serif text-4xl sm:text-5xl font-bold tracking-tight text-blue-900 mb-8 border-b-4 border-slate-100 pb-6 inline-block">
        About NitinGlobalNews
      </h1>
      <div className="prose prose-lg prose-slate mt-8 text-slate-700">
        <p className="lead text-xl">
          NitinGlobalNews is committed to delivering accurate, timely, and unbiased news to a global audience.
        </p>
        <p>
          Our mission is to empower individuals with the information they need to understand the world around them. We leverage cutting-edge technology, including advanced translation capabilities, to break down language barriers and make high-quality journalism accessible to everyone, everywhere.
        </p>
        <p>
          We believe in the power of localized news on a global scale. By providing personalized content based on your region and language preferences, we ensure that you stay informed about what matters most to you, while maintaining a broad perspective on international events.
        </p>
      </div>
    </main>
  );
}
