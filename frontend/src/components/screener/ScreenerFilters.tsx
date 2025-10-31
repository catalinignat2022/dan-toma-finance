'use client';

import { useTranslations } from 'next-intl';

interface ScreenerFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
}

export function ScreenerFilters({ filters, onFilterChange }: ScreenerFiltersProps) {
  const t = useTranslations('screener');

  const sectors = ['Technology', 'Healthcare', 'Financial', 'Consumer Cyclical', 'Industrials', 'Energy', 'Basic Materials', 'Communication Services', 'Consumer Defensive', 'Real Estate', 'Utilities'];
  const industries = ['Software', 'Semiconductors', 'Biotechnology', 'Banks', 'Auto Manufacturers', 'Oil & Gas', 'Aerospace & Defense', 'Telecommunications'];
  const exchanges = ['NASDAQ', 'NYSE', 'AMEX'];
  const indices = ['S&P 500', 'Dow Jones', 'NASDAQ 100', 'Russell 2000'];
  const countries = ['USA', 'China', 'UK', 'Germany', 'Japan', 'Canada'];

  const FilterSelect = ({ label, value, onChange, options }: any) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"
      >
        <option value="">Any</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const FilterInput = ({ label, value, onChange, placeholder }: any) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Any'}
        className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"
      />
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-800">
      {/* Row 1 */}
      <div className="grid grid-cols-6 gap-3 mb-3">
        <FilterSelect label="Exchange" value={filters.exchange} onChange={(v: string) => onFilterChange({ exchange: v })} options={exchanges} />
        <FilterSelect label="Index" value={filters.index} onChange={(v: string) => onFilterChange({ index: v })} options={indices} />
        <FilterSelect label="Sector" value={filters.sector} onChange={(v: string) => onFilterChange({ sector: v })} options={sectors} />
        <FilterSelect label="Industry" value={filters.industry} onChange={(v: string) => onFilterChange({ industry: v })} options={industries} />
        <FilterSelect label="Country" value={filters.country} onChange={(v: string) => onFilterChange({ country: v })} options={countries} />
        <FilterSelect label="Market Cap" value={filters.marketCap} onChange={(v: string) => onFilterChange({ marketCap: v })} options={['Mega (>$200B)', 'Large ($10B-$200B)', 'Mid ($2B-$10B)', 'Small ($300M-$2B)', 'Micro']} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-6 gap-3 mb-3">
        <FilterInput label="Dividend Yield" value={filters.dividendYield} onChange={(v: string) => onFilterChange({ dividendYield: v })} />
        <FilterInput label="Short Float" value={filters.shortFloat} onChange={(v: string) => onFilterChange({ shortFloat: v })} />
        <FilterInput label="Analyst Recom." value={filters.analystRecom} onChange={(v: string) => onFilterChange({ analystRecom: v })} />
        <FilterInput label="Option/Short" value={filters.optionShort} onChange={(v: string) => onFilterChange({ optionShort: v })} />
        <FilterInput label="Earnings Date" value={filters.earningsDate} onChange={(v: string) => onFilterChange({ earningsDate: v })} />
        <FilterInput label="Average Volume" value={filters.averageVolume} onChange={(v: string) => onFilterChange({ averageVolume: v })} />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-6 gap-3">
        <FilterInput label="Relative Volume" value={filters.relativeVolume} onChange={(v: string) => onFilterChange({ relativeVolume: v })} />
        <FilterInput label="Current Volume" value={filters.currentVolume} onChange={(v: string) => onFilterChange({ currentVolume: v })} />
        <FilterInput label="Price $" value={filters.price} onChange={(v: string) => onFilterChange({ price: v })} placeholder="Any" />
        <FilterInput label="Target Price" value={filters.targetPrice} onChange={(v: string) => onFilterChange({ targetPrice: v })} />
        <FilterInput label="IPO Date" value={filters.ipoDate} onChange={(v: string) => onFilterChange({ ipoDate: v })} />
        <FilterInput label="Shares Outstanding" value={filters.sharesOutstanding} onChange={(v: string) => onFilterChange({ sharesOutstanding: v })} />
      </div>
    </div>
  );
}
