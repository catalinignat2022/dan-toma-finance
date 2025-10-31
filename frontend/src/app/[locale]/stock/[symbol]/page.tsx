import { useTranslations } from 'next-intl';
import { StockChart } from '@/components/chart/StockChart';
import { Header } from '@/components/layout/Header';

interface StockPageProps {
  params: {
    locale: string;
    symbol: string;
  };
}

async function getStockQuote(symbol: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/stocks/quote/${symbol}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = params;
  const stockData = await getStockQuote(symbol.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Stock Header */}
        {stockData ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stockData.symbol}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {stockData.name}
                </p>
              </div>

              <div className="flex flex-col md:items-end">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${stockData.price ? stockData.price.toFixed(2) : '0.00'}
                </div>
                <div className={`text-xl font-semibold ${
                  stockData.changePercent && stockData.changePercent >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  {stockData.changePercent && stockData.changePercent >= 0 ? '+' : ''}
                  ${stockData.change ? stockData.change.toFixed(2) : '0.00'} ({stockData.changePercent ? stockData.changePercent.toFixed(2) : '0.00'}%)
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              {stockData.open && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${stockData.open.toFixed(2)}
                  </p>
                </div>
              )}
              {stockData.high && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${stockData.high.toFixed(2)}
                  </p>
                </div>
              )}
              {stockData.low && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${stockData.low.toFixed(2)}
                  </p>
                </div>
              )}
              {stockData.volume && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(stockData.volume / 1000000).toFixed(2)}M
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {symbol.toUpperCase()}
            </h1>
            <p className="text-red-500">Failed to load stock data</p>
          </div>
        )}

        {/* Chart */}
        <StockChart symbol={symbol.toUpperCase()} height={600} />

        {/* Company Info Section (Placeholder) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Company information will be displayed here. This can include business description, 
              sector, industry, market cap, P/E ratio, and other fundamental data.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Key Statistics
            </h2>
            <div className="space-y-3">
              {stockData?.marketCap && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(stockData.marketCap / 1000000000).toFixed(2)}B
                  </span>
                </div>
              )}
              {stockData?.peRatio && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">P/E Ratio</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stockData.peRatio.toFixed(2)}
                  </span>
                </div>
              )}
              {stockData?.week52High && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">52W High</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${stockData.week52High.toFixed(2)}
                  </span>
                </div>
              )}
              {stockData?.week52Low && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">52W Low</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${stockData.week52Low.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
