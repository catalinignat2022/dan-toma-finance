import { Injectable } from '@nestjs/common';
import { StocksService } from '../stocks/stocks.service';

@Injectable()
export class MarketService {
  constructor(private stocksService: StocksService) {}

  async getOverview() {
    const [gainers, losers, active] = await Promise.all([
      this.stocksService.getTopGainers(),
      this.stocksService.getTopLosers(),
      this.stocksService.getMostActive(),
    ]);

    return {
      topGainers: Array.isArray(gainers) ? gainers.slice(0, 5) : [],
      topLosers: Array.isArray(losers) ? losers.slice(0, 5) : [],
      mostActive: Array.isArray(active) ? active.slice(0, 5) : [],
    };
  }

  async getIndices() {
    const indices = ['SPY', 'DIA', 'QQQ', 'IWM']; // S&P 500, Dow, Nasdaq, Russell 2000
    
    const data = await Promise.all(
      indices.map(symbol => this.stocksService.getQuote(symbol)),
    );

    return data;
  }
}
