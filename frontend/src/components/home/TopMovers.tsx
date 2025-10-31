'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
}

type MoversTab = 'gainers' | 'losers' | 'active';

export function TopMovers() {
  const t = useTranslations('home');
  const [activeTab, setActiveTab] = useState<MoversTab>('gainers');
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        setLoading(true);
        const endpoint = 
          activeTab === 'gainers' ? 'top-gainers' :
          activeTab === 'losers' ? 'top-losers' : 
          'most-active';
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/stocks/${endpoint}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch movers data');
        }
        
        const data = await response.json();
        setStocks(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movers:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
    // Refresh every 60 seconds
    const interval = setInterval(fetchMovers, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const tabs: { key: MoversTab; label: string; icon: string }[] = [
    { key: 'gainers', label: t('topGainers'), icon: '📈' },
    { key: 'losers', label: t('topLosers'), icon: '📉' },
    { key: 'active', label: t('mostActive'), icon: '🔥' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('topMovers')}
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p className="font-semibold">Failed to load data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.slice(0, 12).map((stock) => (
            <div
              key={stock.symbol}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-primary"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {stock.symbol}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {stock.name}
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  stock.changePercent && stock.changePercent >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  {stock.changePercent && stock.changePercent >= 0 ? '+' : ''}{stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Price:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${stock.price ? stock.price.toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Change:</span>
                  <span className={`font-semibold ${
                    stock.change && stock.change >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {stock.change && stock.change >= 0 ? '+' : ''}${stock.change ? stock.change.toFixed(2) : '0.00'}
                  </span>
                </div>
                {stock.volume && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {(stock.volume / 1000000).toFixed(1)}M
                    </span>
                  </div>
                )}
                {stock.high && stock.low && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Range:</span>
                    <span className="text-xs text-gray-900 dark:text-white">
                      ${stock.low.toFixed(2)} - ${stock.high.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
