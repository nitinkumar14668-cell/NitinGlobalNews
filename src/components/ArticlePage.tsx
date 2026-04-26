import React, { useEffect, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  Share2,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize,
  Bookmark,
  BookmarkCheck,
  Eye,
  Loader2,
  Twitter,
  Facebook,
  Linkedin,
  Languages,
  MessageSquare,
  ArrowLeft
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Article } from "../data/news";
import { useAppContext } from "../contexts/AppContext";
import { getTranslation } from "../lib/translations";
import { handleFirestoreError, OperationType } from "../lib/firestoreError";
import { Comments } from "./Comments";
import { SEO } from "./SEO";

import ReactPlayer from "react-player";

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
}

export function ArticlePage({ article, onBack }: ArticlePageProps) {
  const { user, language, recordView, articleStats, autoTranslate, recordCategoryRead } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const hasRecordedViewRef = useRef(false);

  useEffect(() => {
    if (article && !hasRecordedViewRef.current) {
      recordView(article.id);
      recordCategoryRead(article.category);
      hasRecordedViewRef.current = true;
    }
  }, [article, recordView, recordCategoryRead]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkBookmark = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "bookmarks", `${user.uid}_${article.id}`);
        const docSnap = await getDoc(docRef);
        setIsBookmarked(docSnap.exists());
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "bookmarks");
      }
    };
    checkBookmark();
  }, [article, user]);

  const initialTitle = article.title[language] || article.title["en"];
  const initialContent =
    article.content?.[language] ||
    article.content?.["en"] ||
    article.summary[language] ||
    article.summary["en"];
  const categoryStr =
    getTranslation(language, article.category) || article.category;

  const [currentImageUrl, setCurrentImageUrl] = useState(article.imageUrl);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState<string>(initialTitle);
  const [translatedContent, setTranslatedContent] = useState<string>(initialContent);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setCurrentImageUrl(article.imageUrl);
  }, [article]);

  const handleManualTranslate = async () => {
      setIsTranslating(true);
      try {
        const { translateText } = await import("../lib/gemini");
        const newTitle = await translateText(article.title["en"], language);
        const newContent = await translateText(article.content?.["en"] || article.summary["en"], language);
        setTranslatedTitle(newTitle);
        setTranslatedContent(newContent);
      } catch (error) {
        console.error("Translation failed", error);
        setTranslatedTitle(initialTitle);
        setTranslatedContent(initialContent);
      } finally {
        setIsTranslating(false);
      }
  };

  useEffect(() => {
    const translateArticle = async () => {
      if (article.title[language] && (article.content?.[language] || article.summary[language])) {
        setTranslatedTitle(article.title[language]);
        setTranslatedContent(article.content?.[language] || article.summary[language]);
        return;
      }
      
      if (!autoTranslate || language === 'en') {
        setTranslatedTitle(initialTitle);
        setTranslatedContent(initialContent);
        return;
      }
      
      handleManualTranslate();
    };
    translateArticle();
  }, [article, language, initialTitle, initialContent, autoTranslate]);

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const { generateArticleImage } = await import("../lib/gemini");
      const newImage = await generateArticleImage(translatedTitle + ". " + translatedContent);
      setCurrentImageUrl(newImage);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) return alert("Please sign in to bookmark articles.");

    setBookmarkLoading(true);
    const docRef = doc(db, "bookmarks", `${user.uid}_${article.id}`);

    try {
      if (isBookmarked) {
        await deleteDoc(docRef);
        setIsBookmarked(false);
        recordStat(article.id, 'bookmarkCount', -1);
      } else {
        await setDoc(docRef, {
          userId: user.uid,
          articleId: article.id,
          createdAt: serverTimestamp(),
        });
        setIsBookmarked(true);
        recordStat(article.id, 'bookmarkCount', 1);
      }
    } catch (error) {
      handleFirestoreError(
        error,
        isBookmarked ? OperationType.DELETE : OperationType.CREATE,
        "bookmarks",
      );
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = async () => {
    const urlStr = article.sourceUrl || window.location.href;
    const shareData = {
      title: translatedTitle,
      text: translatedContent.substring(0, 100) + "...",
      url: urlStr,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(urlStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const articleKeywords = translatedTitle
    .split(' ')
    .filter(word => word.length > 3)
    .map(word => word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
    .filter(Boolean);

  return (
    <article className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <SEO
        title={`${translatedTitle} - NitinGlobalNews | Breaking News`}
        description={translatedContent.substring(0, 160) + "..."}
        keywords={[
          ...articleKeywords,
          categoryStr.toLowerCase(),
          "breaking news 2026",
          "exclusive coverage",
          "in-depth analysis",
          "latest updates today",
          `${categoryStr.toLowerCase()} trends`,
          "viral news"
        ]}
        image={article.imageUrl}
        type="article"
      />
      
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium text-sm text-slate-700">Back to News</span>
      </button>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden group">
          {article.videoUrl ? (
            <div className="w-full h-full bg-black flex items-center justify-center relative">
              <ReactPlayer
                url={article.videoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={false}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
            </div>
          ) : (
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperClass="!w-full !h-full"
                    contentClass="!w-full !h-full"
                  >
                    {isGeneratingImage ? (
                      <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center text-white p-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-sm font-medium">Generating AI Image...</p>
                        <p className="text-xs text-slate-400 mt-2 text-center">Creating an image using Gemini 2.5 Flash</p>
                      </div>
                    ) : (
                      <img
                        src={currentImageUrl}
                        alt={translatedTitle}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </TransformComponent>

                  {!isGeneratingImage && (
                    <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleGenerateImage}
                        className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-full backdrop-blur-sm text-xs font-bold mb-2 shadow-lg"
                        title="Generate Image with AI"
                      >
                        ✨ AI Image
                      </button>
                      <button onClick={() => zoomIn()} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm" aria-label="Zoom In">
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button onClick={() => zoomOut()} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm" aria-label="Zoom Out">
                        <ZoomOut className="w-5 h-5" />
                      </button>
                      <button onClick={() => resetTransform()} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm" aria-label="Reset Zoom">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </TransformWrapper>
          )}

          {!article.videoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          )}

          {!article.videoUrl && (
            <div className="absolute bottom-0 p-4 sm:p-6 w-full text-white pointer-events-none z-10">
              <span className="mb-3 inline-block rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                {categoryStr}
              </span>
              <h1 className="news-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight flex items-center gap-2">
                {translatedTitle}
                {isTranslating && <Loader2 className="w-5 h-5 animate-spin" />}
              </h1>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-8">
          {article.videoUrl && (
            <div className="mb-6">
              <span className="mb-3 inline-block rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                {categoryStr}
              </span>
              <h1 className="news-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-slate-900 flex items-center gap-2">
                {translatedTitle}
                {isTranslating && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
              </h1>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 border-b border-slate-100 pb-4">
            <time dateTime={article.timestamp}>
              {new Date(article.timestamp).toLocaleDateString(language, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
            <span>NitinGlobalNews</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{articleStats[article.id]?.viewCount || 0}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <div className="flex items-center gap-1">
              <Bookmark className="w-4 h-4" />
              <span>{articleStats[article.id]?.bookmarkCount || 0}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{articleStats[article.id]?.commentCount || 0}</span>
            </div>
            {!autoTranslate && language !== 'en' && translatedTitle === initialTitle && !article.title[language] && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <button 
                    onClick={handleManualTranslate}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    disabled={isTranslating}
                  >
                    <Languages className="w-4 h-4" />
                    {isTranslating ? 'Translating...' : 'Translate'}
                  </button>
                </>
            )}
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
            {isTranslating ? (
              <div className="space-y-6 animate-pulse mt-4">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-[95%]"></div>
                  <div className="h-4 bg-slate-200 rounded w-[90%]"></div>
                  <div className="h-4 bg-slate-200 rounded w-[98%]"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-[96%]"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-[85%]"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-[92%]"></div>
                  <div className="h-4 bg-slate-200 rounded w-[97%]"></div>
                  <div className="h-4 bg-slate-200 rounded w-[70%]"></div>
                </div>
              </div>
            ) : (
              translatedContent
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-slate-100 pt-8">
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors flex-1 sm:flex-none"
              >
                {getTranslation(language, "readMore")}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center justify-center gap-2 rounded border px-6 py-3 text-sm font-bold shadow-sm transition-colors flex-1 sm:flex-none ${isBookmarked ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}`}
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
            <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 sm:flex-none">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    Copied!
                    <Check className="h-4 w-4 text-green-600" />
                  </>
                ) : (
                  <>
                    Copy Link
                    <Share2 className="h-4 w-4" />
                  </>
                )}
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(article.sourceUrl || window.location.href)}&text=${encodeURIComponent(translatedTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:text-blue-400 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.sourceUrl || window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(article.sourceUrl || window.location.href)}&title=${encodeURIComponent(translatedTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 flex items-center justify-center rounded border border-slate-300 bg-white text-slate-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <Comments articleId={article.id} />
        </div>
      </div>
    </article>
  );
}
