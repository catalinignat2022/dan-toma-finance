import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AlphaVantageService } from './providers/alpha-vantage.service';
import { FinnhubService } from './providers/finnhub.service';

@Injectable()
export class StocksService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private alphaVantageService: AlphaVantageService,
    private finnhubService: FinnhubService,
  ) {}

  async getQuote(symbol: string) {
    const cacheKey = `quote_${symbol}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const quote = await this.finnhubService.getQuote(symbol);
    await this.cacheManager.set(cacheKey, quote, 15000); // 15 seconds cache
    
    return quote;
  }

  async getTopGainers() {
    const cacheKey = 'top_gainers';
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = await this.finnhubService.getMarketMovers('gainers');
    await this.cacheManager.set(cacheKey, data, 300000); // 5 minutes cache (more aggressive)
    
    return data;
  }

  async getTopLosers() {
    const cacheKey = 'top_losers';
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = await this.finnhubService.getMarketMovers('losers');
    await this.cacheManager.set(cacheKey, data, 300000); // 5 minutes cache
    
    return data;
  }

  async getMostActive() {
    const cacheKey = 'most_active';
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = await this.finnhubService.getMarketMovers('active');
    await this.cacheManager.set(cacheKey, data, 300000); // 5 minutes cache
    
    return data;
  }

  async searchStocks(query: string) {
    return this.finnhubService.searchSymbol(query);
  }

  async getChartData(symbol: string, interval: string) {
    const cacheKey = `chart_${symbol}_${interval}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const data = await this.alphaVantageService.getIntradayData(symbol, interval);
    await this.cacheManager.set(cacheKey, data, 300000); // 5 minutes cache
    
    return data;
  }
}
