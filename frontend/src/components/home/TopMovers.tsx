'use client';

import { useEffect, useState, useRef } from 'react';
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

interface HoveredStock {
  stock: StockQuote;
  x: number;
  y: number;
}

export function TopMovers() {
  const t = useTranslations('home');
  const [activeTab, setActiveTab] = useState<MoversTab>('gainers');
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStock, setHoveredStock] = useState<HoveredStock | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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

  // Fetch chart data when hovering
  useEffect(() => {
    if (hoveredStock) {
      fetchChartData(hoveredStock.stock.symbol);
    } else {
      setChartData(null);
    }
  }, [hoveredStock]);

  const fetchChartData = async (symbol: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const url = `${apiUrl}/stocks/chart/${symbol}`;
      console.log('Fetching chart from:', url);
      
      const response = await fetch(url);
      console.log('Chart response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Chart data received:', data?.length, 'points');
        setChartData(data);
      } else {
        console.error('Chart fetch failed:', response.status, await response.text());
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const handleMouseEnter = (stock: StockQuote, event: React.MouseEvent<HTMLTableRowElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredStock({
      stock,
      x: rect.right + 10,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredStock(null);
  };

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Ticker</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Last</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Change</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Volume</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">Signal</th>
              </tr>
            </thead>
            <tbody>
              {stocks.slice(0, 20).map((stock, index) => (
                <tr 
                  key={stock.symbol}
                  className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-850'
                  }`}
                  onMouseEnter={(e) => handleMouseEnter(stock, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{stock.symbol}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right font-semibold text-gray-900 dark:text-white">
                    ${stock.price ? stock.price.toFixed(2) : '0.00'}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <div className={`font-bold ${
                      stock.changePercent && stock.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stock.changePercent && stock.changePercent >= 0 ? '+' : ''}{stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right text-gray-700 dark:text-gray-300">
                    {stock.volume ? `${(stock.volume / 1000000).toFixed(1)}M` : '-'}
                  </td>
                  <td className="py-2 px-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      activeTab === 'gainers' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      activeTab === 'losers' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}>
                      {activeTab === 'gainers' ? 'Top Gainer' :
                       activeTab === 'losers' ? 'Top Loser' :
                       'Most Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hover Popup with Chart */}
          {hoveredStock && (
            <div
              ref={popupRef}
              className="fixed z-50 bg-[#2a2a2a] border-2 border-gray-600 rounded-lg shadow-2xl p-4 pointer-events-none"
              style={{
                left: `${hoveredStock.x}px`,
                top: `${Math.max(10, hoveredStock.y - 200)}px`,
                width: '500px',
                maxHeight: '600px'
              }}
            >
              {/* Header with Symbol and Price */}
              <div className="border-b border-gray-600 pb-3 mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {hoveredStock.stock.symbol}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${hoveredStock.stock.price.toFixed(2)}
                    </div>
                    <div className={`text-lg font-bold ${
                      hoveredStock.stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {hoveredStock.stock.changePercent >= 0 ? '+' : ''}{hoveredStock.stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-1">{hoveredStock.stock.name}</p>
              </div>

              {/* Chart */}
              <div className="bg-[#1a1a1a] rounded-lg p-3 mb-3">
                {chartData ? (
                  <div className="relative" style={{ height: '200px' }}>
                    <svg width="100%" height="200" className="overflow-visible">
                      {/* Simple line chart from chart data */}
                      {(() => {
                        const prices = chartData.map((d: any) => d.close);
                        const maxPrice = Math.max(...prices);
                        const minPrice = Math.min(...prices);
                        const priceRange = maxPrice - minPrice || 1;
                        const points = chartData.map((d: any, i: number) => {
                          const x = (i / (chartData.length - 1)) * 460;
                          const y = 180 - ((d.close - minPrice) / priceRange) * 160;
                          return `${x},${y}`;
                        }).join(' ');
                        
                        return (
                          <>
                            <polyline
                              points={points}
                              fill="none"
                              stroke={hoveredStock.stock.changePercent >= 0 ? '#4ade80' : '#f87171'}
                              strokeWidth="2"
                            />
                            <text x="10" y="20" fill="#9ca3af" fontSize="12">
                              Oct 30
                            </text>
                            <text x="420" y="20" fill="#9ca3af" fontSize="12">
                              ${hoveredStock.stock.price.toFixed(2)}
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-gray-400">
                    Loading chart...
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-400">Industry:</span>
                  <span className="text-white ml-2">Technology</span>
                </div>
                <div>
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white ml-2">USA</span>
                </div>
                <div>
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white ml-2">
                    {hoveredStock.stock.volume ? `${(hoveredStock.stock.volume / 1000000).toFixed(1)}M` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-white ml-2">-</span>
                </div>
              </div>

              {/* Signals */}
              <div className="border-t border-gray-600 pt-3">
                <div className="text-gray-400 text-xs font-semibold mb-2">SIGNALS</div>
                <div className="space-y-1">
                  {activeTab === 'gainers' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">Upgrades</span>
                      <span className="text-xs text-gray-300">Strong Buy Signal</span>
                    </div>
                  )}
                  {activeTab === 'losers' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">Downgrades</span>
                      <span className="text-xs text-gray-300">Sell Signal</span>
                    </div>
                  )}
                  {activeTab === 'active' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">High Volume</span>
                      <span className="text-xs text-gray-300">Unusual Activity</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Finviz watermark */}
              <div className="text-right mt-2">
                <span className="text-xs text-gray-500">© finviz.com</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
