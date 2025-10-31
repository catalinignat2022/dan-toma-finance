'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { MarketHeatmap } from '@/components/home/MarketHeatmap';

type MapFilter = 'sp500' | 'dow30' | 'nasdaq100' | 'russell2000' | 'all' | 'world' | 'etfs' | 'crypto';

export default function MapPage() {
  const t = useTranslations('map');
  const [selectedFilter, setSelectedFilter] = useState<MapFilter>('sp500');

  const filters: { id: MapFilter; label: string }[] = [
    { id: 'sp500', label: 'S&P 500' },
    { id: 'dow30', label: 'Dow Jones 30' },
    { id: 'nasdaq100', label: 'Nasdaq 100' },
    { id: 'russell2000', label: 'Russell 2000' },
    { id: 'all', label: 'All Stocks' },
    { id: 'world', label: 'World' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'crypto', label: 'Crypto' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="flex gap-4 px-4 py-6">
        {/* Left Sidebar - Filters */}
        <aside className="w-48 flex-shrink-0">
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden sticky top-6">
            <div className="bg-[#2a2a2a] px-4 py-3 border-b border-gray-700">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">
                Map Filter
              </h3>
            </div>
            
            <div className="p-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Heatmap */}
        <div className="flex-1 min-w-0">
          <MarketHeatmap 
            fullScreen={true}
            height={800}
            showTitle={true}
            filter={selectedFilter}
          />
        </div>
      </main>
    </div>
  );
}
