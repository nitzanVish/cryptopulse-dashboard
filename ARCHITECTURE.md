# Frontend Architecture & Technical Decisions (CryptoPulse)

This document outlines the core architectural decisions made for the CryptoPulse frontend, focusing on state management, performance optimization, real-time data handling, and User Experience (UX).

## 1. The "Hybrid Chart" Engine (History + Live Data + AI Sentiment)

**The Challenge:** Displaying a professional financial chart requires a long history (24 hours), but WebSocket APIs (like Binance) only provide data from the moment of connection. Conversely, fetching full historical data via REST API (CoinGecko) for every coin upfront would immediately trigger rate limits (429 errors). Furthermore, CoinGecko's history has a 5-minute resolution, missing real-time volatility.

**The Solution:**

- **Lazy Fetching:** The 24-hour historical data is only fetched on-demand when a user opens a specific coin's chart modal.
- **The Hybrid Approach:** CoinGecko acts as the "Heavy Lifter" (fetching the 24h bulk data once), while Binance WS acts as the "Live Painter". We avoid HTTP polling entirely. Instead, every WebSocket tick creates a shallow copy of the last data point in the historical array and overwrites it with the live price. This ensures 99% of the chart remains stable, while the tip moves in real-time, maintaining data consistency across the UI.
- **AI Sentiment Integration:** The chart modal enriches the view with AI sentiment analysis from the CryptoPulse API. A `ChartStatusRow` displays current price, 24h change, and AI sentiment score (e.g. 68/100) in the header. Below the chart, an `AIInsightPanel` shows the full analysis text, sentiment badge, and last-updated time—giving users context alongside the price history.

## 2. Caching Strategy & "Rolling Window" Prevention

**The Challenge:** How long should we cache historical chart data? A long cache (e.g., 2 hours) creates a flatline "gap" between the end of the historical data and the newly arriving live WebSocket data when a user reopens the modal.

**The Solution:**

- **Short-TTL Cache:** Configured a 5-minute cache limit (`keepUnusedDataFor: 300`) in RTK Query.
- **Resolution Syncing:** This 5-minute timeframe was carefully chosen to perfectly match CoinGecko's native 5-minute data resolution. It successfully prevents API spam if a user rapidly opens and closes the modal, while ensuring the chart remains continuous and mathematically accurate without visual gaps.

## 3. Data Normalization & O(1) Lookups

**The Challenge:** Receiving large arrays of data (e.g., AI-generated sentiment analysis or top 50 coin lists) and iterating through them using `Array.find()` for every table row results in O(n) time complexity, leading to sluggish re-renders.

**The Solution:**

- **Pre-computation:** Leveraged RTK Query's `transformResponse` at the API gateway to normalize incoming arrays into Dictionary/Map structures (`Record<string, Data>`).
- **Instant Access:** By handling case-sensitivity upfront (e.g., standardizing symbols to `.toLowerCase()`), the UI components can access complex data via direct property lookups in O(1) time, ensuring silky-smooth table performance.

## 4. UI/UX Edge Cases: Stablecoins & Micro-Caps

**The Challenge:** Cryptocurrency assets have extreme price variations. Applying a standard 2-decimal fiat formatter makes micro-cap coins (e.g., $0.000014) appear as $0.00. Additionally, Stablecoins (like USDT) have no meaningful market volatility or AI sentiment.

**The Solution:**

- **Dynamic Currency Formatting:** Created a smart formatter that dynamically detects asset value. It strictly enforces 2 decimal places for standard assets but automatically expands up to 6 decimal places for assets valued under $1.00, preventing loss of visual resolution.
- **Graceful Fallbacks:** Stablecoins are intentionally filtered out of the AI sentiment engine. Instead of leaving empty, broken UI cells, a dedicated `<NoSentimentBadge />` component is rendered with an informative tooltip, explaining the N/A status to the user.

## 5. React Rendering Optimization & Memory Management

**The Challenge:** Managing an application that receives high-frequency WebSocket updates (multiple times per second) requires strict control over component lifecycles to prevent memory leaks and UI freezing.

**The Solution:**

- **Strategic Omission of Memoization:** Intentionally avoided wrapping the `<PriceChart>` in `React.memo` or using `useMemo` for the array merging logic. Because the modal unmounts on close, and the live price dependency changes every second anyway, memoization would only add React evaluation overhead without providing any actual caching benefits.
- **RTK Query Cache Immutability:** Directly mutating the RTK Query cache to update the last chart point would throw a strict mutation error. Instead, the component uses the spread operator (`...`) to create a new object instance solely for the final data point. This safely triggers React's shallow comparison, allowing the chart to re-render the live tip efficiently while respecting RTK Query's immutability rules.

## 6. AI Sentiment in the Price Chart Modal

**The Design:** When a user opens a coin's price chart modal, the view is augmented with AI sentiment data from the CryptoPulse API. The sentiment is fetched via `useGetAllSentimentsQuery` and selected by coin symbol. Two new presentational components structure the UI:

- **ChartStatusRow:** Displays current price, 24h price change (amount and percent), and an AI Sentiment badge (score/100 with color-coded variant). Keeps key metrics visible above the chart.
- **AIInsightPanel:** Renders below the chart when sentiment data exists. Shows a lightbulb icon, "AI Analysis Insight" title, the analysis text, sentiment score badge, and relative "Last updated" time. Uses `formatRelativeTime` for human-readable timestamps (e.g. "36 mins ago").
