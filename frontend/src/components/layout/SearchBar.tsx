'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/stocks/search?q=${encodeURIComponent(query)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setResults(data.slice(0, 8)); // Limit to 8 results
          setIsOpen(data.length > 0);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (symbol: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/${locale}/stock/${symbol}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex].symbol);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && results.length > 0 && setIsOpen(true)}
          placeholder="Search ticker, company or profile"
          className="w-full px-4 py-2 pl-10 bg-[#2d3142] border-2 border-[#4a5168] rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 text-sm transition-colors"
        />
        
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d3142] border-2 border-[#4a5168] rounded shadow-2xl max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={`${result.symbol}-${result.exchange}`}
              onClick={() => handleSelect(result.symbol)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-2 text-left transition-colors border-b border-gray-700 last:border-b-0 ${
                selectedIndex === index ? 'bg-[#3a3f50]' : 'hover:bg-[#3a3f50]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Symbol */}
                <span className="font-bold text-[#ffa500] text-sm w-16 flex-shrink-0">
                  {result.symbol}
                </span>
                
                {/* Company Name */}
                <span className="text-white text-sm flex-1 truncate">
                  {result.name}
                </span>
                
                {/* Exchange */}
                <span className="text-gray-400 text-sm w-16 text-right flex-shrink-0">
                  {result.exchange}
                </span>
              </div>
            </button>
          ))}
          
          {/* Show All Results Button */}
          <button
            onClick={() => {
              console.log('Show all results for:', query);
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-center text-sm font-medium text-gray-300 bg-[#3a3f50] hover:bg-[#454b5f] transition-colors"
          >
            Show All Results
          </button>
        </div>
      )}

      {/* No Results */}
      {isOpen && !loading && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d3142] border-2 border-[#4a5168] rounded shadow-2xl p-4 z-50">
          <p className="text-center text-gray-400 text-sm">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
