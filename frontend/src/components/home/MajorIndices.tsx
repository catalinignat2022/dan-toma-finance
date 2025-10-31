'use client';

import { useEffect, useState } from 'react';
import { MiniChart } from '../chart/MiniChart';
import { useTranslations } from 'next-intl';

interface IndexData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  chartData: Array<{ time: string; value: number }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function MajorIndices() {
  const t = useTranslations('home');
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        setLoading(true);

        // Fetch chart data for all 4 major indices in parallel
        const symbols = [
          { symbol: 'DIA', name: 'Dow Jones' },      // DOW ETF
          { symbol: 'QQQ', name: 'NASDAQ' },          // NASDAQ ETF
          { symbol: 'SPY', name: 'S&P 500' },         // S&P 500 ETF
          { symbol: 'IWM', name: 'Russell 2000' }     // Russell 2000 ETF
        ];

        const dataPromises = symbols.map(async ({ symbol, name }) => {
          try {
            // Fetch quote
            const quoteResponse = await fetch(`${API_URL}/stocks/quote/${symbol}`);
            const quoteData = await quoteResponse.json();

            // Fetch chart data (daily for last 30 days)
            const chartResponse = await fetch(`${API_URL}/stocks/chart/${symbol}?interval=daily`);
            const chartData = await chartResponse.json();

            // Convert chart data to simple format
            const formattedChartData = chartData.map((item: any) => ({
              time: item.time,
              value: item.close
            }));

            return {
              symbol,
              name,
              currentPrice: quoteData.price || quoteData.currentPrice || 0,
              change: quoteData.change || 0,
              changePercent: quoteData.changePercent || quoteData.percentChange || 0,
              chartData: formattedChartData
            };
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
            // Return mock data on error
            return {
              symbol,
              name,
              currentPrice: 0,
              change: 0,
              changePercent: 0,
              chartData: []
            };
          }
        });

        const results = await Promise.all(dataPromises);
        setIndices(results);
      } catch (error) {
        console.error('Error fetching major indices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();

    // Refresh every 60 seconds
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {t('majorIndices')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {t('majorIndices')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <MiniChart
            key={index.symbol}
            symbol={index.symbol}
            title={index.name}
            data={index.chartData}
            currentPrice={index.currentPrice}
            change={index.change}
            changePercent={index.changePercent}
          />
        ))}
      </div>
    </div>
  );
}
