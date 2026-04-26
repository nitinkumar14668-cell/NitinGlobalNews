/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppProvider } from "./contexts/AppContext";
import { Header } from "./components/Header";
import { LocationPrompt } from "./components/LocationPrompt";
import { NewsGrid } from "./components/NewsGrid";
import { Footer } from "./components/Footer";
import { AboutUs } from "./components/AboutUs";
import { UserProfile } from "./components/UserProfile";
import { AdminPanel } from "./components/AdminPanel";
import { SEO } from "./components/SEO";
import { ArticlePage } from "./components/ArticlePage";
import { Article } from "./data/news";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "profile" | "admin" | "article">(
    "home",
  );
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handlePageChange = (page: "home" | "about" | "profile" | "admin") => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setCurrentPage("article");
    window.scrollTo(0, 0);
  };

  return (
    <AppProvider>
      <SEO />
      <div className="min-h-screen border-t-4 border-blue-900 bg-slate-50 font-sans text-gray-900 flex flex-col">
        <Header
          onLogoClick={() => handlePageChange("home")}
          onProfileClick={() => handlePageChange("profile")}
          onArticleSelect={handleArticleSelect}
        />
        <LocationPrompt />
        <div className="flex-1">
          {currentPage === "home" && <NewsGrid onArticleSelect={handleArticleSelect} />}
          {currentPage === "about" && <AboutUs />}
          {currentPage === "admin" && <AdminPanel onBack={() => handlePageChange("home")} />}
          {currentPage === "profile" && (
            <UserProfile onBack={() => handlePageChange("home")} onAdminClick={() => handlePageChange("admin")} />
          )}
          {currentPage === "article" && selectedArticle && (
            <ArticlePage article={selectedArticle} onBack={() => handlePageChange("home")} />
          )}
        </div>
        <Footer onAboutClick={() => handlePageChange("about")} />
      </div>
    </AppProvider>
  );
}
