'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ScreenerFilters } from '@/components/screener/ScreenerFilters';
import { ScreenerTable } from '@/components/screener/ScreenerTable';
import { ScreenerPagination } from '@/components/screener/ScreenerPagination';

interface Stock {
  symbol: string;
  company: string;
  sector: string;
  industry: string;
  country: string;
  exchange: string;
  marketCap: number;
  pe: number;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface ScreenerData {
  stocks: Stock[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalStocks: number;
    totalPages: number;
  };
}

export default function ScreenerPage() {
  const t = useTranslations('screener');
  const [data, setData] = useState<ScreenerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    sector: '',
    industry: '',
    exchange: '',
    marketCapMin: '',
    marketCapMax: '',
    priceMin: '',
    priceMax: '',
    volumeMin: '',
    sortBy: '',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchScreenerData();
  }, [filters]);

  const fetchScreenerData = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', filters.page.toString());
      params.append('pageSize', filters.pageSize.toString());
      if (filters.sector) params.append('sector', filters.sector);
      if (filters.industry) params.append('industry', filters.industry);
      if (filters.exchange) params.append('exchange', filters.exchange);
      if (filters.marketCapMin) params.append('marketCapMin', filters.marketCapMin);
      if (filters.marketCapMax) params.append('marketCapMax', filters.marketCapMax);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.volumeMin) params.append('volumeMin', filters.volumeMin);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/stocks/screener?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch screener data');
      }

      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching screener data:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset to page 1 if filters change
    }));
  };

  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0f1114] transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters */}
        <ScreenerFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Results Info */}
        {data && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {t('showing')} {((data.pagination.currentPage - 1) * data.pagination.pageSize) + 1} - {Math.min(data.pagination.currentPage * data.pagination.pageSize, data.pagination.totalStocks)} {t('of')} {data.pagination.totalStocks} {t('stocks')}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : data ? (
          <>
            <ScreenerTable
              stocks={data.stocks}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSort={handleSort}
            />

            {/* Pagination */}
            <ScreenerPagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              onPageChange={(page: number) => handleFilterChange({ page })}
            />
          </>
        ) : (
          <div className="text-center py-20 text-gray-600 dark:text-gray-400">
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  );
}
