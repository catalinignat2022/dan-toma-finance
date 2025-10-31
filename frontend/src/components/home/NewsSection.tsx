'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image?: string;
  datetime: number;
  category?: string;
  related?: string;
}

export function NewsSection() {
  const t = useTranslations('home');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/news`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNews(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('latestNews')}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          📰 Market News
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-32 h-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p className="font-semibold">Failed to load news</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.slice(0, 10).map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              {article.image && (
                <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {article.headline}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-medium">{article.source}</span>
                  <span>•</span>
                  <span>{formatDate(article.datetime)}</span>
                  {article.related && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {article.related}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>No news available at the moment</p>
        </div>
      )}
    </div>
  );
}
