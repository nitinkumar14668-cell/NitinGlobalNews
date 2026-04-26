import React, { useState } from 'react';
import { Article, mockArticles } from '../data/news';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { ArticleModal } from './ArticleModal';
import { Eye } from 'lucide-react';

export function NewsGrid() {
  const { language, articleStats } = useAppContext();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const filteredArticles = selectedCategory === 'all' 
    ? mockArticles 
    : mockArticles.filter(a => a.category === selectedCategory);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(20);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col mb-6 border-b border-slate-200 pb-3">
        <div className="flex items-end justify-between">
          <h1 className="news-serif text-3xl font-bold tracking-tight text-blue-900 flex items-center gap-2">
            {getTranslation(language, 'latestNews')}
          </h1>
          <div className="hidden sm:flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
            <button 
              onClick={() => handleCategoryChange('all')}
              className={`${selectedCategory === 'all' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'} pb-1 transition-colors`}
            >
              All
            </button>
            <button 
              onClick={() => handleCategoryChange('world')}
              className={`${selectedCategory === 'world' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'} pb-1 transition-colors`}
            >
              {getTranslation(language, 'world')}
            </button>
            <button 
              onClick={() => handleCategoryChange('trending')}
              className={`${selectedCategory === 'trending' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'} pb-1 transition-colors`}
            >
              {getTranslation(language, 'trending')}
            </button>
            <button 
              onClick={() => handleCategoryChange('tech')}
              className={`${selectedCategory === 'tech' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'} pb-1 transition-colors`}
            >
              {getTranslation(language, 'tech')}
            </button>
          </div>
        </div>
        <div className="text-slate-500 text-sm mt-1 mb-2 font-medium">
          Browsing from over <span className="font-bold text-blue-800">100,000+</span> Real-time Articles
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {visibleArticles.map((article, index) => {
          const title = article.title[language] || article.title['en'];
          const summary = article.summary[language] || article.summary['en'];
          const isFeatured = index === 0;

          return (
            <article 
              key={article.id} 
              onClick={() => setSelectedArticle(article)}
              className={`group relative flex flex-col justify-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                isFeatured ? 'col-span-1 md:col-span-12 lg:col-span-7 flex flex-col' : 'col-span-1 md:col-span-6 lg:col-span-5 flex-row gap-4'
              }`}
            >
              {isFeatured ? (
                <div className="relative w-full aspect-video bg-slate-300 rounded-xl overflow-hidden mb-4">
                  <img
                    src={article.imageUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 p-6 w-full">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-2 inline-block">
                      {getTranslation(language, article.category) || article.category}
                    </span>
                    <h2 className="news-serif text-3xl text-white font-bold leading-tight line-clamp-2">
                       {title}
                    </h2>
                    <p className="text-slate-300 text-sm mt-2 line-clamp-2">
                      {summary}
                    </p>
                    <div className="flex items-center gap-1 text-slate-300 mt-3 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{articleStats[article.id]?.viewCount || 0} views</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                     <img
                        src={article.imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <div className="flex flex-col flex-1 pl-4 md:pl-0">
                    <span className="text-[10px] font-bold text-red-600 uppercase">
                      {getTranslation(language, article.category) || article.category}
                    </span>
                    <h3 className="font-bold text-sm leading-snug mt-1 hover:text-blue-800 cursor-pointer line-clamp-2">
                       {title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {summary}
                    </p>
                    <div className="flex items-center gap-1 text-slate-400 mt-2 text-[10px]">
                      <Eye className="w-3 h-3" />
                      <span>{articleStats[article.id]?.viewCount || 0} views</span>
                    </div>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
      
      {visibleCount < filteredArticles.length && (
        <div className="mt-10 flex justify-center w-full">
          <button 
            onClick={handleLoadMore}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full border border-slate-300 transition-colors shadow-sm"
          >
            Load More Articles
          </button>
        </div>
      )}

      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </main>
  );
}
