'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface MarketData {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

export function MarketIndices() {
  const t = useTranslations('home');
  const [indices, setIndices] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await axios.get(`${API_URL}/market/indices`);
        setIndices(response.data);
      } catch (error) {
        console.error('Error fetching indices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {indices.map((index) => (
        <div
          key={index.symbol}
          className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {index.symbol}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ${index.currentPrice ? index.currentPrice.toFixed(2) : '0.00'}
          </div>
          <div
            className={`text-sm font-medium mt-1 ${
              index.percentChange && index.percentChange >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {index.percentChange && index.percentChange >= 0 ? '↑' : '↓'} {index.percentChange ? Math.abs(index.percentChange).toFixed(2) : '0.00'}%
          </div>
        </div>
      ))}
    </div>
  );
}
