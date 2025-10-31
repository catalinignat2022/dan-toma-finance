'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface MarketData {
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  mostActive: StockQuote[];
  indices: StockQuote[];
}

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export function MarketOverview() {
  const t = useTranslations('home');
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/market/overview`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching market overview:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Failed to load market data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {t('marketOverview')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-success flex items-center gap-2">
            <span className="text-2xl">📈</span>
            {t('topGainers')}
          </h3>
          <div className="space-y-2">
            {data.topGainers.slice(0, 5).map((stock) => (
              <Link
                key={stock.symbol}
                href={`/${locale}/stock/${stock.symbol}`}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer block"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${stock.price ? stock.price.toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-success font-semibold">
                    +{stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +${stock.change ? stock.change.toFixed(2) : '0.00'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-danger flex items-center gap-2">
            <span className="text-2xl">📉</span>
            {t('topLosers')}
          </h3>
          <div className="space-y-2">
            {data.topLosers.slice(0, 5).map((stock) => (
              <Link
                key={stock.symbol}
                href={`/${locale}/stock/${stock.symbol}`}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer block"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${stock.price ? stock.price.toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-danger font-semibold">
                    {stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${stock.change ? stock.change.toFixed(2) : '0.00'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most Active */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            {t('mostActive')}
          </h3>
          <div className="space-y-2">
            {data.mostActive.slice(0, 5).map((stock) => (
              <Link
                key={stock.symbol}
                href={`/${locale}/stock/${stock.symbol}`}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer block"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${stock.price ? stock.price.toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${stock.changePercent && stock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                    {stock.changePercent && stock.changePercent >= 0 ? '+' : ''}
                    {stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                  </p>
                  {stock.volume && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Vol: {(stock.volume / 1000000).toFixed(1)}M
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
