import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Share2, Check, ZoomIn, ZoomOut, Maximize, Bookmark, BookmarkCheck } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../data/news';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { Comments } from './Comments';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  const { user, language } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
      
      const checkBookmark = async () => {
        if (!user) return;
        try {
          const docRef = doc(db, 'bookmarks', `${user.uid}_${article.id}`);
          const docSnap = await getDoc(docRef);
          setIsBookmarked(docSnap.exists());
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'bookmarks');
        }
      };
      checkBookmark();
    }
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [article, onClose, user]);

  if (!article) return null;

  const title = article.title[language] || article.title['en'];
  const content = article.content?.[language] || article.content?.['en'] || article.summary[language] || article.summary['en'];
  const categoryStr = getTranslation(language, article.category) || article.category;

  const handleBookmark = async () => {
    if (!user) return alert("Please sign in to bookmark articles.");
    
    setBookmarkLoading(true);
    const docRef = doc(db, 'bookmarks', `${user.uid}_${article.id}`);
    
    try {
      if (isBookmarked) {
        await deleteDoc(docRef);
        setIsBookmarked(false);
      } else {
        await setDoc(docRef, {
          userId: user.uid,
          articleId: article.id,
          createdAt: serverTimestamp()
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      handleFirestoreError(error, isBookmarked ? OperationType.DELETE : OperationType.CREATE, 'bookmarks');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = async () => {
    const urlStr = article.sourceUrl || window.location.href;
    const shareData = {
      title: title,
      text: content.substring(0, 100) + '...',
      url: urlStr,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(urlStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        className="relative flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl google-shadow animate-in fade-in zoom-in-95 duration-200 border-t-4 border-blue-900"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="relative aspect-video w-full sm:aspect-[21/9] overflow-hidden group">
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                    <img
                      src={article.imageUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </TransformComponent>
                  
                  {/* Zoom Controls Overlay */}
                  <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => zoomIn()} 
                      className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm"
                      aria-label="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => zoomOut()} 
                      className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm"
                      aria-label="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => resetTransform()} 
                      className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm"
                      aria-label="Reset Zoom"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </TransformWrapper>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 p-6 w-full text-white pointer-events-none">
              <span className="mb-3 inline-block rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                {categoryStr}
              </span>
              <h2 className="news-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                {title}
              </h2>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-100 pb-4">
              <time dateTime={article.timestamp}>
                {new Date(article.timestamp).toLocaleDateString(language, { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>NitinGlobalNews</span>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
              {content}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-8">
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors flex-1 sm:flex-none"
                >
                  {getTranslation(language, 'readMore')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={handleBookmark}
                disabled={bookmarkLoading}
                className={`flex items-center justify-center gap-2 rounded border px-6 py-3 text-sm font-bold shadow-sm transition-colors flex-1 sm:flex-none ${isBookmarked ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                {isBookmarked ? (
                  <>
                    Saved
                    <BookmarkCheck className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Save
                    <Bookmark className="h-4 w-4" />
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex-1 sm:flex-none"
              >
                {copied ? (
                  <>
                    Copied!
                    <Check className="h-4 w-4 text-green-600" />
                  </>
                ) : (
                  <>
                    Share
                    <Share2 className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <Comments articleId={article.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
