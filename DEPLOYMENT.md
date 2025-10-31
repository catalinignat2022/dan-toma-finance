# 🚀 Deployment Guide

## Repository
**GitHub**: https://github.com/catalinignat2022/dan-toma-finance

## Quick Clone & Setup

```bash
# Clone repository
git clone https://github.com/catalinignat2022/dan-toma-finance.git
cd dan-toma-finance

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run start:dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables Needed

### Backend (.env)
- `FINNHUB_API_KEY` - Get from https://finnhub.io/register
- `ALPHA_VANTAGE_API_KEY` - Get from https://www.alphavantage.co/support/#api-key

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Default: http://localhost:3001/api

## Production Deployment Options

### Frontend (Vercel - Recommended)
1. Import repository in Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url/api`
3. Deploy automatically

### Backend (Railway/Heroku/DigitalOcean)
1. Create new app
2. Connect GitHub repository
3. Set environment variables:
   - `FINNHUB_API_KEY`
   - `ALPHA_VANTAGE_API_KEY`
   - `PORT=3001`
   - `CORS_ORIGIN=https://your-frontend-url`
4. Deploy

## Features
✅ Real-time stock & crypto data
✅ Interactive charts (TradingView)
✅ Market news aggregation
✅ Bilingual (EN/RO)
✅ Dark/Light mode
✅ Responsive design
✅ Rate limiting & caching
✅ Full TypeScript

## Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: NestJS 10, TypeScript
- **Charts**: TradingView Lightweight Charts
- **APIs**: Finnhub, Alpha Vantage, CoinGecko

---

**Built with ❤️ by Catalin Ignat**
