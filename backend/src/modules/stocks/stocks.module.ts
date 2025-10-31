import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { AlphaVantageService } from './providers/alpha-vantage.service';
import { FinnhubService } from './providers/finnhub.service';

@Module({
  imports: [HttpModule],
  controllers: [StocksController],
  providers: [StocksService, AlphaVantageService, FinnhubService],
  exports: [StocksService],
})
export class StocksModule {}
