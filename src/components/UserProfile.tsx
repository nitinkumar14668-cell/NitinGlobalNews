import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAppContext } from "../contexts/AppContext";
import { Article, mockArticles } from "../data/news";
import { getTranslation } from "../lib/translations";
import { ArticleModal } from "./ArticleModal";
import { handleFirestoreError, OperationType } from "../lib/firestoreError";
import { UserSettings } from './UserSettings';
import {
  BookmarkMinus,
  Loader2,
  Eye,
  Calendar,
  Bookmark,
  MessageSquare,
  ArrowLeft,
  Settings,
  Shield,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BookmarkData {
  id: string;
  articleId: string;
  createdAt: Timestamp;
}

interface UserComment {
  id: string;
  articleId: string;
  text: string;
  createdAt: Timestamp;
}

export function UserProfile({ onBack, onAdminClick }: { onBack: () => void, onAdminClick?: () => void }) {
  const { user, language, articleStats, logout, isAdmin } = useAppContext();
  const [bookmarks, setBookmarks] = useState<
    (Article & { bookmarkId: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [activeTab, setActiveTab] = useState<"bookmarks" | "comments">(
    "bookmarks",
  );
  const [comments, setComments] = useState<
    (UserComment & { articleTitle: string })[]
  >([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "bookmarks"),
          where("userId", "==", user.uid),
        );
        const snapshot = await getDocs(q);

        const bookmarkedArticles = snapshot.docs
          .map((doc) => {
            const data = doc.data() as Omit<BookmarkData, "id">;
            const article = mockArticles.find((a) => a.id === data.articleId);
            if (article) {
              return {
                ...article,
                bookmarkId: doc.id,
              };
            }
            return null;
          })
          .filter((a): a is Article & { bookmarkId: string } => a !== null);

        setBookmarks(bookmarkedArticles);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  useEffect(() => {
    if (!user || activeTab !== "comments") return;
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const q = query(
          collection(db, "comments"),
          where("userId", "==", user.uid),
        );
        const snapshot = await getDocs(q);
        const userComments = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            const article = mockArticles.find((a) => a.id === data.articleId);
            if (article) {
              return {
                id: doc.id,
                articleId: data.articleId,
                text: data.text,
                createdAt: data.createdAt,
                articleTitle: article.title[language] || article.title["en"],
              };
            }
            return null;
          })
          .filter(
            (c): c is UserComment & { articleTitle: string } => c !== null,
          )
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        setComments(userComments);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "comments");
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [user, activeTab, language]);

  const removeBookmark = async (bookmarkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "bookmarks", bookmarkId));
      setBookmarks((prev) => prev.filter((b) => b.bookmarkId !== bookmarkId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "bookmarks");
    }
  };

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <h1 className="news-serif text-3xl font-bold text-slate-800">
          Please sign in to view your profile.
        </h1>
      </main>
    );
  }

  const creationTime = user.metadata.creationTime
    ? new Date(user.metadata.creationTime)
    : new Date();

  if (showSettings) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <UserSettings onBack={() => setShowSettings(false)} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-700 to-indigo-800 relative w-full">
          {/* Decorative Pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>

        <div className="px-6 sm:px-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=0D8ABC&color=fff`
              }
              alt={user.displayName || "User"}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-md object-cover bg-white z-10"
            />
            <div className="flex gap-3 relative z-10 flex-wrap justify-end">
              {isAdmin && onAdminClick && (
                <button
                  onClick={onAdminClick}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-sm font-bold text-red-700 shadow-sm hover:bg-red-100 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>

          <div>
            <h1 className="news-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {user.displayName}
            </h1>
            <p className="text-slate-500 mt-1 sm:text-lg flex items-center gap-2">
              {user.email}
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="font-medium text-slate-700">
                  Joined{" "}
                  {creationTime.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-slate-700">
                  {bookmarks.length} Saved Articles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        <div className="flex border-b border-slate-100 px-6 pt-4 gap-8 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-colors relative ${activeTab === "bookmarks" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Articles
            {activeTab === "bookmarks" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-lg" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-colors relative ${activeTab === "comments" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <MessageSquare className="w-4 h-4" />
            My Comments
            {activeTab === "comments" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-lg" />
            )}
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === "bookmarks" && (
            <div>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarks.map((article) => {
                    const title =
                      article.title[language] || article.title["en"];
                    const summary =
                      article.summary[language] || article.summary["en"];

                    return (
                      <article
                        key={article.bookmarkId}
                        onClick={() => setSelectedArticle(article)}
                        className="group relative flex flex-col bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-300 cursor-pointer h-full"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                          <img
                            src={article.imageUrl}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={(e) =>
                                removeBookmark(article.bookmarkId, e)
                              }
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
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
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <span className="text-blue-600">
                              {getTranslation(language, article.category) ||
                                article.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                            <Eye className="w-3.5 h-3.5" />
                            <span>
                              {articleStats[article.id]?.viewCount || 0} views
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100 border-dashed flex flex-col items-center">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <Bookmark className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    No saved articles yet
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Tap the bookmark icon on any article to save it for later
                    reading.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              {loadingComments ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          Commented on:{" "}
                          <span
                            className="text-blue-600 font-semibold cursor-pointer hover:underline"
                            onClick={() =>
                              setSelectedArticle(
                                mockArticles.find(
                                  (a) => a.id === comment.articleId,
                                ) || null,
                              )
                            }
                          >
                            {comment.articleTitle}
                          </span>
                        </h4>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap self-start">
                          {comment.createdAt?.toDate
                            ? formatDistanceToNow(comment.createdAt.toDate(), {
                                addSuffix: true,
                              })
                            : "Just now"}
                        </span>
                      </div>
                      <p className="text-slate-700 text-sm whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 border-l-4 border-l-blue-400 italic">
                        "{comment.text}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100 border-dashed flex flex-col items-center">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    No comments yet
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Share your thoughts on articles and they will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </main>
  );
}
