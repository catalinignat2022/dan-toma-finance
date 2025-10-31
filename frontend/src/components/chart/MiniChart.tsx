'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, ColorType } from 'lightweight-charts';

interface ChartData {
  time: string;
  value: number;
}

interface MiniChartProps {
  symbol: string;
  title: string;
  data: ChartData[];
  change?: number;
  changePercent?: number;
  currentPrice?: number;
}

export function MiniChart({ 
  symbol, 
  title, 
  data, 
  change = 0, 
  changePercent = 0,
  currentPrice 
}: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);

  const isPositive = changePercent >= 0;

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 120,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
      },
      handleScroll: false,
      handleScale: false,
      watermark: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Create area series
    const series = chart.addAreaSeries({
      topColor: isPositive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
      bottomColor: isPositive ? 'rgba(34, 197, 94, 0.0)' : 'rgba(239, 68, 68, 0.0)',
      lineColor: isPositive ? '#22c55e' : '#ef4444',
      lineWidth: 2,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
    });

    seriesRef.current = series;

    // Set data
    if (data.length > 0) {
      series.setData(data as any);
      chart.timeScale().fitContent();
    }

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
  }, [data, isPositive]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="mb-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {symbol}
          </span>
        </div>
        
        {currentPrice && (
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentPrice.toFixed(2)}
          </div>
        )}
        
        <div className={`text-sm font-medium ${
          isPositive ? 'text-success' : 'text-danger'
        }`}>
          {isPositive ? '+' : ''}{change?.toFixed(2)} ({isPositive ? '+' : ''}{changePercent?.toFixed(2)}%)
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="w-full" style={{ minHeight: '120px' }} />
    </div>
  );
}
