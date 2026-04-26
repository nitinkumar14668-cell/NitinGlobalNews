import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoData } from '../data/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  category?: keyof typeof seoData.categoryKeywords;
}

export function SEO({ 
  title = seoData.defaultTitle, 
  description = seoData.defaultDescription, 
  keywords = [], 
  image = 'https://globalnews-ten.vercel.app/og-image.jpg', 
  url = 'https://globalnews-ten.vercel.app/',
  type = 'website',
  category
}: SEOProps) {
  
  // Combine all relevant keywords
  const mergedKeywordsArray = [
    ...seoData.globalKeywords,
    ...seoData.searchQueryKeywords,
    ...seoData.tags,
    ...(category ? seoData.categoryKeywords[category] || [] : []),
    ...keywords
  ];

  // Remove duplicates and join into a comma-separated string
  const mergedKeywords = Array.from(new Set(mergedKeywordsArray)).join(', ');

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={mergedKeywords} />
      <meta name="author" content="NitinGlobalNews" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="NitinGlobalNews" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
