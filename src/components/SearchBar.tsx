import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { Article, fetchArticles } from '../data/news';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { useAppContext } from '../contexts/AppContext';

export function SearchBar({ onSelectArticle }: { onSelectArticle: (article: Article) => void }) {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { language, isOffline } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const searchArticles = async () => {
      if (!queryText.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const normalizedQuery = queryText.toLowerCase();

      try {
        let liveMatch: Article[] = [];
        if (!isOffline) {
           const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          const fetched: Article[] = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            fetched.push({
              id: doc.id,
              title: data.title || {},
              summary: data.summary || {},
              content: data.content || data.summary || {},
              imageUrl: data.imageUrl,
              sourceUrl: data.sourceUrl,
              videoUrl: data.videoUrl,
              category: data.category,
              timestamp: data.timestamp,
              location: data.location
            });
          });
          
          liveMatch = fetched.filter(a => {
            const titleQuery = a.title[language] || a.title['en'] || '';
            const summaryQuery = a.summary[language] || a.summary['en'] || '';
            const contentQuery = a.content?.[language] || a.content?.['en'] || '';
            return titleQuery.toLowerCase().includes(normalizedQuery) || 
                   summaryQuery.toLowerCase().includes(normalizedQuery) ||
                   contentQuery.toLowerCase().includes(normalizedQuery);
          });
        }

        const mockData = await fetchArticles(1, 100, 'all', undefined);
        const mockMatch = mockData.filter(a => {
            const titleQuery = a.title[language] || a.title['en'] || '';
            const summaryQuery = a.summary[language] || a.summary['en'] || '';
            return titleQuery.toLowerCase().includes(normalizedQuery) || 
                   summaryQuery.toLowerCase().includes(normalizedQuery);
        });

        const combined = [...liveMatch, ...mockMatch].slice(0, 15);
        setResults(combined);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const handler = setTimeout(() => {
        searchArticles();
    }, 400);

    return () => clearTimeout(handler);
  }, [queryText, language, isOffline]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-600 group"
        aria-label="Search articles"
      >
        <Search className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-50/95 backdrop-blur-md flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col h-full flex-1">
            <div className="relative flex items-center mb-8">
              <Search className="absolute left-4 w-6 h-6 text-blue-500" />
              <input
                ref={inputRef}
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search for articles, topics, or keywords..."
                className="w-full pl-14 pr-12 py-4 bg-white border-2 border-blue-100 rounded-2xl text-xl sm:text-2xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
              />
              <button 
                onClick={() => { setIsOpen(false); setQueryText(''); }}
                className="absolute right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {queryText.trim() && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Search Results</span>
                    {isSearching && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                  </div>
                  
                  <div className="flex flex-col">
                    {results.length > 0 ? (
                      <div>
                        {results.map((article) => {
                          const title = article.title[language] || article.title['en'];
                          const summary = article.summary[language] || article.summary['en'];
                          return (
                            <button
                              key={article.id}
                              onClick={() => {
                                onSelectArticle(article);
                                setIsOpen(false);
                                setQueryText('');
                              }}
                              className="w-full text-left p-4 sm:p-6 hover:bg-slate-50 flex flex-col sm:flex-row items-start gap-4 transition-colors border-b border-slate-100 last:border-0 group"
                            >
                              <img 
                                src={article.imageUrl || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
                                alt={title} 
                                className="w-full sm:w-24 h-48 sm:h-24 rounded-xl object-cover flex-shrink-0 group-hover:shadow-md transition-shadow" 
                                onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80")}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-blue-600 font-extrabold uppercase tracking-wider mb-1 block">{article.category}</span>
                                <h4 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors">{title}</h4>
                                <p className="text-sm text-slate-600 line-clamp-2">{summary}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : !isSearching ? (
                      <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <Search className="w-12 h-12 text-slate-200 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No articles found</h3>
                        <p>We couldn't find anything matching "{queryText}". Try adjusting your keywords.</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {!queryText.trim() && (
                 <div className="h-full flex flex-col items-center justify-center pb-20 text-slate-400 opacity-60">
                   <Search className="w-20 h-20 mb-6 text-slate-200" />
                   <h2 className="text-2xl font-semibold">Start typing to search...</h2>
                   <p className="mt-2 text-center max-w-md">Find breaking news, topics, and personalized stories from around the world.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
