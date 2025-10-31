import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { MarketOverview } from '@/components/home/MarketOverview';
import { MarketIndices } from '@/components/home/MarketIndices';
import { NewsSection } from '@/components/home/NewsSection';
import { TopMovers } from '@/components/home/TopMovers';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Market Indices */}
        <MarketIndices />

        {/* Market Overview - Top Gainers, Losers, Active */}
        <MarketOverview />

        {/* Top Movers Grid */}
        <TopMovers />

        {/* Latest News */}
        <NewsSection />
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2025 FinViz Clone. Data provided by Finnhub, Alpha Vantage & CoinGecko.</p>
          <p className="mt-2">Real-time market data aggregation platform</p>
        </div>
      </footer>
    </div>
  );
}
