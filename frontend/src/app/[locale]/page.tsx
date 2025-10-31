import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { MarketOverview } from '@/components/home/MarketOverview';
import { MarketIndices } from '@/components/home/MarketIndices';
import { MajorIndices } from '@/components/home/MajorIndices';
import { MarketHeatmap } from '@/components/home/MarketHeatmap';
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

        {/* Major Indices Charts - DOW, NASDAQ, S&P 500, Russell 2000 */}
        <MajorIndices />

        {/* Market Indices */}
        <MarketIndices />

        {/* Main Content: Top Movers (Left) + Heatmap (Right) - Finviz Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,600px] gap-6">
          {/* Left Column: Top Movers */}
          <div className="order-2 lg:order-1">
            <TopMovers />
          </div>

          {/* Right Column: Market Heatmap (Smaller) */}
          <div className="order-1 lg:order-2">
            <MarketHeatmap height={500} />
          </div>
        </div>

        {/* Market Overview - Top Gainers, Losers, Active */}
        <MarketOverview />

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
