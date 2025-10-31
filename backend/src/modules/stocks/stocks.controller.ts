import { Controller, Get, Query, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('quote/:symbol')
  async getQuote(@Param('symbol') symbol: string) {
    return this.stocksService.getQuote(symbol);
  }

  @Get('top-gainers')
  async getTopGainers() {
    return this.stocksService.getTopGainers();
  }

  @Get('top-losers')
  async getTopLosers() {
    return this.stocksService.getTopLosers();
  }

  @Get('most-active')
  async getMostActive() {
    return this.stocksService.getMostActive();
  }

  @Get('search')
  async searchStocks(@Query('q') query: string) {
    return this.stocksService.searchStocks(query);
  }

  @Get('chart/:symbol')
  async getChartData(
    @Param('symbol') symbol: string,
    @Query('interval') interval: string = '1D',
  ) {
    return this.stocksService.getChartData(symbol, interval);
  }
}
