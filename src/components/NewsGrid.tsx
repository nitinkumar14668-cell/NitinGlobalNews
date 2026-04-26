import React, { useState, useEffect } from 'react';
import { Article, fetchArticles } from '../data/news';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { ArticleModal } from './ArticleModal';
import { Eye, PlayCircle, MapPin, Loader2, Bookmark, MessageSquare } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SkeletonArticle = ({ isFeatured }: { isFeatured?: boolean }) => (
  <div className={`group cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-pulse ${isFeatured ? 'col-span-1 md:col-span-12 lg:col-span-8 flex-col' : 'col-span-1 md:col-span-6 lg:col-span-4 flex-col sm:flex-row lg:flex-col gap-4'}`}>
    {isFeatured ? (
      <div className="w-full aspect-video bg-slate-200 rounded-xl mb-4"></div>
    ) : (
      <>
        <div className="w-full sm:w-32 lg:w-full h-48 sm:h-32 lg:h-48 bg-slate-200 rounded flex-shrink-0"></div>
        <div className="flex flex-col flex-1 mt-4 sm:mt-0 lg:mt-4 space-y-3">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2 mt-auto"></div>
        </div>
      </>
    )}
  </div>
);

export function NewsGrid() {
  const { language, articleStats, countryCode, isOffline } = useAppContext();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [liveArticles, setLiveArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const ARTICLES_PER_PAGE = 20;

  const CACHE_KEY = `cachedArticles_${selectedCategory}_${countryCode}`;

  useEffect(() => {
    // Listen to live articles
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), firestoreLimit(50));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: Article[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          title: data.title,
          summary: data.summary,
          content: data.content || data.summary,
          imageUrl: data.imageUrl,
          sourceUrl: data.sourceUrl,
          videoUrl: data.videoUrl,
          category: data.category,
          timestamp: data.timestamp,
          location: data.location
        });
      });
      setLiveArticles(fetched);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Reset when category changes
    setPage(1);
    setIsLoading(true);
    
    if (isOffline) {
      // Use cached data
      setTimeout(() => {
        const cachedStr = localStorage.getItem(CACHE_KEY);
        if (cachedStr) {
          try {
            setArticles(JSON.parse(cachedStr));
          } catch (e) {
            setArticles([]);
          }
        } else {
          setArticles([]);
        }
        setIsLoading(false);
      }, 100);
      return;
    }

    // Fetch from massive db
    const loadNews = async () => {
      const data = await fetchArticles(1, ARTICLES_PER_PAGE, selectedCategory, countryCode);
      setArticles(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      setIsLoading(false);
    };
    loadNews();
  }, [selectedCategory, countryCode, isOffline]);

  const handleLoadMore = async () => {
    if (isOffline) return; // Prevent load more when offline
    
    const nextPage = page + 1;
    setIsLoading(true);
    const moreData = await fetchArticles(nextPage, ARTICLES_PER_PAGE, selectedCategory, countryCode);
    setArticles(prev => {
        // Prevent duplicates
        const existingIds = new Set(prev.map(a => a.id));
        const newUnique = moreData.filter(a => !existingIds.has(a.id));
        return [...prev, ...newUnique];
    });
    setPage(nextPage);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading || isOffline) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    const target = document.getElementById('infinite-scroll-trigger');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [isLoading, isOffline, page, selectedCategory, countryCode]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {isOffline && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                You are currently offline. Showing cached articles. Features like translating and video playback may be unavailable.
              </p>
            </div>
          </div>
        </div>
      )}
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
              onClick={() => handleCategoryChange('local')}
              className={`${selectedCategory === 'local' ? 'text-blue-900 border-b-2 border-blue-900' : 'hover:text-blue-900'} pb-1 transition-colors flex items-center gap-1`}
            >
              <MapPin className="w-3 h-3" />
              Local
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
          Browsing from over <span className="font-bold text-blue-800">100,000+</span> Real-time Channel & Video Articles
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {isLoading && page === 1 ? (
          <>
            <SkeletonArticle isFeatured={true} />
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonArticle key={i} />
            ))}
          </>
        ) : (
          [...liveArticles.filter(a => selectedCategory === 'all' || a.category === selectedCategory || (selectedCategory === 'local' && a.location)), ...articles].map((article, index) => {
            const title = article.title[language] || article.title['en'];
            const summary = article.summary[language] || article.summary['en'];
            const isFeatured = index === 0;

            return (
              <article 
                key={article.id} 
                onClick={() => setSelectedArticle(article)}
                className={`group relative flex justify-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                  isFeatured ? 'col-span-1 md:col-span-12 lg:col-span-8 flex-col' : 'col-span-1 md:col-span-6 lg:col-span-4 flex-col sm:flex-row lg:flex-col gap-4'
                }`}
              >
              {isFeatured ? (
                <div className="relative w-full aspect-video bg-slate-300 rounded-xl overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                  <img
                    src={article.imageUrl}
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // fallback generic news image
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {article.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                      <PlayCircle className="w-16 h-16 text-white opacity-80 shadow-2xl drop-shadow-lg" />
                    </div>
                  )}
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
                    <div className="flex items-center gap-3 text-slate-300 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{articleStats[article.id]?.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        <span>{articleStats[article.id]?.bookmarkCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{articleStats[article.id]?.commentCount || 0}</span>
                      </div>
                      {article.videoUrl && <span className="ml-2 font-bold flex items-center gap-1"><PlayCircle className="w-3 h-3"/> Video</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative w-full sm:w-32 lg:w-full h-48 sm:h-32 lg:h-48 bg-slate-200 rounded flex-shrink-0 overflow-hidden">
                     <img
                        src={article.imageUrl}
                        alt={title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {article.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                          <PlayCircle className="w-10 h-10 text-white opacity-90 drop-shadow-md" />
                        </div>
                      )}
                  </div>
                  <div className="flex flex-col flex-1 pl-0 sm:pl-4 lg:pl-0 mt-4 sm:mt-0 lg:mt-4">
                    <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                      {getTranslation(language, article.category) || article.category}
                      {article.videoUrl && <PlayCircle className="w-3 h-3 text-red-600" />}
                    </span>
                    <h3 className="font-bold text-base sm:text-sm lg:text-lg leading-snug mt-1 hover:text-blue-800 cursor-pointer line-clamp-2">
                       {title}
                    </h3>
                    <p className="text-sm sm:text-xs lg:text-sm text-slate-500 mt-2 line-clamp-2">
                      {summary}
                    </p>
                    <div className="flex items-center gap-3 text-slate-400 mt-2 text-[10px]">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{articleStats[article.id]?.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        <span>{articleStats[article.id]?.bookmarkCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{articleStats[article.id]?.commentCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </article>
          );
        })
        )}
      </div>
      
      {/* Loading State & Load More */}
      <div className="mt-6 flex flex-col items-center justify-center w-full min-h-[100px]">
        {isLoading && page > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-8">
             {Array.from({ length: 3 }).map((_, i) => <SkeletonArticle key={`load-more-${i}`} />)}
          </div>
        )}
        
        {!isLoading && !isOffline && (
          <div id="infinite-scroll-trigger" className="h-10 w-full" />
        )}
      </div>

      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </main>
  );
}
