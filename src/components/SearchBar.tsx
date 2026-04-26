import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
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
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          // Fetch latest articles and filter locally since basic Firestore lacks full-text search
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

        // Mock data search
        const mockData = fetchArticles(1, 100, 'all', undefined);
        const mockMatch = mockData.filter(a => {
            const titleQuery = a.title[language] || a.title['en'] || '';
            const summaryQuery = a.summary[language] || a.summary['en'] || '';
            return titleQuery.toLowerCase().includes(normalizedQuery) || 
                   summaryQuery.toLowerCase().includes(normalizedQuery);
        });

        const combined = [...liveMatch, ...mockMatch].slice(0, 8); // Top 8 results
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
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [queryText, language, isOffline]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={queryText}
          onChange={(e) => {
            setQueryText(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (queryText) setIsOpen(true);
          }}
          placeholder="Search news..."
          className="w-full sm:w-48 md:w-64 pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-500"
        />
      </div>

      {isOpen && queryText.trim() && (
        <div className="absolute top-full mt-2 -right-4 sm:right-0 sm:left-auto w-[95vw] sm:w-[400px] md:w-[450px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Results</span>
            {isSearching && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((article) => {
                  const title = article.title[language] || article.title['en'];
                  return (
                    <button
                      key={article.id}
                      onClick={() => {
                        onSelectArticle(article);
                        setIsOpen(false);
                        setQueryText('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-start gap-3 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <img 
                        src={article.imageUrl || "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} 
                        alt={title} 
                        className="w-14 h-14 rounded object-cover flex-shrink-0" 
                        onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80")}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{title}</h4>
                        <span className="text-[10px] text-blue-600 font-bold uppercase mt-1 block">{article.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : !isSearching ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No articles found for "{queryText}"
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
