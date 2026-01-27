# CryptoPulse Dashboard

A modern, real-time cryptocurrency dashboard built with React, TypeScript, and Redux Toolkit. Displays live cryptocurrency prices with WebSocket updates, interactive charts, and watchlist functionality.

![CryptoPulse Dashboard](https://via.placeholder.com/800x400?text=CryptoPulse+Dashboard)

## 🚀 Features

- **Real-time Price Updates**: Live cryptocurrency prices via Binance WebSocket
- **Interactive Charts**: Price history visualization with Recharts
- **Watchlist**: Save favorite cryptocurrencies to LocalStorage
- **Search & Filter**: Find cryptocurrencies by name or symbol
- **Responsive Design**: Mobile-first design that works on all devices
- **Performance Optimized**: React.memo and selective re-rendering for smooth UX
- **Error Handling**: Error boundaries and graceful error states
- **Loading States**: Skeleton loaders for better UX

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit (RTK)** - State management
- **RTK Query** - API data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization

### UI Components
- **shadcn/ui** - Accessible component library
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library

### APIs & Data Sources
- **CoinGecko API** - Initial cryptocurrency data (logos, names, market cap)
- **Binance WebSocket** - Real-time price updates

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cryptopulse-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🏗️ Project Structure

```
cryptopulse-dashboard/
├── src/
│   ├── components/
│   │   ├── crypto/          # Cryptocurrency-specific components
│   │   │   ├── CryptoTable.tsx
│   │   │   ├── CryptoRow.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── layout/           # Layout components
│   │   │   └── Dashboard.tsx
│   │   └── ui/               # Reusable UI components (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── skeleton.tsx
│   │       └── ...
│   ├── features/
│   │   ├── crypto/           # Crypto feature (Redux slice + API)
│   │   │   ├── cryptoSlice.ts
│   │   │   └── cryptoApi.ts
│   │   └── watchlist/        # Watchlist feature
│   │       ├── watchlistSlice.ts
│   │       └── watchlistMiddleware.ts
│   ├── hooks/
│   │   ├── redux.ts          # Typed Redux hooks
│   │   ├── useWebSocket.ts   # WebSocket connection hook
│   │   └── useDebounce.ts    # Debounce utility hook
│   ├── services/
│   │   ├── store.ts          # Redux store configuration
│   │   └── websocket.ts     # WebSocket service
│   ├── types/
│   │   └── crypto.ts         # TypeScript type definitions
│   ├── utils/
│   │   ├── localStorage.ts   # LocalStorage helpers
│   │   └── symbolMapper.ts  # CoinGecko ↔ Binance symbol mapping
│   └── constants/
│       ├── text.ts           # Text constants
│       └── styles.ts         # Style constants
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 Key Features Explained

### Real-time Price Updates
- Connects to Binance WebSocket for live price updates
- Auto-reconnects with exponential backoff on connection loss
- Only updates Redux state when price actually changes (performance optimization)

### Performance Optimizations
- **React.memo** on CryptoRow: Only re-renders when that specific coin's price changes
- **Selective subscriptions**: Each row subscribes only to its own price updates
- **Price change detection**: Prevents unnecessary updates when price hasn't changed
- **Memory management**: Limits price history to last 30 updates per coin

### Symbol Mapping
- Maps between CoinGecko symbols (e.g., `btc`) and Binance symbols (e.g., `BTCUSDT`)
- Handles edge cases (e.g., `WETH` → `ETHUSDT`)
- Enables seamless integration of static CoinGecko data with dynamic Binance updates

## 🔧 Technical Challenges & Solutions

### Challenge 1: Synchronizing Static and Dynamic Data

**Problem**: CoinGecko provides rich static data (logos, names, market cap) but updates slowly. Binance provides fast price updates but lacks metadata.

**Solution**:
- Fetch initial data from CoinGecko API (RTK Query cache)
- Stream real-time prices from Binance WebSocket
- Symbol mapping utility to match coins between APIs
- Merge logic in Redux slice to combine static + dynamic data

**Result**: Best of both worlds - rich UI with real-time updates.

### Challenge 2: Performance with High-Frequency Updates

**Problem**: WebSocket sends updates every few seconds for 20+ coins, causing excessive re-renders.

**Solution**:
- `React.memo` on CryptoRow with custom comparison function
- Each row subscribes only to its own price updates via `useAppSelector`
- Price change detection: Only dispatch Redux action if price actually changed
- Optimized selectors to prevent unnecessary re-renders

**Result**: Smooth 60fps performance even with rapid updates.

### Challenge 3: Memory Leak Prevention

**Problem**: Price history grows indefinitely, causing browser slowdown.

**Solution**:
- Limit history to last 30 updates: `history.slice(-30)`
- Cleanup WebSocket connections on component unmount
- LocalStorage persistence only for watchlist (not price history)

**Result**: Stable memory usage over long sessions.

### Challenge 4: WebSocket Connection Stability

**Problem**: WebSocket connections can drop due to network issues or server restarts.

**Solution**:
- Auto-reconnect logic with exponential backoff
- Connection state tracking
- Proper cleanup on unmount to prevent memory leaks
- Error handling and retry logic

**Result**: Resilient connection that recovers automatically from failures.

## 📱 Responsive Design

The dashboard is fully responsive with mobile-first approach:
- **Mobile (< 640px)**: Single column layout, hidden market cap column
- **Tablet (640px - 768px)**: Shows 24h change column
- **Desktop (> 768px)**: Full table with all columns visible

## 🎨 UI/UX Features

- **Loading Skeletons**: Better perceived performance during data loading
- **Error Boundaries**: Graceful error handling without crashing the app
- **Empty States**: Helpful messages when no data is available
- **Dark Mode Support**: Automatic theme detection
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier (via ESLint) for formatting
- Consistent component structure and naming

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for cryptocurrency data API
- [Binance](https://www.binance.com/) for WebSocket price feeds
- [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- [Recharts](https://recharts.org/) for chart visualization

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
