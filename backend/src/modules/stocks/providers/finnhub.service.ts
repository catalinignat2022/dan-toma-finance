import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FinnhubService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://finnhub.io/api/v1';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('FINNHUB_API_KEY') || '';
  }

  async getQuote(symbol: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/quote`, {
          params: {
            symbol: symbol.toUpperCase(),
            token: this.apiKey,
          },
        }),
      );

      return {
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(), // Add name field
        price: response.data.c || 0,
        change: response.data.d || 0,
        changePercent: response.data.dp || 0,
        high: response.data.h,
        low: response.data.l,
        open: response.data.o,
        previousClose: response.data.pc,
        timestamp: response.data.t,
      };
    } catch (error) {
      if (error.response?.status === 429) {
        console.error(`Rate limit exceeded for ${symbol}`);
        // Return mock data to avoid breaking the app
        return {
          symbol: symbol.toUpperCase(),
          name: symbol.toUpperCase(),
          price: 0,
          change: 0,
          changePercent: 0,
          high: 0,
          low: 0,
          open: 0,
          previousClose: 0,
          timestamp: Date.now() / 1000,
        };
      }
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw error;
    }
  }

  async getMarketMovers(type: 'gainers' | 'losers' | 'active') {
    // Reduce number of stocks to avoid rate limits (60 req/min = 1 req/sec)
    const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'];
    
    // Add delay between requests to avoid rate limits
    const quotes = [];
    for (const symbol of popularStocks) {
      try {
        const quote = await this.getQuote(symbol);
        quotes.push(quote);
        // Wait 1 second between requests to respect rate limit
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to fetch ${symbol}, skipping...`);
        // Continue with other stocks even if one fails
      }
    }

    if (type === 'gainers') {
      return quotes.sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    } else if (type === 'losers') {
      return quotes.sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    } else {
      // most active - sort by absolute change
      return quotes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);
    }
  }

  async searchSymbol(query: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/search`, {
          params: {
            q: query,
            token: this.apiKey,
          },
        }),
      );

      return response.data.result.map((item: any) => ({
        symbol: item.symbol,
        description: item.description,
        type: item.type,
      }));
    } catch (error) {
      console.error(`Error searching for ${query}:`, error.message);
      throw error;
    }
  }
}
