import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NewsService {
  private readonly apiKey: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('FINNHUB_API_KEY') || '';
  }

  async getNews(category: string = 'general') {
    const cacheKey = `news_${category}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await firstValueFrom(
      this.httpService.get('https://finnhub.io/api/v1/news', {
        params: {
          category,
          token: this.apiKey,
        },
      }),
    );

    await this.cacheManager.set(cacheKey, (response as any).data, 300000); // 5 minutes
    return (response as any).data;
  }

  async getMarketNews() {
    return this.getNews('general');
  }
}
