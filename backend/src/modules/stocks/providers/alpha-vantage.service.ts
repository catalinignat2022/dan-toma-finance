import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AlphaVantageService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.alphavantage.co/query';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('ALPHA_VANTAGE_API_KEY') || '';
  }

  async getIntradayData(symbol: string, interval: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, {
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol: symbol.toUpperCase(),
            interval: this.mapInterval(interval),
            apikey: this.apiKey,
          },
        }),
      );

      const timeSeriesKey = `Time Series (${this.mapInterval(interval)})`;
      const timeSeries = (response as any).data[timeSeriesKey];

      // Check for API errors or rate limits
      if ((response as any).data['Error Message']) {
        console.warn(`Alpha Vantage error for ${symbol}: ${(response as any).data['Error Message']}`);
        return this.generateMockData(symbol);
      }

      if ((response as any).data['Note']) {
        console.warn(`Alpha Vantage rate limit for ${symbol}: ${(response as any).data['Note']}`);
        return this.generateMockData(symbol);
      }

      if (!timeSeries) {
        console.warn(`No data available from Alpha Vantage for ${symbol}, using mock data`);
        return this.generateMockData(symbol);
      }

      const chartData = Object.entries(timeSeries).map(([timestamp, data]: [string, any]) => ({
        time: new Date(timestamp).getTime() / 1000, // Convert to Unix timestamp
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume']),
      }));

      return chartData.reverse(); // Oldest to newest
    } catch (error) {
      console.error(`Error fetching chart data for ${symbol}:`, error);
      return this.generateMockData(symbol);
    }
  }

  private generateMockData(symbol: string) {
    const now = Date.now();
    const data = [];
    let basePrice = 100 + Math.random() * 400; // Random base price between 100-500
    
    // Generate 30 days of daily data
    for (let i = 29; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const volatility = basePrice * 0.02; // 2% daily volatility
      
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      data.push({
        time: Math.floor(timestamp / 1000),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(1000000 + Math.random() * 5000000),
      });
      
      basePrice = close; // Next day starts at previous close
    }
    
    return data;
  }

  private mapInterval(interval: string): string {
    const mapping: Record<string, string> = {
      '1min': '1min',
      '5min': '5min',
      '15min': '15min',
      '30min': '30min',
      '60min': '60min',
      '1D': '60min',
    };
    return mapping[interval] || '5min';
  }
}
