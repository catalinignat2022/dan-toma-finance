import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [StocksModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
