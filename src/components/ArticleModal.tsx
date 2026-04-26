import React, { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Article } from '../data/news';
import { useAppContext } from '../contexts/AppContext';
import { getTranslation } from '../lib/translations';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  const { language } = useAppContext();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [article, onClose]);

  if (!article) return null;

  const title = article.title[language] || article.title['en'];
  const content = article.content?.[language] || article.content?.['en'] || article.summary[language] || article.summary['en'];
  const categoryStr = getTranslation(language, article.category) || article.category;

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
          <div className="relative aspect-video w-full sm:aspect-[21/9]">
            <img
              src={article.imageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-6 w-full text-white">
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

            {article.sourceUrl && (
              <div className="mt-10 flex justify-center border-t border-slate-100 pt-8">
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                  {getTranslation(language, 'readMore')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
