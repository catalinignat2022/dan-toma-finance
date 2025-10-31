import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { StocksModule } from './modules/stocks/stocks.module';
import { CryptoModule } from './modules/crypto/crypto.module';
import { NewsModule } from './modules/news/news.module';
import { MarketModule } from './modules/market/market.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // default TTL in seconds
      max: 100, // maximum number of items in cache
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduled tasks
    ScheduleModule.forRoot(),

    // Feature modules
    StocksModule,
    CryptoModule,
    NewsModule,
    MarketModule,
  ],
})
export class AppModule {}
