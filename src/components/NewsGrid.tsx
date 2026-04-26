import React from 'react';
import { mockArticles } from '../data/news';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';

export function NewsGrid() {
  const { language } = useAppContext();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-end justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          {getTranslation(language, 'latestNews')}
        </h1>
        <div className="hidden sm:flex gap-4 text-sm font-semibold text-gray-500">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-1">{getTranslation(language, 'world')}</button>
          <button className="hover:text-gray-900 pb-1">{getTranslation(language, 'trending')}</button>
          <button className="hover:text-gray-900 pb-1">{getTranslation(language, 'tech')}</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockArticles.map((article, index) => {
          const title = article.title[language] || article.title['en'];
          const summary = article.summary[language] || article.summary['en'];
          const isFeatured = index === 0;

          return (
            <article 
              key={article.id} 
              className={`group relative flex flex-col items-start justify-between rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 ${
                isFeatured ? 'md:col-span-2 lg:col-span-2 row-span-2' : ''
              }`}
            >
              <div className="relative w-full">
                <img
                  src={article.imageUrl}
                  alt={title}
                  className={`aspect-video w-full rounded-t-2xl object-cover sm:aspect-[2/1] lg:aspect-[3/2] ${isFeatured ? 'lg:aspect-video' : ''}`}
                />
                <div className="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              
              <div className="flex flex-1 flex-col justify-between p-6 w-full">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={article.timestamp} className="text-gray-500 font-mono">
                    {new Date(article.timestamp).toLocaleDateString(language, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                  <a
                    href={`#${article.category}`}
                    className="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600 hover:bg-blue-100 transition-colors uppercase tracking-wider text-[10px]"
                  >
                    {getTranslation(language, article.category) || article.category}
                  </a>
                </div>
                <div className="group relative mt-4">
                  <h3 className={`font-semibold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3 ${isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                    <a href="#">
                      <span className="absolute inset-0" />
                      {title}
                    </a>
                  </h3>
                  <p className={`mt-3 leading-relaxed text-gray-600 line-clamp-3 ${isFeatured ? 'text-base sm:text-lg' : 'text-sm'}`}>
                    {summary}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {getTranslation(language, 'readMore')} &rarr;
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
