import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppContext } from '../contexts/AppContext';
import { Article, mockArticles } from '../data/news';
import { getTranslation } from '../lib/translations';
import { ArticleModal } from './ArticleModal';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { BookmarkMinus, Loader2, Eye } from 'lucide-react';

interface BookmarkData {
  id: string;
  articleId: string;
  createdAt: Timestamp;
}

export function UserProfile() {
  const { user, language, articleStats } = useAppContext();
  const [bookmarks, setBookmarks] = useState<(Article & { bookmarkId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'bookmarks'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        
        const bookmarkedArticles = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<BookmarkData, 'id'>;
          const article = mockArticles.find(a => a.id === data.articleId);
          if (article) {
            return {
              ...article,
              bookmarkId: doc.id
            };
          }
          return null;
        }).filter((a): a is (Article & { bookmarkId: string }) => a !== null);
        
        setBookmarks(bookmarkedArticles);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const removeBookmark = async (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'bookmarks', bookmarkId));
      setBookmarks(prev => prev.filter(b => b.bookmarkId !== bookmarkId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'bookmarks');
    }
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <h1 className="news-serif text-3xl font-bold text-slate-800">Please sign in to view your profile.</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <img 
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0D8ABC&color=fff`} 
          alt={user.displayName || 'User'} 
          className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
        />
        <div className="flex-1 mt-2">
          <h1 className="news-serif text-4xl font-bold text-slate-900">{user.displayName}</h1>
          <p className="text-slate-500 mt-2 text-lg">{user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="news-serif text-2xl font-bold text-slate-800 border-b-2 border-slate-100 pb-4 mb-6">
          Saved Articles
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map(article => {
              const title = article.title[language] || article.title['en'];
              const summary = article.summary[language] || article.summary['en'];
              
              return (
                <article 
                  key={article.bookmarkId} 
                  onClick={() => setSelectedArticle(article)}
                  className="group relative flex flex-col bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer h-full"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                    <img
                      src={article.imageUrl}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <button 
                        onClick={(e) => removeBookmark(article.bookmarkId, e)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                        aria-label="Remove bookmark"
                        title="Remove bookmark"
                      >
                        <BookmarkMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="news-serif text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                    {summary}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span className="text-blue-600">{getTranslation(language, article.category) || article.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{articleStats[article.id]?.viewCount || 0} views</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No saved articles yet</h3>
            <p className="text-slate-500">Articles you save will appear here.</p>
          </div>
        )}
      </div>

      <ArticleModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />
    </main>
  );
}
