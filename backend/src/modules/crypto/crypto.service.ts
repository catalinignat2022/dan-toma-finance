import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CryptoService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  async getQuote(symbol: string) {
    const cacheKey = `crypto_${symbol}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Using CoinGecko API (free, no API key needed)
    const coinId = symbol.toLowerCase();
    const response = await firstValueFrom(
      this.httpService.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true,
        },
      }),
    );

    const data = (response as any).data[coinId];
    await this.cacheManager.set(cacheKey, data, 30000); // 30 seconds cache
    
    return data;
  }

  async getTrending() {
    const cacheKey = 'crypto_trending';
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await firstValueFrom(
      this.httpService.get('https://api.coingecko.com/api/v3/search/trending'),
    );

    await this.cacheManager.set(cacheKey, (response as any).data, 300000); // 5 minutes
    return (response as any).data;
  }
}
