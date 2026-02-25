/**
 * Text Constants
 * 
 * Centralized text strings for the CryptoPulse Dashboard application.
 * This makes it easier to:
 * - Maintain consistent text across the app
 * - Update text in one place
 * - Add internationalization (i18n) support in the future
 */

export const TEXT = {
  // Dashboard
  dashboard: {
    title: 'CryptoPulse Dashboard',
    subtitle: 'Real-time cryptocurrency prices and market data',
  },

  // CryptoTable
  cryptoTable: {
    title: 'Top Cryptocurrencies',
    loading: 'Loading cryptocurrencies...',
    error: 'Failed to fetch cryptocurrency data',
    empty: 'No cryptocurrencies found',
  },

  // Table Headers
  tableHeaders: {
    coin: 'Coin',
    price: 'Price',
    change24h: '24h Change',
    marketCap: 'Market Cap',
    sentiment: 'Sentiment',
  },

  // Error Messages
  errors: {
    loadingData: 'Error loading data',
    fetchFailed: 'Failed to fetch data',
  },

  // Empty States
  emptyStates: {
    noData: 'No data found',
  },

  // Loading States
  loading: {
    default: 'Loading...',
  },

  // Common
  common: {
    notAvailable: 'N/A',
  },

  // Search
  search: {
    placeholder: 'Search by name or symbol...',
    noResults: 'No cryptocurrencies match your search',
  },

  // Watchlist
  watchlist: {
    showAll: 'Show All',
    showWatchlist: 'Show Watchlist',
    empty: 'No coins in your watchlist',
    emptyWithSearch: 'No watchlist coins match your search',
    addToWatchlist: 'Add to watchlist',
    removeFromWatchlist: 'Remove from watchlist',
  },

  // Sentiment
  sentiment: {
    notAvailable: 'N/A',
    notAvailableTooltip: 'Sentiment data not available for this asset',
  },

  // Price Chart
  chart: {
    loading: 'Loading chart...',
    noData: 'No chart data available for the past 24 hours.',
    footer: 'Past 24 Hours • Live Updates',
  },
} as const;
