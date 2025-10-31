# Finviz Clone - Backend

Backend API built with NestJS for stock and crypto market data aggregation.

## Features

- 📊 Stock quotes (real-time with Finnhub)
- 📈 Chart data (Alpha Vantage)
- 🪙 Cryptocurrency data (CoinGecko)
- 📰 Market news (Finnhub)
- ⚡ Redis caching for performance
- 🔒 Rate limiting
- 🎯 RESTful API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Add your API keys to `.env`:
- Get Alpha Vantage key: https://www.alphavantage.co/support/#api-key
- Get Finnhub key: https://finnhub.io/register
- Both are FREE!

4. Start development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Stocks
- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/top-gainers` - Top gaining stocks
- `GET /api/stocks/top-losers` - Top losing stocks
- `GET /api/stocks/most-active` - Most active stocks
- `GET /api/stocks/search?q=AAPL` - Search stocks
- `GET /api/stocks/chart/:symbol?interval=1D` - Chart data

### Crypto
- `GET /api/crypto/quote/:symbol` - Get crypto quote
- `GET /api/crypto/trending` - Trending cryptocurrencies

### News
- `GET /api/news` - Market news
- `GET /api/news/market` - Market-specific news

### Market
- `GET /api/market/overview` - Market overview (gainers, losers, active)
- `GET /api/market/indices` - Major indices (SPY, DIA, QQQ, IWM)

## Tech Stack

- NestJS 10
- TypeScript
- Axios (HTTP client)
- Cache Manager (Redis caching)
- Class Validator (validation)

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Lint code
- `npm run test` - Run tests
