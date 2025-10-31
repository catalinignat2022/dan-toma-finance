'use client';

import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

interface MarketHeatmapProps {
  fullScreen?: boolean;
  height?: number;
  showTitle?: boolean;
  enableNavigation?: boolean;
  filter?: 'sp500' | 'dow30' | 'nasdaq100' | 'russell2000' | 'all' | 'world' | 'etfs' | 'crypto';
}

interface TreeNode extends d3.HierarchyRectangularNode<any> {
  data: {
    name: string;
    symbol?: string;
    changePercent?: number;
    price?: number;
    children?: TreeNode[];
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Stock lists for each filter
const FILTER_STOCKS: Record<string, string[]> = {
  'dow30': ['AAPL', 'MSFT', 'JPM', 'V', 'UNH', 'HD', 'PG', 'JNJ', 'MA', 'CVX', 
            'MRK', 'CSCO', 'WMT', 'DIS', 'CRM', 'INTC', 'VZ', 'KO', 'NKE', 'IBM',
            'AXP', 'AMGN', 'GS', 'CAT', 'BA', 'HON', 'MMM', 'TRV', 'MCD', 'DOW'],
  
  'nasdaq100': ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 'AVGO', 'COST',
                'NFLX', 'AMD', 'ADBE', 'PEP', 'CSCO', 'TMUS', 'INTC', 'INTU', 'QCOM', 'CMCSA',
                'TXN', 'AMAT', 'HON', 'SBUX', 'BKNG', 'ISRG', 'PANW', 'GILD', 'ADP', 'VRTX',
                'ADI', 'LRCX', 'REGN', 'MU', 'KLAC', 'SNPS', 'CDNS', 'MRVL', 'PYPL', 'ABNB'],
  
  'russell2000': ['IWM', 'VTWO', 'URTY', 'SCHA', 'VB', 'VTWV', 'IJR', 'DFAS', 'VBR', 'IWN'],
  
  'sp500': ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'LLY',
            'V', 'UNH', 'JPM', 'XOM', 'WMT', 'JNJ', 'MA', 'PG', 'AVGO', 'HD',
            'CVX', 'MRK', 'ABBV', 'COST', 'ORCL', 'PEP', 'KO', 'NFLX', 'CRM', 'BAC',
            'ADBE', 'TMO', 'CSCO', 'MCD', 'ACN', 'ABT', 'TMUS', 'WFC', 'DHR', 'LIN',
            'INTU', 'TXN', 'DIS', 'CMCSA', 'PM', 'NEE', 'VZ', 'IBM', 'SPGI', 'QCOM'],
  
  'all': [], // Will fetch from API
  
  'world': ['TSM', 'ASML', 'NVO', 'SAP', 'TM', 'BABA', 'UL', 'SHOP', 'SNY', 'RELX',
            'BHP', 'RIO', 'TD', 'BCS', 'NVS', 'HSBC', 'BP', 'SONY', 'DEO', 'BTI'],
  
  'etfs': ['SPY', 'QQQ', 'IWM', 'DIA', 'VOO', 'VTI', 'EFA', 'VEA', 'IVV', 'AGG',
           'GLD', 'VWO', 'TLT', 'BND', 'IJH', 'VTV', 'EEM', 'IEFA', 'XLF', 'VUG'],
  
  'crypto': ['BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD', 
             'SOL-USD', 'DOT-USD', 'MATIC-USD', 'LTC-USD']
};

// Comprehensive sector mapping for S&P 500 stocks
const SECTOR_MAP: Record<string, string> = {
  // TECHNOLOGY - SOFTWARE & INFRASTRUCTURE
  'MSFT': 'TECHNOLOGY', 'ORCL': 'TECHNOLOGY', 'CRM': 'TECHNOLOGY', 'ADBE': 'TECHNOLOGY',
  'INTU': 'TECHNOLOGY', 'NOW': 'TECHNOLOGY', 'PANW': 'TECHNOLOGY', 'SNPS': 'TECHNOLOGY',
  'CDNS': 'TECHNOLOGY', 'ANSS': 'TECHNOLOGY', 'FTNT': 'TECHNOLOGY', 'WDAY': 'TECHNOLOGY',
  
  // SEMICONDUCTORS
  'NVDA': 'SEMICONDUCTORS', 'AVGO': 'SEMICONDUCTORS', 'AMD': 'SEMICONDUCTORS', 
  'INTC': 'SEMICONDUCTORS', 'QCOM': 'SEMICONDUCTORS', 'TXN': 'SEMICONDUCTORS',
  'ADI': 'SEMICONDUCTORS', 'MU': 'SEMICONDUCTORS', 'MRVL': 'SEMICONDUCTORS',
  'KLAC': 'SEMICONDUCTORS', 'LRCX': 'SEMICONDUCTORS', 'AMAT': 'SEMICONDUCTORS',
  
  // CONSUMER ELECTRONICS
  'AAPL': 'CONSUMER ELECTRONICS',
  
  // COMMUNICATION SERVICES
  'GOOGL': 'COMMUNICATION', 'GOOG': 'COMMUNICATION', 'META': 'COMMUNICATION',
  'NFLX': 'COMMUNICATION', 'DIS': 'COMMUNICATION', 'CMCSA': 'COMMUNICATION',
  'T': 'COMMUNICATION', 'VZ': 'COMMUNICATION', 'TMUS': 'COMMUNICATION',
  
  // CONSUMER CYCLICAL
  'AMZN': 'CONSUMER CYCLICAL', 'TSLA': 'CONSUMER CYCLICAL', 'HD': 'CONSUMER CYCLICAL',
  'NKE': 'CONSUMER CYCLICAL', 'MCD': 'CONSUMER CYCLICAL', 'SBUX': 'CONSUMER CYCLICAL',
  'TJX': 'CONSUMER CYCLICAL', 'LOW': 'CONSUMER CYCLICAL', 'BKNG': 'CONSUMER CYCLICAL',
  'MAR': 'CONSUMER CYCLICAL', 'ABNB': 'CONSUMER CYCLICAL', 'GM': 'CONSUMER CYCLICAL',
  'F': 'CONSUMER CYCLICAL', 'EBAY': 'CONSUMER CYCLICAL',
  
  // CONSUMER DEFENSIVE
  'WMT': 'CONSUMER DEFENSIVE', 'PG': 'CONSUMER DEFENSIVE', 'COST': 'CONSUMER DEFENSIVE',
  'PEP': 'CONSUMER DEFENSIVE', 'KO': 'CONSUMER DEFENSIVE', 'CL': 'CONSUMER DEFENSIVE',
  'PM': 'CONSUMER DEFENSIVE', 'MO': 'CONSUMER DEFENSIVE', 'EL': 'CONSUMER DEFENSIVE',
  'MDLZ': 'CONSUMER DEFENSIVE', 'KHC': 'CONSUMER DEFENSIVE', 'GIS': 'CONSUMER DEFENSIVE',
  'HSY': 'CONSUMER DEFENSIVE', 'K': 'CONSUMER DEFENSIVE', 'DG': 'CONSUMER DEFENSIVE',
  
  // FINANCIAL
  'JPM': 'FINANCIAL', 'BAC': 'FINANCIAL', 'WFC': 'FINANCIAL', 'V': 'FINANCIAL',
  'MA': 'FINANCIAL', 'GS': 'FINANCIAL', 'MS': 'FINANCIAL', 'BLK': 'FINANCIAL',
  'AXP': 'FINANCIAL', 'SPGI': 'FINANCIAL', 'C': 'FINANCIAL', 'SCHW': 'FINANCIAL',
  'CB': 'FINANCIAL', 'PGR': 'FINANCIAL', 'MMC': 'FINANCIAL', 'BRK-B': 'FINANCIAL',
  'ICE': 'FINANCIAL', 'CME': 'FINANCIAL', 'AON': 'FINANCIAL', 'AJG': 'FINANCIAL',
  
  // HEALTHCARE
  'UNH': 'HEALTHCARE', 'JNJ': 'HEALTHCARE', 'LLY': 'HEALTHCARE', 'ABBV': 'HEALTHCARE',
  'MRK': 'HEALTHCARE', 'TMO': 'HEALTHCARE', 'ABT': 'HEALTHCARE', 'DHR': 'HEALTHCARE',
  'PFE': 'HEALTHCARE', 'BMY': 'HEALTHCARE', 'AMGN': 'HEALTHCARE', 'GILD': 'HEALTHCARE',
  'MDT': 'HEALTHCARE', 'CVS': 'HEALTHCARE', 'CI': 'HEALTHCARE', 'HUM': 'HEALTHCARE',
  'BSX': 'HEALTHCARE', 'ELV': 'HEALTHCARE', 'ISRG': 'HEALTHCARE', 'REGN': 'HEALTHCARE',
  'VRTX': 'HEALTHCARE', 'ZTS': 'HEALTHCARE', 'SYK': 'HEALTHCARE',
  
  // INDUSTRIALS
  'CAT': 'INDUSTRIALS', 'BA': 'INDUSTRIALS', 'GE': 'INDUSTRIALS', 'RTX': 'INDUSTRIALS',
  'HON': 'INDUSTRIALS', 'UPS': 'INDUSTRIALS', 'LMT': 'INDUSTRIALS', 'DE': 'INDUSTRIALS',
  'UNP': 'INDUSTRIALS', 'MMM': 'INDUSTRIALS', 'FDX': 'INDUSTRIALS', 'NSC': 'INDUSTRIALS',
  'CSX': 'INDUSTRIALS', 'EMR': 'INDUSTRIALS', 'ETN': 'INDUSTRIALS', 'ITW': 'INDUSTRIALS',
  
  // ENERGY
  'XOM': 'ENERGY', 'CVX': 'ENERGY', 'COP': 'ENERGY', 'SLB': 'ENERGY',
  'EOG': 'ENERGY', 'MPC': 'ENERGY', 'PSX': 'ENERGY', 'VLO': 'ENERGY',
  'OXY': 'ENERGY', 'HES': 'ENERGY', 'HAL': 'ENERGY', 'KMI': 'ENERGY',
  
  // UTILITIES
  'NEE': 'UTILITIES', 'DUK': 'UTILITIES', 'SO': 'UTILITIES', 'D': 'UTILITIES',
  'AEP': 'UTILITIES', 'EXC': 'UTILITIES', 'SRE': 'UTILITIES', 'XEL': 'UTILITIES',
  
  // REAL ESTATE
  'PLD': 'REAL ESTATE', 'AMT': 'REAL ESTATE', 'CCI': 'REAL ESTATE', 'EQIX': 'REAL ESTATE',
  'PSA': 'REAL ESTATE', 'WELL': 'REAL ESTATE', 'DLR': 'REAL ESTATE', 'O': 'REAL ESTATE',
  
  // MATERIALS & BASIC
  'LIN': 'MATERIALS', 'APD': 'MATERIALS', 'SHW': 'MATERIALS', 'FCX': 'MATERIALS',
  'ECL': 'MATERIALS', 'NEM': 'MATERIALS', 'DD': 'MATERIALS', 'DOW': 'MATERIALS',
};

export function MarketHeatmap({ 
  fullScreen = false, 
  height = 700, 
  showTitle = true,
  enableNavigation = true,
  filter = 'sp500'
}: MarketHeatmapProps = {}) {
  const t = useTranslations('home');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, [filter]);

  useEffect(() => {
    if (data.length > 0 && containerRef.current) {
      renderTreemap();
    }
  }, [data]);

  // Fetch stock data for specific symbols
  const fetchStocksBySymbols = async (symbols: string[]): Promise<StockData[]> => {
    const batchSize = 10;
    const batches: string[][] = [];
    
    // Split symbols into batches to avoid rate limiting
    for (let i = 0; i < symbols.length; i += batchSize) {
      batches.push(symbols.slice(i, i + batchSize));
    }
    
    const allStocksData: StockData[] = [];
    
    for (const batch of batches) {
      const promises = batch.map(async (symbol) => {
        try {
          const res = await fetch(`${API_URL}/stocks/quote/${symbol}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data;
        } catch (error) {
          console.error(`Failed to fetch ${symbol}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      const validResults = results.filter((r): r is StockData => r !== null);
      allStocksData.push(...validResults);
      
      // Small delay between batches to avoid rate limiting
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return allStocksData;
  };

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      
      // Get symbols based on selected filter
      const targetSymbols = FILTER_STOCKS[filter] || [];
      
      if (targetSymbols.length > 0) {
        // Fetch specific symbols for the selected filter
        const stocksData = await fetchStocksBySymbols(targetSymbols);
        setData(stocksData);
      } else {
        // For 'all' filter, use API endpoints
        const [gainersRes, losersRes, activeRes] = await Promise.all([
          fetch(`${API_URL}/stocks/top-gainers`),
          fetch(`${API_URL}/stocks/top-losers`),
          fetch(`${API_URL}/stocks/most-active`)
        ]);

        const [gainers, losers, active] = await Promise.all([
          gainersRes.json(),
          losersRes.json(),
          activeRes.json()
        ]);

        // Combine and deduplicate stocks
        const allStocks = [...gainers, ...losers, ...active];
        const uniqueStocksMap = new Map<string, StockData>();
        
        allStocks.forEach(stock => {
          if (!uniqueStocksMap.has(stock.symbol) || 
              Math.abs(stock.changePercent) > Math.abs(uniqueStocksMap.get(stock.symbol)!.changePercent)) {
            uniqueStocksMap.set(stock.symbol, stock);
          }
        });

        let finalData = Array.from(uniqueStocksMap.values());

        // If we don't have enough stocks or missing key sectors, add representative stocks
        const hasSectorCoverage = Object.keys(SECTOR_MAP).some(symbol => 
          finalData.some(stock => stock.symbol === symbol)
        );

        if (finalData.length < 50 || !hasSectorCoverage) {
          console.log('Adding representative stocks for better sector coverage');
          finalData = await enrichWithRepresentativeStocks(finalData);
        }

        setData(finalData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      // Use fallback data
      const fallbackData = await generateFallbackData();
      setData(fallbackData);
      setLoading(false);
    }
  };

  // Fetch additional stocks for sectors with low representation
  const enrichWithRepresentativeStocks = async (existingStocks: StockData[]): Promise<StockData[]> => {
    // Representative stocks for each sector (most important/liquid stocks)
    const representativeStocks = [
      // TECHNOLOGY
      'MSFT', 'ORCL', 'CRM', 'ADBE', 'INTU', 'NOW', 'PANW',
      // SEMICONDUCTORS  
      'NVDA', 'AVGO', 'AMD', 'INTC', 'QCOM', 'TXN', 'MU',
      // CONSUMER ELECTRONICS
      'AAPL',
      // COMMUNICATION
      'GOOGL', 'GOOG', 'META', 'NFLX', 'DIS', 'CMCSA', 'T',
      // CONSUMER CYCLICAL
      'AMZN', 'TSLA', 'HD', 'NKE', 'MCD', 'SBUX', 'LOW',
      // CONSUMER DEFENSIVE
      'WMT', 'PG', 'COST', 'KO', 'PEP', 'PM',
      // FINANCIAL
      'JPM', 'BAC', 'WFC', 'V', 'MA', 'GS', 'BLK',
      // HEALTHCARE
      'UNH', 'JNJ', 'LLY', 'ABBV', 'MRK', 'TMO', 'ABT',
      // INDUSTRIALS
      'CAT', 'BA', 'GE', 'UPS', 'HON', 'RTX',
      // ENERGY
      'XOM', 'CVX', 'COP', 'SLB',
      // UTILITIES
      'NEE', 'DUK', 'SO',
      // REAL ESTATE
      'PLD', 'AMT', 'EQIX',
      // MATERIALS
      'LIN', 'APD', 'SHW'
    ];

    const existingSymbols = new Set(existingStocks.map(s => s.symbol));
    const missingSymbols = representativeStocks.filter(s => !existingSymbols.has(s));

    if (missingSymbols.length === 0) {
      return existingStocks;
    }

    // Fetch quotes for missing stocks (in batches to avoid overwhelming API)
    try {
      const batchSize = 10;
      const additionalStocks: StockData[] = [];

      for (let i = 0; i < Math.min(missingSymbols.length, 40); i += batchSize) {
        const batch = missingSymbols.slice(i, i + batchSize);
        const promises = batch.map(symbol => 
          fetch(`${API_URL}/stocks/quote/${symbol}`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
        );

        const results = await Promise.all(promises);
        additionalStocks.push(...results.filter(Boolean));
      }

      return [...existingStocks, ...additionalStocks];
    } catch (error) {
      console.error('Error enriching with representative stocks:', error);
      return existingStocks;
    }
  };

  // Generate fallback data with realistic values
  const generateFallbackData = async (): Promise<StockData[]> => {
    const stockSymbols = Object.keys(SECTOR_MAP);
    return stockSymbols.slice(0, 60).map(symbol => ({
      symbol,
      name: symbol,
      price: 100 + Math.random() * 400,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(1000000 + Math.random() * 10000000),
    }));
  };

  const getColor = (changePercent: number): string => {
    // Finviz exact color palette
    if (changePercent >= 6) return '#116d31';
    if (changePercent >= 4) return '#158239';
    if (changePercent >= 2) return '#1a9641';
    if (changePercent >= 1) return '#36b358';
    if (changePercent >= 0.5) return '#58c470';
    if (changePercent > 0) return '#7dd68a';
    if (changePercent <= -6) return '#8b1a1a';
    if (changePercent <= -4) return '#a52222';
    if (changePercent <= -2) return '#c92a2a';
    if (changePercent <= -1) return '#e03131';
    if (changePercent <= -0.5) return '#f03e3e';
    if (changePercent < 0) return '#ff6b6b';
    return '#4a5568';
  };

  const renderTreemap = () => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const actualHeight = height;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    // Group stocks by sector
    const stocksBySector: Record<string, StockData[]> = {};
    data.forEach(stock => {
      const sector = SECTOR_MAP[stock.symbol] || 'OTHER';
      if (!stocksBySector[sector]) stocksBySector[sector] = [];
      stocksBySector[sector].push(stock);
    });

    // Create hierarchical data structure
    const hierarchyData = {
      name: 'Market',
      children: Object.entries(stocksBySector).map(([sector, stocks]) => ({
        name: sector,
        children: stocks.map(stock => ({
          name: stock.symbol,
          value: Math.max(10, Math.abs(stock.changePercent) * 100 + 50), // Variable sizing
          stock: stock
        }))
      }))
    };

    const root = d3.hierarchy(hierarchyData)
      .sum((d: any) => d.value || 0)
      .sort((a: any, b: any) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3.treemap<any>()
      .size([width, actualHeight])
      .paddingTop(20)
      .paddingRight(2)
      .paddingBottom(2)
      .paddingLeft(2)
      .paddingInner(2)
      .tile(d3.treemapSquarify.ratio(1.5));

    treemapLayout(root);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', actualHeight)
      .attr('viewBox', `0 0 ${width} ${actualHeight}`);

    // Create groups for each node
    const nodes = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    nodes.append('rect')
      .attr('width', (d: any) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d: any) => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d: any) => {
        const stock = d.data.stock;
        return getColor(stock?.changePercent || 0);
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', function(event: any, d: any) {
        const stock = d.data.stock;
        if (stock) {
          router.push(`/${locale}/stock/${stock.symbol}`);
        }
      })
      .on('mouseover', function() {
        d3.select(this)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke', '#000')
          .attr('stroke-width', 1.5);
      });

    // Add stock symbols (main label)
    nodes.append('text')
      .attr('x', (d: any) => (d.x1 - d.x0) / 2)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .attr('font-size', (d: any) => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        // Dynamic font size based on cell size
        if (width < 40 || height < 25) return '0px'; // Too small, hide
        if (width < 60 || height < 35) return '9px'; // Small cell
        if (width < 80 || height < 50) return '11px'; // Medium cell
        return '14px'; // Large cell
      })
      .text((d: any) => d.data.name);

    // Add percentage change (secondary label)
    nodes.append('text')
      .attr('x', (d: any) => (d.x1 - d.x0) / 2)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 + 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .attr('font-size', (d: any) => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        // Dynamic font size for percentage
        if (width < 40 || height < 25) return '0px'; // Too small, hide
        if (width < 60 || height < 35) return '8px'; // Small cell
        if (width < 80 || height < 50) return '10px'; // Medium cell
        return '12px'; // Large cell
      })
      .text((d: any) => {
        const stock = d.data.stock;
        if (stock) {
          const percent = stock.changePercent;
          return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
        }
        return '';
      });

    // Add sector labels
    const sectors = svg.selectAll('.sector-label')
      .data(root.children || [])
      .enter()
      .append('g')
      .attr('class', 'sector-label');

    sectors.append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', 18)
      .attr('fill', '#1a1a1a')
      .attr('opacity', 0.95);

    sectors.append('text')
      .attr('x', (d: any) => d.x0 + 6)
      .attr('y', (d: any) => d.y0 + 13)
      .attr('fill', '#ffffff')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .style('text-transform', 'uppercase')
      .text((d: any) => d.data.name);
  };

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] rounded-lg border border-gray-800">
        {showTitle && (
          <div className="bg-[#1a1a1a] px-6 py-3 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">
              {t('marketHeatmap')}
            </h2>
          </div>
        )}
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-400">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleContainerClick = () => {
    if (enableNavigation && !fullScreen) {
      router.push(`/${locale}/map`);
    }
  };

  return (
    <div 
      className={`bg-[#0f0f0f] rounded-lg border border-gray-800 overflow-hidden ${!fullScreen && enableNavigation ? 'cursor-pointer hover:border-gray-600 transition-colors' : ''}`}
      onClick={handleContainerClick}
    >
      {showTitle && (
        <div className="bg-[#1a1a1a] px-6 py-3 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {t('marketHeatmap')}
          </h2>
          {!fullScreen && enableNavigation && (
            <span className="text-xs text-gray-400">Click to expand</span>
          )}
        </div>
      )}

      <div ref={containerRef} className="p-2">
        <svg ref={svgRef}></svg>
      </div>

      <div className="bg-[#1a1a1a] px-4 py-2 text-xs text-gray-400 text-center border-t border-gray-800">
        Click on any stock to view details • Green = Up • Red = Down • Updates every 2 min
      </div>
    </div>
  );
}
