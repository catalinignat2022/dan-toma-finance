import { Controller, Get, Param } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('quote/:symbol')
  async getQuote(@Param('symbol') symbol: string) {
    return this.cryptoService.getQuote(symbol);
  }

  @Get('trending')
  async getTrending() {
    return this.cryptoService.getTrending();
  }
}
