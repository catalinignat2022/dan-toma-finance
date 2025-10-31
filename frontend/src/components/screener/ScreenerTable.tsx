'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

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

interface ScreenerTableProps {
  stocks: Stock[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export function ScreenerTable({ stocks, sortBy, sortOrder, onSort }: ScreenerTableProps) {
  const t = useTranslations('screener');
  const params = useParams();
  const locale = params?.locale as string || 'en';

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(0)}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <span className="text-gray-400">⇅</span>;
    }
    return sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  const columns = [
    { key: 'symbol', label: t('ticker'), sortable: true },
    { key: 'company', label: t('company'), sortable: true },
    { key: 'sector', label: t('sector'), sortable: true },
    { key: 'industry', label: t('industry'), sortable: true },
    { key: 'country', label: t('country'), sortable: true },
    { key: 'marketCap', label: t('marketCap'), sortable: true },
    { key: 'pe', label: t('pe'), sortable: true },
    { key: 'price', label: t('price'), sortable: true },
    { key: 'change', label: t('change'), sortable: true },
    { key: 'volume', label: t('volume'), sortable: true },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && onSort(column.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && <SortIcon column={column.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {stocks.map((stock, index) => (
              <tr
                key={stock.symbol}
                className={`${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                {/* Ticker */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/${locale}/stock/${stock.symbol}`}
                    className="text-primary hover:underline font-semibold"
                  >
                    {stock.symbol}
                  </Link>
                </td>

                {/* Company */}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {stock.company}
                </td>

                {/* Sector */}
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {stock.sector}
                </td>

                {/* Industry */}
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {stock.industry}
                </td>

                {/* Country */}
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {stock.country}
                </td>

                {/* Market Cap */}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                  {formatMarketCap(stock.marketCap)}
                </td>

                {/* P/E */}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {stock.pe.toFixed(2)}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                  ${stock.price.toFixed(2)}
                </td>

                {/* Change */}
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <div className={stock.changePercent >= 0 ? 'text-success' : 'text-danger'}>
                    <div className="font-semibold">
                      {stock.changePercent >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-xs">
                      {stock.change >= 0 ? '+' : ''}
                      {stock.change.toFixed(2)}
                    </div>
                  </div>
                </td>

                {/* Volume */}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {formatVolume(stock.volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
