'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useTranslations } from 'next-intl';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface StockChartProps {
  symbol: string;
  interval?: '1min' | '5min' | '15min' | '30min' | '60min' | 'daily' | 'weekly' | 'monthly';
  height?: number;
}

export function StockChart({ symbol, interval = '60min', height = 500 }: StockChartProps) {
  const t = useTranslations('chart');
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeInterval, setActiveInterval] = useState(interval);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
      },
      watermark: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/stocks/chart/${symbol}?interval=${activeInterval}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }

        const data: ChartData[] = await response.json();

        if (candlestickSeriesRef.current && data.length > 0) {
          // Convert data to chart format
          const chartData = data.map(d => ({
            time: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));

          candlestickSeriesRef.current.setData(chartData as any);

          // Set volume data if available
          if (volumeSeriesRef.current && data.some(d => d.volume)) {
            const volumeData = data
              .filter(d => d.volume)
              .map(d => ({
                time: d.time,
                value: d.volume!,
                color: d.close >= d.open ? '#22c55e80' : '#ef444480',
              }));

            volumeSeriesRef.current.setData(volumeData as any);
          }

          // Fit content
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    if (symbol) {
      fetchChartData();
    }
  }, [symbol, activeInterval]);

  const timeframes = [
    { label: t('1min'), value: '1min' },
    { label: t('5min'), value: '5min' },
    { label: t('15min'), value: '15min' },
    { label: t('30min'), value: '30min' },
    { label: t('1hour'), value: '60min' },
    { label: t('daily'), value: 'daily' },
    { label: t('weekly'), value: 'weekly' },
    { label: t('monthly'), value: 'monthly' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {symbol}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('chartTitle')}
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setActiveInterval(tf.value as typeof activeInterval)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeInterval === tf.value
                  ? 'bg-white dark:bg-gray-700 text-primary shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('loading')}</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="text-center text-red-500">
              <p className="font-semibold">Failed to load chart</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        )}

        <div ref={chartContainerRef} className="relative" />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded"></div>
          <span>{t('up')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-danger rounded"></div>
          <span>{t('down')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span>{t('volume')}</span>
        </div>
      </div>
    </div>
  );
}
