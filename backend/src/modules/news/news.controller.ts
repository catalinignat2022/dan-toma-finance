import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews(@Query('category') category?: string) {
    return this.newsService.getNews(category);
  }

  @Get('market')
  async getMarketNews() {
    return this.newsService.getMarketNews();
  }
}
