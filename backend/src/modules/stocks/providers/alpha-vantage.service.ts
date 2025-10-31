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

      if (!timeSeries) {
        throw new Error('No data available');
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
      throw error;
    }
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
