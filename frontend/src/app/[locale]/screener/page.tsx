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
    ticker: '',
  });

  // Top controls state
  const [orderBy, setOrderBy] = useState('signal');
  const [signal, setSignal] = useState('Top Gainers');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState('descriptive');
  const [activeViewTab, setActiveViewTab] = useState('overview');

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
      if (filters.ticker) params.append('ticker', filters.ticker);
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

  // Handle signal preset changes
  const handleSignalChange = (newSignal: string) => {
    setSignal(newSignal);
    
    // Apply preset filters based on signal
    switch (newSignal) {
      case 'Top Gainers':
        handleFilterChange({ sortBy: 'changePercent', sortOrder: 'desc' });
        break;
      case 'Top Losers':
        handleFilterChange({ sortBy: 'changePercent', sortOrder: 'asc' });
        break;
      case 'Most Active':
        handleFilterChange({ sortBy: 'volume', sortOrder: 'desc' });
        break;
      case 'Most Volatile':
        handleFilterChange({ sortBy: 'changePercent', sortOrder: 'desc' });
        break;
      default:
        break;
    }
  };

  // Handle order by changes
  const handleOrderByChange = (newOrderBy: string) => {
    setOrderBy(newOrderBy);
    if (newOrderBy !== 'signal') {
      handleFilterChange({ sortBy: newOrderBy, sortOrder: sortDirection });
    }
  };

  // Handle ticker search - filter results by ticker
  const handleTickerSearch = () => {
    // Trigger search with current ticker value in filters
    setFilters(prev => ({ ...prev, page: 1 }));
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

        {/* Top Controls Bar */}
        <div className="bg-[#2c3139] rounded-lg p-4 mb-4 flex items-center gap-4 flex-wrap">
          {/* Order by */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Order by</label>
            <select
              value={orderBy}
              onChange={(e) => handleOrderByChange(e.target.value)}
              className="bg-[#1a1d23] text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="signal">Signal</option>
              <option value="marketCap">Market Cap</option>
              <option value="price">Price</option>
              <option value="change">Change</option>
              <option value="volume">Volume</option>
            </select>
          </div>

          {/* Signal */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Signal</label>
            <select
              value={signal}
              onChange={(e) => handleSignalChange(e.target.value)}
              className="bg-[#1a1d23] text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500 min-w-[180px]"
            >
              <option value="Top Gainers">Top Gainers</option>
              <option value="Top Losers">Top Losers</option>
              <option value="New High">New High</option>
              <option value="New Low">New Low</option>
              <option value="Most Volatile">Most Volatile</option>
              <option value="Most Active">Most Active</option>
              <option value="Unusual Volume">Unusual Volume</option>
              <option value="Overbought">Overbought</option>
              <option value="Oversold">Oversold</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div className="flex items-center gap-2">
            <select
              value={sortDirection}
              onChange={(e) => {
                setSortDirection(e.target.value as 'asc' | 'desc');
                handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' });
              }}
              className="bg-[#1a1d23] text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>

          {/* Tickers Search */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-300">Tickers</label>
            <input
              type="text"
              value={filters.ticker}
              onChange={(e) => handleFilterChange({ ticker: e.target.value.toUpperCase() })}
              onKeyPress={(e) => e.key === 'Enter' && handleTickerSearch()}
              placeholder="AAPL, TSLA, BTC"
              className="bg-[#1a1d23] text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500 w-[240px]"
            />
            <button 
              onClick={handleTickerSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition-colors"
            >
              →
            </button>
          </div>

          {/* Filters Toggle Button */}
          <button
            onClick={() => {/* Toggle filters visibility if needed */}}
            className="bg-[#1a1d23] hover:bg-[#22252b] text-white text-sm px-4 py-1.5 rounded border border-gray-600"
          >
            Filters ▲
          </button>
        </div>

        {/* Main Tab Navigation */}
        <div className="bg-[#2c3139] rounded-t-lg flex items-center gap-2 px-4 border-b border-gray-700">
          {['descriptive', 'fundamental', 'technical', 'news', 'etf', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Filters */}
        <ScreenerFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* View Tabs - Below Filters */}
        <div className="bg-[#2c3139] rounded-lg mb-4 flex items-center gap-2 px-4 py-2 overflow-x-auto">
          {['overview', 'valuation', 'financial', 'ownership', 'performance', 'technical', 'etf', 'etf-perf', 'custom', 'charts', 'tickers', 'basic', 'ta', 'news', 'snapshot', 'maps', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveViewTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                activeViewTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1a1d23] text-gray-300 hover:bg-[#22252b]'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

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
