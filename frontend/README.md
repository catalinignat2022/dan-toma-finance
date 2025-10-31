# Finviz Clone - Frontend

Modern, responsive frontend built with Next.js 15 and React 19 for stock and crypto market visualization.

## Features

- 📊 Real-time market data visualization
- 🌐 Internationalization (English & Romanian)
- 📈 Interactive charts with TradingView Lightweight Charts
- 🎨 Beautiful UI with Tailwind CSS
- 🌙 Dark mode support
- ⚡ Server-Side Rendering for better SEO
- 📱 Fully responsive design

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS 3
- **Internationalization:** next-intl
- **Charts:** TradingView Lightweight Charts
- **HTTP Client:** Axios
- **State Management:** Zustand + TanStack Query
- **TypeScript:** Full type safety

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for production

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/         # Internationalized routes
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   ├── home/             # Homepage components
│   │   └── charts/           # Chart components
│   ├── lib/                  # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   ├── i18n.ts               # i18n configuration
│   └── middleware.ts         # Next.js middleware for i18n
├── messages/
│   ├── en.json               # English translations
│   └── ro.json               # Romanian translations
├── public/                   # Static assets
└── package.json
```

## Internationalization

The app supports English (default) and Romanian. Translation files are located in `/messages`:

- `en.json` - English translations
- `ro.json` - Romanian translations

### Adding new translations

1. Add the key to both `en.json` and `ro.json`
2. Use the translation in components with `useTranslations` hook:

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('title')}</h1>;
}
```

### Switching languages

Users can switch languages using the language selector in the header (EN/RO buttons).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Routes

- `/` or `/en` - Homepage (English)
- `/ro` - Homepage (Romanian)
- `/[locale]/stocks` - Stocks page (to be implemented)
- `/[locale]/crypto` - Crypto page (to be implemented)
- `/[locale]/news` - News page (to be implemented)

## Components

### Layout Components
- `Header` - Navigation header with language switcher
- `Footer` - Page footer

### Home Components
- `MarketIndices` - Display major indices (SPY, DIA, QQQ, IWM)
- `MarketOverview` - Market overview with top movers
- `TopMovers` - Grid of top gainers, losers, and most active
- `NewsSection` - Latest market news

## Integration with Backend

The frontend communicates with the backend API through Axios:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Example: Fetch market indices
const response = await axios.get(`${API_URL}/market/indices`);
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the app and deploy the `.next` folder:

```bash
npm run build
```

## Performance

- Server-Side Rendering (SSR) for better SEO
- Code splitting with Next.js App Router
- Image optimization with Next.js Image component
- Automatic caching and revalidation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
