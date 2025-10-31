# 📊 FinViz Clone - Stock & Crypto Market Platform

A modern, full-stack financial market data aggregation platform inspired by Finviz.com. Built with Next.js 15, React 19, NestJS, and TradingView Lightweight Charts.

## 🚀 Features

- 📈 **Real-time Stock Data** - Live quotes, charts, and market data
- 🪙 **Cryptocurrency Tracking** - Real-time crypto prices and trends
- 📰 **Market News** - Aggregated financial news from multiple sources
- 📊 **Interactive Charts** - Professional trading charts with TradingView Lightweight Charts
- 🌐 **Internationalization** - English and Romanian languages
- 🌙 **Dark Mode** - Beautiful dark/light theme
- ⚡ **High Performance** - Optimized with caching and SSR
- 📱 **Responsive Design** - Works on all devices

## 🏗️ Architecture

### Backend (NestJS)
- **Framework:** NestJS 10 with TypeScript
- **API Integration:** Finnhub, Alpha Vantage, CoinGecko
- **Caching:** Redis for performance optimization
- **Features:** Rate limiting, validation, error handling

### Frontend (Next.js)
- **Framework:** Next.js 15 with App Router
- **UI:** React 19, Tailwind CSS
- **Charts:** TradingView Lightweight Charts
- **i18n:** next-intl for translations
- **State:** Zustand + TanStack Query

## 📁 Project Structure

```
dan-toma-project/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── stocks/     # Stock data endpoints
│   │   │   ├── crypto/     # Crypto data endpoints
│   │   │   ├── news/       # News aggregation
│   │   │   └── market/     # Market overview
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # Next.js Frontend App
│   ├── src/
│   │   ├── app/
│   │   │   └── [locale]/   # Internationalized routes
│   │   ├── components/
│   │   │   ├── layout/     # Header, Footer
│   │   │   ├── home/       # Homepage components
│   │   │   └── charts/     # Chart components
│   │   ├── i18n.ts         # i18n config
│   │   └── middleware.ts   # i18n middleware
│   ├── messages/
│   │   ├── en.json         # English translations
│   │   └── ro.json         # Romanian translations
│   ├── package.json
│   └── next.config.mjs
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- npm or yarn
- (Optional) Redis for caching

### 1. Clone & Install

```bash
# Navigate to project directory
cd dan-toma-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Get API Keys (FREE!)

#### Finnhub (Stock Data)
1. Visit: https://finnhub.io/register
2. Sign up for FREE account
3. Get your API key (60 requests/minute free tier)

#### Alpha Vantage (Chart Data)
1. Visit: https://www.alphavantage.co/support/#api-key
2. Get FREE API key (25 requests/day)

### 3. Configure Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your favorite editor
```

```env
# .env file
FINNHUB_API_KEY=your_finnhub_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 4. Configure Frontend

```bash
cd frontend

# Copy environment template
cp .env.local.example .env.local

# Edit if needed (default values work for local development)
```

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
Backend will run on: `http://localhost:3001`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

### 6. Open Browser

Visit: `http://localhost:3000`

🎉 **Done!** Your FinViz clone is running!

## 📖 API Documentation

### Backend Endpoints

#### Stocks
- `GET /api/stocks/quote/:symbol` - Get stock quote
- `GET /api/stocks/top-gainers` - Top gaining stocks
- `GET /api/stocks/top-losers` - Top losing stocks
- `GET /api/stocks/most-active` - Most active stocks
- `GET /api/stocks/search?q=AAPL` - Search stocks
- `GET /api/stocks/chart/:symbol?interval=1D` - Chart data

#### Crypto
- `GET /api/crypto/quote/:symbol` - Get crypto quote
- `GET /api/crypto/trending` - Trending cryptocurrencies

#### News
- `GET /api/news` - Market news
- `GET /api/news/market` - Market-specific news

#### Market
- `GET /api/market/overview` - Market overview
- `GET /api/market/indices` - Major indices

### Example API Calls

```bash
# Get Apple stock quote
curl http://localhost:3001/api/stocks/quote/AAPL

# Get Bitcoin price
curl http://localhost:3001/api/crypto/quote/bitcoin

# Get top gainers
curl http://localhost:3001/api/stocks/top-gainers

# Search for stocks
curl http://localhost:3001/api/stocks/search?q=TESLA
```

## 🌐 Internationalization

The app supports **English (default)** and **Romanian**.

### Switch Language
Click the **EN/RO** buttons in the header.

### Add New Language
1. Create `messages/[lang].json`
2. Add translations
3. Update `src/i18n.ts` and `src/middleware.ts`

## 📊 Chart Integration

The app uses **TradingView Lightweight Charts** (MIT License, FREE).

### Features
- Candlestick charts
- Multiple timeframes (1D, 1W, 1M, 1Y)
- Real-time updates
- Touch gestures for mobile
- Dark/Light themes

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#1a73e8', // Your brand color
    },
  },
},
```

### Add New Pages
1. Create route: `frontend/src/app/[locale]/yourpage/page.tsx`
2. Add translations to `messages/en.json` and `messages/ro.json`
3. Add navigation link in `Header.tsx`

## 🚀 Production Deployment

### Backend (NestJS)

```bash
cd backend
npm run build
npm run start:prod
```

Deploy to:
- **Heroku**
- **AWS EC2/ECS**
- **DigitalOcean**
- **Railway**

### Frontend (Next.js)

```bash
cd frontend
npm run build
```

Deploy to:
- **Vercel** (Recommended - 1-click deploy)
- **Netlify**
- **AWS Amplify**
- **Railway**

### Environment Variables (Production)

**Backend:**
- `NODE_ENV=production`
- `PORT=3001`
- `FINNHUB_API_KEY=your_key`
- `ALPHA_VANTAGE_API_KEY=your_key`
- `CORS_ORIGIN=https://yourdomain.com`

**Frontend:**
- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`

## 📦 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js | 15.0+ |
| UI Library | React | 19.0+ |
| Backend Framework | NestJS | 10.3+ |
| Language | TypeScript | 5.3+ |
| Styling | Tailwind CSS | 3.4+ |
| Charts | Lightweight Charts | 4.1+ |
| i18n | next-intl | 3.19+ |
| HTTP Client | Axios | 1.6+ |
| Caching | Redis (optional) | Latest |

## 🔧 Development Tips

### Hot Reload
Both backend and frontend support hot reload during development.

### TypeScript
Full type safety throughout the stack. Run type check:

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify API keys in `.env`
- Run `npm install` again

### Frontend won't connect to backend
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running on port 3001
- Check browser console for CORS errors

### API rate limits
- Finnhub: 60 req/minute (free tier)
- Alpha Vantage: 25 req/day (free tier)
- Use caching to reduce API calls

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For questions or issues, please create an issue on GitHub.

---

**Built with ❤️ using Next.js, React, NestJS & TypeScript**
